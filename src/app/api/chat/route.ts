import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  buildSystemPrompt,
  EMERGENCY_KEYWORDS,
  EMERGENCY_REPLY,
  NOT_CONFIGURED_REPLY,
  FALLBACK_REPLY,
} from '@/lib/bot-knowledge';

// WO-WEB-06: API cho Bot hỗ trợ người dân.
// Luồng: sàng lọc khẩn cấp (xác định, không qua AI) -> truy xuất bài viết
// liên quan -> DeepSeek chính, OpenRouter rồi Gemini dự phòng -> ghi nhật ký chat_logs.
// Khóa API chỉ nằm ở biến môi trường phía server.

export const dynamic = 'force-dynamic';

const STOPWORDS = new Set([
  'những', 'được', 'không', 'gì', 'nào', 'thế', 'sao', 'khi', 'bị', 'đã', 'đang', 'sẽ',
  'của', 'và', 'cho', 'hỏi', 'muốn', 'biết', 'có', 'là', 'thì', 'ở', 'tại', 'đến', 'đi',
  'ra', 'vào', 'lên', 'với', 'từ', 'các', 'này', 'đó', 'em', 'anh', 'chị', 'xin', 'về',
  'ngày', 'tháng', 'trạm', 'theo', 'sau', 'trước', 'gồm',
]);

// Giới hạn lượt gọi đơn giản theo IP (bộ nhớ tạm của tiến trình).
const rateMap = new Map<string, { count: number; resetAt: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 5 * 60 * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 20;
}

// Route này chỉ cần khóa anon công khai: đọc posts (công khai) và ghi nhật
// ký qua hàm log_chat SECURITY DEFINER. Không phụ thuộc service role key.
function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function logChat(question: string, answer: string, provider: string) {
  try {
    const sb = serverClient();
    if (!sb) return;
    const { error } = await sb.rpc('log_chat', { q: question, a: answer, p: provider });
    if (error) console.error('WO-WEB-06 log_chat failed:', error.message);
  } catch (e) {
    // Ghi nhật ký lỗi không được làm hỏng câu trả lời, nhưng phải để lại dấu vết.
    console.error('WO-WEB-06 log_chat exception:', e);
  }
}

function stripHtml(html: string): string {
  return (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function syllablesOf(question: string): string[] {
  const toks = question
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));
  return Array.from(new Set(toks)).slice(0, 8);
}

// WO-WEB-08 (tinh chinh truy xuat): tach ma so van ban khoi am tiet chu de.
// Token chua chu so kem "/" hoac "-" (vd "13/2026/TT-BYT" trong cau hoi
// "Theo Thong tu 13/2026/TT-BYT...") hoac token toan chu so la ma tham
// chieu, khong phai noi dung chu de: de chung chiem tran 8 am tiet thi cac
// am tiet noi dung (tiem, chung, bat, buoc...) bi cat het va doan dich
// khong con co hoi vao nhom chon. Cap so dau cua ma (vd "13/2026") dung
// de nhan dien van ban duoc neu dich danh trong cau hoi.
function chunkSyllablesOf(question: string): { syl: string[]; digitGroups: string[]; bigrams: string[] } {
  const survives = (w: string) => w.length >= 2 && !STOPWORDS.has(w);
  const topical: string[] = [];
  const digitGroups: string[] = [];
  // WO-WEB-09: chuoi am tiet THO (chua loai tu dung) de dung cum 2 am tiet.
  // Cum dung tu chuoi da loc (cach cu) bi dut khi mot am tiet noi dung la
  // tu dung dung rieng: "xin" la tu dung (xin hoi) nhung lai la am tiet
  // thu hai cua "vac xin", khien cum khoa quan trong nhat cua mien tiem
  // chung khong bao gio thanh don vi truy xuat. Cum tho chi bi loai khi
  // CA HAI am tiet deu la tu dung.
  const rawPieces: string[] = [];
  for (const part of question.toLowerCase().split(/\s+/)) {
    const pieces = part.replace(/[^\p{L}\p{N}]/gu, ' ').split(/\s+/).filter(Boolean);
    const hasDigit = /\p{N}/u.test(part);
    const isCode =
      hasDigit &&
      (/[/-]/.test(part) ||
        (/^[\p{L}\p{N}.,;:()]+$/u.test(part) &&
          /^\p{N}+$/u.test(part.replace(/[^\p{L}\p{N}]/gu, ''))));
    if (isCode) {
      for (const p of pieces) if (/^\p{N}+$/u.test(p)) digitGroups.push(p);
      continue;
    }
    for (const p of pieces) {
      if (p.length >= 2) rawPieces.push(p);
      if (survives(p)) topical.push(p);
    }
  }
  const rawBigrams: string[] = [];
  for (let i = 0; i + 1 < rawPieces.length; i++) {
    const a = rawPieces[i];
    const b = rawPieces[i + 1];
    if (STOPWORDS.has(a) && STOPWORDS.has(b)) continue;
    rawBigrams.push(`${a} ${b}`);
  }
  return {
    syl: Array.from(new Set(topical)).slice(0, 8),
    digitGroups,
    bigrams: Array.from(new Set(rawBigrams)).slice(0, 12),
  };
}

type Source = { title: string; url: string };

// WO-WEB-07: Truy xuat kho phap luat bang cum 2 am tiet + trong so IDF.
// Tieng Viet la ngon ngu don am: cham theo am tiet le rat nhieu, nen don vi
// truy xuat chinh la cum 2 am tiet lien ke (vd "tiêm chủng", "bắt buộc",
// "phản vệ"), trong so theo do hiem trong kho (IDF), cong diem tan suat
// xuat hien va khop o nhan Dieu/muc. Bai viet giu cach cham rieng don gian.
async function retrieveContext(question: string) {
  const empty = { context: '', sources: [] as Source[] };
  const sb = serverClient();
  if (!sb) return empty;
  const syl = syllablesOf(question);
  if (syl.length === 0) return empty;

  // Doan phap luat cham theo am tiet chu de da tach ma van ban (WO-WEB-08);
  // bai viet ben duoi van dung syl goc nhu truoc.
  const chunkSyl = chunkSyllablesOf(question);
  const units = [
    ...chunkSyl.bigrams.map((u) => ({ u, mult: 3 })),
    ...chunkSyl.syl.map((u) => ({ u, mult: 1 })),
  ];

  // WO-WEB-09: cham tren TOAN BO bang bot_chunks thay vi pool ung vien
  // 12 doan/don vi cua truy van ILIKE. Pool cu phu thuoc thu tu quet bang
  // khong xac dinh cua PostgREST (khong ORDER BY): cung mot cau hoi, doan
  // dich co luc vao pool co luc khong, nen ket qua truy xuat live dao dong
  // du du lieu khong doi (su co cau hoi "loai vac xin trong TCMR" ngay
  // 02/11/2026). Bang chi co vai tram doan nen tai mot lan va cham cuc bo:
  // IDF dem tren cung tap nay, tuong duong cac truy van dem truoc day.
  const { data: allRows } = await sb
    .from('bot_chunks')
    .select('id, doc_code, doc_title, section, content')
    .order('ord', { ascending: true })
    .limit(1000);
  const rows = ((allRows || []) as any[]).map((r) => ({
    ...r,
    _cl: (r.content || '').toLowerCase(),
    _sl: (r.section || '').toLowerCase(),
  }));
  const TOTAL = rows.length > 0 ? rows.length : 321;

  const perUnit = units.map(({ u, mult }) => {
    const count = rows.reduce((n, r) => n + (r._cl.includes(u) ? 1 : 0), 0);
    const w = Math.log(1 + TOTAL / Math.max(1, count));
    return { u, mult, w };
  });

  // Van ban duoc neu dich danh trong cau hoi (cap so dau cua ma, vd
  // "13/2026"): cac doan cua van ban do duoc cong diem phang o buoc cham
  // ben duoi (WO-WEB-08; nay loc cuc bo tren tap da tai thay vi truy van
  // rieng, hanh vi khong doi).
  const namedTitles = new Set<string>();
  const namedCount = new Map<string, number>();
  if (chunkSyl.digitGroups.length >= 2) {
    const pair = `${chunkSyl.digitGroups[0]}/${chunkSyl.digitGroups[1]}`;
    for (const r of rows) {
      if (((r.doc_title as string) || '').toLowerCase().includes(pair)) {
        namedTitles.add(r.doc_title as string);
        namedCount.set(r.doc_title as string, (namedCount.get(r.doc_title as string) || 0) + 1);
      }
    }
  }
  const scored = rows
    .map((c) => {
      const cl = c._cl as string;
      const sl = c._sl as string;
      let score = 0;
      // Vung tieu de cua doan (WO-WEB-08): moc mo Dieu/Muc/Chuong/Phan trong
      // 400 ky tu dau (doan mo dau bang ghi chu hieu luc chen truoc van tim
      // thay moc sau phan ghi chu), tinh den moc liet ke " 1. " dau tien
      // (toi da 160 ky tu); Dieu khong co moc liet ke thi lay 64 ky tu ke
      // tu moc. WO-WEB-09: don vi khop trong vung tieu de duoc cong them
      // w * mult * 2 (truoc la * 1), vi tieu de Dieu noi dung luong cua ca
      // doan trong vai cum tu va la tin hieu manh nhat cho doan liet ke
      // ngan (moi cum khoa chi xuat hien mot lan trong than doan).
      let head = '';
      const hm = cl.slice(0, 400).match(/(điều|mục|chương|phần)\s+\d+\s*\./);
      if (hm && typeof hm.index === 'number') {
        const rest = cl.slice(hm.index);
        const hIdx = rest.search(/\s1\.\s/);
        head = hIdx > 10 ? rest.slice(0, Math.min(hIdx, 160)) : rest.slice(0, 64);
      }
      for (const pu of perUnit) {
        const occ = Math.min(cl.split(pu.u).length - 1, 2);
        const inSection = sl.includes(pu.u);
        const inHead = head !== '' && head.includes(pu.u);
        if (occ > 0 || inSection || inHead)
          score += pu.w * pu.mult * (occ + (inSection ? 2 : 0) + (inHead ? 2 : 0));
      }
      if (namedTitles.has(c.doc_title as string)) {
        score += 3 * Math.log(1 + TOTAL / Math.max(1, namedCount.get(c.doc_title as string) || 1));
      }
      return {
        doc_code: (c.doc_code || c.doc_title) as string,
        doc_title: c.doc_title as string,
        section: (c.section || '') as string,
        content: c.content as string,
        score,
      };
    })
    .filter((c) => c.score > 1)
    .sort((a, b) => b.score - a.score);

  // WO-WEB-09: moi van ban toi da 3 doan trong nhom chon. Mot muc dai cua
  // mot van ban (vd Muc 5 Nghi dinh 165/2026) co the chiem ca 4 vi tri vi
  // cac doan lien tiep dung chung tu vung; gioi han nay giu cho doan dich
  // cua van ban khac con cho, nhung van cho phep mot van ban chuyen sau
  // (vd Thong tu 51/2017 ve phan ve) giu 3 vi tri dau.
  // WO-WEB-11: nhom chon gom 5 doan thay vi 4. Voi cac cach hoi liet ke
  // (vd "Cac loai vac xin trong Chuong trinh tiem chung mo rong la gi?"),
  // doan danh muc dung noi dung (Dieu 3 TT 13/2026) chi thua doan thu tuc
  // o vi tri chon cuoi mot khoang diem rat nho; 5 doan giu duoc ca ngu
  // canh thu tuc lan doan danh muc, kem theo tran 3 doan/van ban o tren.
  const chunks: typeof scored = [];
  const seenSection = new Set<string>();
  const docPicked = new Map<string, number>();
  for (const c of scored) {
    const k = `${c.doc_title}|${c.section}`;
    if (seenSection.has(k)) continue;
    if ((docPicked.get(c.doc_code) || 0) >= 3) continue;
    seenSection.add(k);
    docPicked.set(c.doc_code, (docPicked.get(c.doc_code) || 0) + 1);
    chunks.push(c);
    if (chunks.length >= 5) break;
  }

  // Bai viet: cham theo am tiet khop tieu de (x3) va noi dung (x1)
  const postMap = new Map<string, any>();
  for (const w of syl) {
    const { data } = await sb.from('posts').select('id, title, content').ilike('title', `%${w}%`).limit(8);
    (data || []).forEach((p: any) => postMap.set(p.id, p));
  }
  const posts = Array.from(postMap.values())
    .map((p: any) => {
      let score = 0;
      const contentText = stripHtml(p.content);
      for (const w of syl) {
        if ((p.title || '').toLowerCase().includes(w)) score += 3;
        if (contentText.toLowerCase().includes(w)) score += 1;
      }
      return { id: p.id as string, title: p.title as string, content: contentText, score };
    })
    .filter((p) => p.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const parts: string[] = [];
  if (chunks.length > 0) {
    parts.push(
      'ĐOẠN VĂN BẢN PHÁP LUẬT:\n' +
        // WO-WEB-15A: trần 1.500 ký tự để đưa toàn văn đoạn vào ngữ cảnh
        // (đoạn dài nhất trong kho hiện hành là 1.458 ký tự); trước đây
        // trần 900 ký tự cắt mất phần đuôi của 162 trên 309 đoạn.
        chunks.map((c) => `[${c.doc_title} — ${c.section}] ${c.content.slice(0, 1500)}`).join('\n')
    );
  }
  if (posts.length > 0) {
    parts.push(
      'BÀI VIẾT TRÊN WEBSITE:\n' +
        posts.map((p) => `- Bài "${p.title}": ${p.content.slice(0, 400)}`).join('\n')
    );
  }
  const sources: Source[] = [
    ...chunks.map((c) => ({ title: `${c.doc_title} — ${c.section}`, url: '' })),
    ...posts.map((p) => ({ title: p.title, url: `/tin-tuc/${p.id}` })),
  ];
  return { context: parts.join('\n\n'), sources };
}

async function callDeepSeek(system: string, history: { role: string; content: string }[]): Promise<string> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error('no deepseek key');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: system }, ...history],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });
    if (!res.ok) throw new Error(`deepseek ${res.status}`);
    const json = await res.json();
    const text = json?.choices?.[0]?.message?.content;
    if (!text) throw new Error('deepseek empty');
    return text;
  } finally {
    clearTimeout(timer);
  }
}

async function callOpenRouter(system: string, history: { role: string; content: string }[]): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('no openrouter key');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        'X-Title': 'Bot An - Tram Y te Cai Bau',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [{ role: 'system', content: system }, ...history],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });
    if (!res.ok) throw new Error(`openrouter ${res.status}`);
    const json = await res.json();
    const text = json?.choices?.[0]?.message?.content;
    if (!text) throw new Error('openrouter empty');
    return text;
  } finally {
    clearTimeout(timer);
  }
}

async function callGemini(system: string, history: { role: string; content: string }[]): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('no gemini key');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  const transcript = history
    .map((m) => `${m.role === 'user' ? 'Người dân' : 'An'}: ${m.content}`)
    .join('\n');
  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${system}\n\n${transcript}\nAn:` }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
        }),
      }
    );
    if (!res.ok) throw new Error(`gemini ${res.status}`);
    const json = await res.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('gemini empty');
    return text;
  } finally {
    clearTimeout(timer);
  }
}

// WO-WEB-12: nen thoi gian cho Bot An. May chu tinh ngay hien tai theo mui
// gio Asia/Bangkok va ba dot tiem du kien theo lich co dinh (ngay 18, 24, 25
// hang thang, loai tru Thu 7 va Chu nhat; dot dau tien tu hom nay tro di).
// Day la ngay DU KIEN theo lich co dinh, khong phai ngay da xac nhan to
// chuc; ky luat khang dinh nam trong prompt he thong (bot-knowledge.ts).
const WEEKDAY_VI = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

function buildScheduleLines(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((x) => x.type === t)?.value || 0);
  const ty = get('year');
  const tm = get('month');
  const td = get('day');
  const weekdayOf = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const sessions: string[] = [];
  for (let off = 0; off < 4 && sessions.length < 3; off++) {
    const m0 = tm - 1 + off;
    const y = ty + Math.floor(m0 / 12);
    const m = (m0 % 12) + 1;
    for (const d of [18, 24, 25]) {
      if (sessions.length >= 3) break;
      if (off === 0 && d < td) continue;
      const wd = weekdayOf(y, m, d);
      if (wd === 0 || wd === 6) continue;
      sessions.push(`${WEEKDAY_VI[wd]} ngày ${d}/${m}/${y}`);
    }
  }
  return `- Hôm nay là ${WEEKDAY_VI[weekdayOf(ty, tm, td)]}, ngày ${td}/${tm}/${ty}.\n- Ba đợt tiêm dự kiến theo lịch cố định sắp tới: ${sessions.join('; ')}.`;
}

// ===== WO-WEB-14: bo loc cap cuu hai tang va may trang thai su kien =====
// Tang 1: 29 cum tu khoa EMERGENCY_KEYWORDS hien hanh. Tang 2: chot su
// kien: mot boi canh nguy hiem (chan thuong, sau tiem, dong vat can...)
// len chot mot su kien; dau hieu dien bien xau di o luot sau se kich hoat.
// Trang thai cham soc (dang o co so y te / da kham va ve theo doi / da
// giai quyet) do cac dau hieu tuong minh cua nguoi dan quyet dinh va
// khong bao gio tu het han theo so luot hay chu de. Bo loc quet TOAN BO
// tin nhan nguoi dung trong yeu cau (mang goc, khong qua cua so 6 tin
// nhan cua AI) va chay TRUOC gioi han tan suat. Khop mau sau khi gap dau
// tieng Viet nen chiu duoc loi thieu dau va nua dau.

function foldVi(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

const TIER1_PATTERNS = Array.from(new Set(EMERGENCY_KEYWORDS.map(foldVi)));

const CONTEXT_PATTERNS = [
  'đập đầu', 'ngã đập', 'ngã từ', 'ngã xe', 'té xe', 'tai nạn giao thông',
  'chấn thương đầu', 'uống nhầm', 'uống phải hóa chất', 'ăn phải hóa chất',
  'bị bỏng', 'bỏng nước sôi', 'bỏng lửa', 'sau khi tiêm', 'sau tiêm',
  'vừa tiêm', 'tiêm về', 'tiêm xong', 'chó cắn', 'mèo cắn', 'rắn cắn',
  'ong đốt', 'trẻ sơ sinh sốt', 'bé sơ sinh sốt', 'sốt ở trẻ sơ sinh',
  'mới tiêm',
].map(foldVi);

const DETERIORATION_PATTERNS = [
  'nôn nhiều', 'nôn liên tục', 'bị nôn', 'nôn ói', 'ói mửa', 'lơ mơ',
  'li bì', 'ngủ gà', 'ngủ lịm', 'ngủ rồi', 'ngủ nhiều', 'gọi không tỉnh',
  'gọi không đáp', 'không tỉnh táo', 'khóc thét', 'khóc yếu', 'bỏ bú',
  'bỏ ăn', 'mệt lả', 'người lả', 'tím tái', 'tái tím', 'khò khè',
  'thở nhanh', 'thở gấp', 'sốt cao', 'mắt trợn', 'mềm nhũn', 'phù mặt',
  'sưng phù mặt', 'nổi mẩn khắp người', 'phát ban khắp người',
].map(foldVi);

const FACILITY_MARKERS = [
  'đang ở bệnh viện', 'đang ở phòng cấp cứu', 'đang nằm viện',
  'đang được cấp cứu', 'đang ở trạm y tế', 'đang ở phòng khám',
  'đang ở viện', 'đang truyền dịch', 'đang thở oxy',
  'đang nằm theo dõi ở viện',
].map(foldVi);

const HOME_MARKERS = [
  'đã đi khám', 'đã đưa đi khám', 'đã khám rồi', 'đã được khám',
  'bác sĩ bảo không sao', 'bác sĩ nói không sao', 'bác sĩ cho về',
  'cho về theo dõi', 'bác sĩ dặn theo dõi', 'đã xử trí rồi',
  'đã được xử trí', 'đã băng bó rồi', 'đã khâu rồi',
  'đã tiêm phòng dại rồi',
].map(foldVi);

const RESOLVED_MARKERS = [
  'khỏe hẳn', 'khỏi hẳn', 'hết nôn rồi', 'hết sốt rồi', 'không sao rồi',
  'bình thường rồi', 'ăn chơi bình thường', 'đã xử lý xong',
  'xử lý xong rồi', 'đỡ hẳn',
].map(foldVi);

// Danh sach dong cac dau phu dinh. "chang" (chang/chang trai) va "co dau"
// (co dau hieu) bi loai co chu dich vi trung hinh thuc voi tu thong
// thuong, de tranh am tinh gia; cac truong hop do mac dinh kich hoat.
// "dau co" chi duoc cong nhan khi dung o dau phan doan cau.
const NEG_MARKERS = ['khong', 'chua'];

function occurrences(text: string, patterns: string[]): number[] {
  const out: number[] = [];
  for (const p of patterns) {
    let i = text.indexOf(p);
    while (i >= 0) {
      out.push(i);
      i = text.indexOf(p, i + 1);
    }
  }
  return out.sort((a, b) => a - b);
}

// Mot vi tri khop duoc coi la bi phu dinh khi: trong cung phan doan cau
// (khong vuot dau cham, phay, cham phay, cham hoi, cham than, xuong dong)
// co dau phu dinh thuoc danh sach dong ket thuc cach vi tri khop toi da
// 10 ky tu, va giua dau phu dinh voi vi tri khop khong co tu doi lap
// "nhung". Phu dinh kep dang "khong phai ... khong ..." la khang dinh.
// Moi truong hop mo ho deu mac dinh KHONG phu dinh (van kich hoat).
function isNegated(text: string, idx: number): boolean {
  let segStart = 0;
  for (const br of ['.', '!', '?', ';', ',', '\n']) {
    const p = text.lastIndexOf(br, idx - 1);
    if (p >= segStart) segStart = p + 1;
  }
  const seg = text.slice(segStart, idx);
  if ((seg.match(/khong/g) || []).length >= 2 && seg.includes('phai')) return false;
  const trimmed = seg.trimStart();
  if (trimmed.startsWith('dau co')) {
    const gap = trimmed.slice(6);
    if (gap.length <= 6 && !gap.includes('nhung')) return true;
  }
  for (const mk of NEG_MARKERS) {
    const j = seg.lastIndexOf(mk);
    if (j < 0) continue;
    const gap = seg.slice(j + mk.length);
    if (gap.length > 10) continue;
    if (gap.includes('nhung')) continue;
    return true;
  }
  return false;
}

type EmergencyScan = { action: 'emergency' | 'facility-note' | 'none' };

function scanEmergency(userTexts: string[]): EmergencyScan {
  const texts = userTexts.map(foldVi);
  let armed = false;
  let inFacility = false;
  let detSeen = false;
  let fireNow = false;
  texts.forEach((t, i) => {
    const isLast = i === texts.length - 1;
    const detHit = occurrences(t, DETERIORATION_PATTERNS).some((p) => !isNegated(t, p));
    if (detHit) detSeen = true;
    let contextHere = false;
    const events: { pos: number; kind: string }[] = [];
    for (const p of occurrences(t, FACILITY_MARKERS)) events.push({ pos: p, kind: 'facility' });
    for (const p of occurrences(t, HOME_MARKERS)) events.push({ pos: p, kind: 'home' });
    for (const p of occurrences(t, RESOLVED_MARKERS)) events.push({ pos: p, kind: 'resolved' });
    for (const p of occurrences(t, CONTEXT_PATTERNS)) {
      if (!isNegated(t, p)) events.push({ pos: p, kind: 'context' });
    }
    events.sort((a, b) => a.pos - b.pos);
    for (const e of events) {
      if (e.kind === 'context') {
        armed = true;
        inFacility = false;
        contextHere = true;
      } else if (e.kind === 'facility') {
        inFacility = true;
      } else {
        // Da kham va ve theo doi, hoac da giai quyet: khong con o co so y te.
        inFacility = false;
      }
    }
    if (isLast) {
      const tier1Hit = occurrences(t, TIER1_PATTERNS).some((p) => !isNegated(t, p));
      // Kich hoat chi xet tin hieu hoan tat o tin nhan cuoi: tu khoa tang 1,
      // dien bien khi da co su kien, hoac boi canh moi noi voi dien bien
      // da thay truoc do. Tin hieu cu trong lich su khong kich hoat lai
      // luot hoi binh thuong ve sau.
      if (tier1Hit || (armed && detSeen && (detHit || contextHere))) fireNow = true;
    }
  });
  if (!fireNow) return { action: 'none' };
  if (inFacility) return { action: 'facility-note' };
  return { action: 'emergency' };
}

const FACILITY_NOTE =
  '\n\nLƯU Ý AN TOÀN TỪ HỆ THỐNG: trong hội thoại này, người dân đã nêu một sự kiện nguy hiểm và hiện cho biết người bệnh đang ở cơ sở y tế hoặc đang được nhân viên y tế chăm sóc trực tiếp. Nếu người dân báo dấu hiệu xấu đi, không hướng dẫn gọi 115 như trường hợp chưa được chăm sóc; hãy hướng dẫn báo ngay cho nhân viên y tế đang theo dõi và làm theo chỉ dẫn của họ, đồng thời giữ thái độ khẩn trương, nghiêm túc.';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const raw = Array.isArray(body?.messages) ? body.messages : [];
    const history = raw
      .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-6)
      .map((m: any) => ({ role: m.role, content: m.content.slice(0, 1000) }));
    const lastUser = [...history].reverse().find((m) => m.role === 'user')?.content || '';
    if (!lastUser) {
      return NextResponse.json({ error: 'Thiếu nội dung câu hỏi' }, { status: 400 });
    }

    // 1) WO-WEB-14: sàng lọc khẩn cấp hai tầng trên toàn bộ lịch sử người
    // dùng (mảng gốc, không qua cửa sổ 6 tin nhắn của AI), chạy trước
    // giới hạn tần suất để câu khẩn cấp không bao giờ bị chặn bởi 429.
    const userTexts = raw
      .filter((m: any) => m && m.role === 'user' && typeof m.content === 'string')
      .map((m: any) => m.content as string);
    const scan = scanEmergency(userTexts);
    if (scan.action === 'emergency') {
      await logChat(lastUser, EMERGENCY_REPLY, 'rule-emergency');
      return NextResponse.json({ reply: EMERGENCY_REPLY, provider: 'rule-emergency', sources: [] });
    }

    const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
    if (rateLimited(ip)) {
      return NextResponse.json(
        { reply: 'Anh/chị đang gửi câu hỏi quá nhanh. Vui lòng chờ ít phút rồi hỏi lại, hoặc gọi 02033.795.898 để được hỗ trợ. Nếu đây là tình huống khẩn cấp, hãy gọi ngay 115 hoặc số trực cấp cứu của Trạm: 0203.3822.115.', provider: 'rate_limited', sources: [] },
        { status: 429 }
      );
    }

    // 2) Chưa cấu hình khóa AI: trả thông điệp êm.
    if (!process.env.DEEPSEEK_API_KEY && !process.env.GEMINI_API_KEY && !process.env.OPENROUTER_API_KEY) {
      await logChat(lastUser, NOT_CONFIGURED_REPLY, 'not-configured');
      return NextResponse.json({ reply: NOT_CONFIGURED_REPLY, provider: 'not-configured', sources: [] });
    }

    // 3) Truy xuất bài viết liên quan + gọi AI.
    const { context, sources } = await retrieveContext(lastUser);
    const system =
      buildSystemPrompt(context, buildScheduleLines()) +
      (scan.action === 'facility-note' ? FACILITY_NOTE : '');
    let reply = '';
    let provider = '';
    try {
      reply = await callDeepSeek(system, history);
      provider = 'deepseek';
    } catch {
      try {
        reply = await callOpenRouter(system, history);
        provider = 'openrouter';
      } catch {
        try {
          reply = await callGemini(system, history);
          provider = 'gemini';
        } catch {
          reply = FALLBACK_REPLY;
          provider = 'error';
        }
      }
    }
    await logChat(lastUser, reply, provider);
    return NextResponse.json({ reply, provider, sources: provider === 'error' ? [] : sources });
  } catch {
    return NextResponse.json({ reply: FALLBACK_REPLY, provider: 'error', sources: [] }, { status: 200 });
  }
}
