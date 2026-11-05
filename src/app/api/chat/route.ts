import { NextResponse } from 'next/server';
import { randomUUID, timingSafeEqual } from 'crypto';
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

// WO-WEB-15C: mã hội thoại do widget sinh; route chỉ chấp nhận đúng
// định dạng UUID, thiếu hoặc sai thì tự sinh mã thay thế cho riêng
// lượt đó. Không bao giờ từ chối trả lời vì lý do mã hội thoại.
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function resolveConversationId(body: unknown): string {
  const raw = (body as { conversation_id?: unknown })?.conversation_id;
  if (typeof raw === 'string' && UUID_RE.test(raw)) return raw;
  return randomUUID();
}

async function logChat(
  question: string,
  answer: string,
  provider: string,
  conversationId: string
) {
  try {
    const sb = serverClient();
    if (!sb) return;
    // Ưu tiên log_chat_v2 (có mã hội thoại và số lượt do máy chủ tính);
    // lỗi thì lùi về log_chat hiện hành để nhật ký không gián đoạn.
    const v2 = await sb.rpc('log_chat_v2', {
      q: question,
      a: answer,
      p: provider,
      conv: conversationId,
    });
    if (!v2.error) return;
    console.error('WO-WEB-15C log_chat_v2 failed, fallback v1:', v2.error.message);
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

  // WO-WEB-15D (phần sửa truy xuất gộp theo quyết định của Maco ngày
  // 03/11/2026): câu hỏi xin danh mục vắc xin, bệnh được tiêm miễn phí
  // trong tiêm chủng mở rộng hoặc tiêm phòng phải luôn kèm đoạn Điều 3
  // Thông tư 13/2026 (danh mục bệnh phải sử dụng vắc xin, sinh phẩm).
  // Ở một số cách hỏi, đoạn này thua điểm các đoạn khớp từ "miễn phí"
  // thuộc văn bản khác (ví dụ Điều 27 Luật Phòng bệnh về khám sàng lọc
  // miễn phí) và rớt khỏi nhóm 5, khiến mô hình không có danh mục
  // trong ngữ cảnh và né trả lời. Ghim xác định: chưa có thì chèn vào,
  // thay đoạn cuối khi nhóm đã đủ 5.
  const foldedQ = foldVi(question);
  // Bổ sung 04/11/2026 (Maco duyệt, phát hiện tại cổng hồi quy của
  // WO-WEB-15C): điều kiện gốc chỉ khớp cụm đã bỏ dấu của từ miễn phí
  // nên bỏ sót các cách hỏi không thu phí, có mất tiền không, tốn
  // tiền; hai cách hỏi mẫu V2 và V4 vì thế lúc đạt lúc trượt. Nhận
  // diện ý định miễn phí nay gồm mọi diễn đạt tương đương.
  const freeIntent =
    foldedQ.includes('mien phi') ||
    foldedQ.includes('khong thu phi') ||
    foldedQ.includes('mat tien') ||
    foldedQ.includes('ton tien');
  const catalogIntent =
    freeIntent &&
    (foldedQ.includes('vac xin') ||
      foldedQ.includes('tiem chung') ||
      foldedQ.includes('tiem phong'));
  const isD3 = (c: { doc_code: string; section: string }) =>
    c.doc_code === 'TT-13-2026' && /(^|,\s)Điều 3$/.test((c.section || '').trim());
  if (catalogIntent && !chunks.some(isD3)) {
    const d3 =
      scored.find(isD3) ||
      rows
        .filter(isD3)
        .map((c) => ({
          doc_code: (c.doc_code || c.doc_title) as string,
          doc_title: c.doc_title as string,
          section: (c.section || '') as string,
          content: c.content as string,
          score: 0,
        }))[0];
    if (d3) {
      if (chunks.length >= 5) chunks[chunks.length - 1] = d3;
      else chunks.push(d3);
    }
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

// WO-WEB-17: lỗi của từng mắt xích phải để lại dấu vết có cấu trúc
// thay vì bị nuốt im lặng (bài học WO-WEB-15B: đường OpenRouter chết
// mà không thấy mã lỗi). errTag rút mã trạng thái HTTP nếu có.
function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
function errTag(e: unknown): string {
  const m = errMsg(e);
  const code = m.match(/(\d{3})/);
  if (code) return code[1];
  return m.replace(/[^a-zA-Z0-9 -]/g, '').slice(0, 24) || 'unknown';
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
          // WO-WEB-17: ngân sách suy luận tường minh và trần đầu ra
          // rộng hơn, để phần suy luận không ăn hết ngân sách của
          // câu trả lời (một trong hai cơ chế cắt cụt tại WO-WEB-15B).
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1536,
            thinkingConfig: { thinkingBudget: 256 },
          },
        }),
      }
    );
    if (!res.ok) throw new Error(`gemini ${res.status}`);
    const json = await res.json();
    // WO-WEB-17: Gemini có thể chia câu trả lời thành nhiều phần
    // văn bản; phải ghép toàn bộ thay vì chỉ đọc phần đầu tiên
    // (cơ chế cắt cụt còn lại tại WO-WEB-15B).
    const parts: unknown = json?.candidates?.[0]?.content?.parts;
    const text = Array.isArray(parts)
      ? parts
          .map((p) => (p && typeof p === 'object' ? (p as { text?: unknown }).text : undefined))
          .filter((t): t is string => typeof t === 'string')
          .join('')
      : '';
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

// ===== WO-WEB-13: lớp thông tin ghim và ngữ cảnh hóa truy vấn =====
// Thông tin ghim được trích xác định chỉ từ tin nhắn của người dân, chỉ
// tồn tại trong quá trình xử lý của chính lượt gọi này, không ghi vào
// bất kỳ cơ sở dữ liệu, tệp hay nhật ký nào. Tắt hằng số dưới đây là
// quay lui nóng toàn bộ lớp ghim và ngữ cảnh hóa truy vấn.
const PIN_FACTS_ENABLED = true;

// Gấp dấu giữ nguyên vị trí ký tự: mỗi ký tự gốc cho đúng một ký tự đã
// gấp, để vị trí khớp trên bản gấp dùng được trên bản gốc (mốc tiêm).
function foldViAligned(s: string): string {
  let out = '';
  for (const ch of s) {
    if (ch === 'đ' || ch === 'Đ') {
      out += 'd';
      continue;
    }
    const base = ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    out += base.length > 0 ? base[0] : ' ';
  }
  return out.toLowerCase();
}

const PIN_CORRECTION_MARKERS = ['khong phai', 'noi nham', 'nham', 'sua lai', 'y em la'];
const PIN_KINSHIP_BEFORE = ['con dau', 'chau gai', 'em gai', 'chi gai', 'vo', 'me', 'bo', 'cha', 'chi', 'anh', 'co', 'di', 'chu', 'bac'];
const PIN_CHILD_ID_LABELS: Record<string, string> = {
  lon: 'Bé lớn',
  nho: 'Bé nhỏ',
  dau: 'Bé đầu',
  ca: 'Bé cả',
  ut: 'Bé út',
};

type PinnedFact = { value: string; turn: number };

function extractPinnedFacts(userTexts: string[]): string[] {
  const byKey = new Map<string, PinnedFact & { label: string }>();
  const put = (key: string, label: string, value: string, turn: number) => {
    byKey.set(key, { label, value, turn });
  };

  userTexts.forEach((original, ui) => {
    const turn = ui + 1;
    const foldedFull = foldViAligned(original);
    let text = foldedFull;
    let prefixText = '';
    // Dấu sửa đổi tường minh: giá trị đứng trước dấu sửa đổi cuối cùng
    // trong tin nhắn mất hiệu lực; chỉ phần sau dấu đó được trích xuất.
    // Chủ thể nêu ở phần trước vẫn được giữ để gắn giá trị trần nêu ở
    // phần sau (mẫu: "Bé nhỏ em nói nhầm, là 3 tháng ạ").
    let cut = -1;
    for (const mk of PIN_CORRECTION_MARKERS) {
      let i = foldedFull.indexOf(mk);
      while (i >= 0) {
        if (i + mk.length > cut) cut = i + mk.length;
        i = foldedFull.indexOf(mk, i + 1);
      }
    }
    if (cut >= 0) {
      prefixText = foldedFull.slice(0, cut);
      text = foldedFull.slice(cut);
    }

    const found = new Map<string, { label: string; value: string }>();

    // Tuổi trẻ em: bắt buộc có chủ thể trẻ đi kèm. Các giá trị khác nhau
    // cho cùng một khóa trong cùng một tin nhắn = mơ hồ, không ghim.
    const childRe = /\b(be|chau|tre|con em|con nha|con cua|con toi|con minh)\s+(lon|nho|dau|ca|ut)?[^0-9.;!?\n]{0,14}?(\d{1,2})\s*(thang tuoi|thang|tuoi)\b/g;
    let m: RegExpExecArray | null;
    const childSeen = new Map<string, string>();
    while ((m = childRe.exec(text)) !== null) {
      if (text.slice(m.index + m[0].length, m.index + m[0].length + 4).startsWith(' nua')) continue;
      const preDigit = m[0].slice(0, m[0].lastIndexOf(m[3]));
      if (/\bbenh\b/.test(preDigit)) continue;
      const num = parseInt(m[3], 10);
      const unit = m[4];
      if (unit === 'tuoi' && num > 18) continue;
      if (unit !== 'tuoi' && num > 36) continue;
      const idf = m[2] || '';
      const key = 'child-age:' + (idf || 'chung');
      const value = num + (unit === 'tuoi' ? ' tuổi' : ' tháng');
      const prev = childSeen.get(key);
      if (prev !== undefined && prev !== value) {
        childSeen.set(key, ' mo ho');
      } else {
        childSeen.set(key, value);
      }
      if (!found.has(key) && childSeen.get(key) !== ' mo ho') {
        found.set(key, {
          label: idf ? PIN_CHILD_ID_LABELS[idf] : 'Bé',
          value,
        });
      } else if (childSeen.get(key) === ' mo ho') {
        found.delete(key);
      }
    }

    // Gắn giá trị trần sau dấu sửa đổi vào chủ thể đã nêu trước dấu đó:
    // chỉ áp dụng cho tuổi trẻ em và chỉ khi phần sau chưa tự trích
    // được mục nào cho khóa đó.
    if (cut >= 0 && prefixText) {
      const bare = /(\d{1,2})\s*(thang tuoi|thang|tuoi)\b/.exec(text);
      if (bare) {
        const subjRe = /\b(be|chau|tre|con em|con nha|con cua|con toi|con minh)\s+(lon|nho|dau|ca|ut)?/g;
        let sm: RegExpExecArray | null;
        let lastSubj: RegExpExecArray | null = null;
        while ((sm = subjRe.exec(prefixText)) !== null) lastSubj = sm;
        if (lastSubj) {
          const num = parseInt(bare[1], 10);
          const unit = bare[2];
          const inRange = unit === 'tuoi' ? num <= 18 : num <= 36;
          if (inRange) {
            const idf = lastSubj[2] || '';
            const key = 'child-age:' + (idf || 'chung');
            if (!found.has(key)) {
              found.set(key, {
                label: idf ? PIN_CHILD_ID_LABELS[idf] : 'Bé',
                value: num + (unit === 'tuoi' ? ' tuổi' : ' tháng'),
              });
            }
          }
        }
      }
    }

    // Tuổi người hỏi: chỉ khi gắn với chính người hỏi và không có từ
    // chỉ thân thuộc đứng ngay trước (tránh bắt nhầm tuổi người thân).
    const adultRe = /\b(em|toi|minh|ba|ong)\s+(nay\s+)?(\d{2})\s*tuoi\b/g;
    while ((m = adultRe.exec(text)) !== null) {
      const before = text.slice(Math.max(0, m.index - 14), m.index);
      if (/(me|bo|cha|vo|chong|co|di|chu|bac|anh|chi|con)\s$/.test(before)) continue;
      const num = parseInt(m[3], 10);
      if (num < 18 || num > 95) continue;
      found.set('adult-age:self', { label: 'Người hỏi', value: num + ' tuổi' });
    }

    // Tình trạng thai kỳ: kèm chủ thể nêu ngay trước nếu có.
    const pregRe = /(mang thai|co thai|co bau|dang bau|bau)\s*(duoc\s*)?(\d{1,2})?\s*(tuan|thang)?/g;
    while ((m = pregRe.exec(text)) !== null) {
      const kw = m[1];
      const num = m[3] ? parseInt(m[3], 10) : null;
      const unit = m[4] || '';
      if (kw === 'bau' && num === null) continue;
      if (num !== null && (num < 4 || num > 45)) continue;
      const before = text.slice(Math.max(0, m.index - 22), m.index);
      let subject = 'Người hỏi';
      let bestPos = -1;
      for (const kin of PIN_KINSHIP_BEFORE) {
        const p = before.lastIndexOf(kin);
        if (p > bestPos) {
          bestPos = p;
          subject = kin;
        }
      }
      const KIN_DISPLAY: Record<string, string> = {
        'con dau': 'con dâu', 'chau gai': 'cháu gái', 'em gai': 'em gái',
        'chi gai': 'chị gái', vo: 'vợ', me: 'mẹ', bo: 'bố', cha: 'cha',
        chi: 'chị', anh: 'anh', co: 'cô', di: 'dì', chu: 'chú', bac: 'bác',
      };
      const label =
        subject === 'Người hỏi'
          ? 'Thai kỳ của người hỏi'
          : 'Thai kỳ (' + (KIN_DISPLAY[subject] || subject) + ')';
      const value =
        num !== null
          ? 'đang mang thai ' + num + (unit === 'tuan' ? ' tuần' : ' tháng')
          : 'đang mang thai (chưa rõ số tuần)';
      found.set('pregnancy:' + subject, { label, value });
    }

    // Mốc tiêm gần nhất: lấy nguyên văn từ bản gốc tại vị trí khớp.
    // Chỉ nhận câu trần thuật: một câu hỏi nhắc lại mẫu này (ví dụ
    // "vừa tiêm mũi gì hôm qua") không phải mốc tiêm và tuyệt đối
    // không được đè lên mốc thật đã nêu ở lượt trước. Lỗi này là
    // nguyên nhân gốc của ca T20 ở kiểm chứng live đợt đầu: câu hỏi
    // cuối hội thoại đã đè mất mốc "Đã tiêm mũi sởi hôm qua".
    const vaxRe = /(da tiem|vua tiem|moi tiem)/g;
    let acceptedVax = '';
    while ((m = vaxRe.exec(text)) !== null) {
      const rest = original.slice((cut >= 0 ? cut : 0) + m.index);
      const stopAt = rest.search(/[.!?\n]/);
      const phrase = (stopAt > 0 ? rest.slice(0, stopAt) : rest).trim();
      if (phrase.length < 8) continue;
      const foldedPhrase = foldViAligned(phrase);
      const qm = /(^|\s)(gi|nao|chua|khong)(\s|$)/.exec(foldedPhrase);
      // Từ nghi vấn chỉ vô hiệu câu khi nằm ngay đầu cụm (dạng câu hỏi
      // nhắc lại); từ phủ định ở cuối một câu trần thuật dài (ví dụ
      // "đã tiêm mũi sởi hôm qua, không sốt") không làm mất mốc tiêm.
      if (qm && qm.index < 20) continue;
      acceptedVax = phrase;
    }
    if (acceptedVax) {
      found.set('last-vaccination', {
        label: 'Mốc tiêm gần nhất đã nêu',
        value: acceptedVax.charAt(0).toUpperCase() + acceptedVax.slice(1),
      });
    }

    found.forEach((f, key) => put(key, f.label, f.value, turn));
  });

  const lines = Array.from(byKey.values())
    .sort((a, b) => b.turn - a.turn)
    .slice(0, 6)
    .sort((a, b) => a.turn - b.turn)
    .map((f) => ('- ' + f.label + ': ' + f.value + ' (đã nêu ở lượt ' + f.turn + ')').slice(0, 80));
  return lines;
}

const PIN_REFERENCE_MARKERS = [
  'the con', 'vay con', 'the thi', 'vay thi', 'thang sau', 'thang truoc',
  'tiep theo', 'chi phi', 'bao nhieu', 'con khong', 'sao a',
];

function buildRetrievalQuery(userTexts: string[]): string {
  const last = userTexts[userTexts.length - 1] || '';
  if (userTexts.length < 2) return last;
  const folded = foldViAligned(last);
  const referential =
    last.length <= 60 || PIN_REFERENCE_MARKERS.some((mk) => folded.includes(mk));
  if (!referential) return last;
  // Câu tham chiếu nhưng đã mang đủ thuật ngữ chủ đề của chính nó (ví
  // dụ "thế còn chi phí thì sao") thì truy vấn bằng chính câu đó: ghép
  // thêm câu trước làm loãng trọng tâm và đẩy đoạn đúng ra khỏi nhóm
  // chọn, đã kiểm chứng bằng mô phỏng truy xuất trên kho thật (ca T02).
  // Chỉ câu tham chiếu gần như không có nội dung chủ đề mới ghép câu
  // người dùng liền trước. Khi đếm thuật ngữ chủ đề, loại các từ
  // chức năng và chỉ định thuần túy (còn, vậy, thế, đó, này, kia, ấy)
  // vì chúng không mang chủ đề.
  const topicalCount = chunkSyllablesOf(last)
    .syl.map((w) => foldViAligned(w))
    .filter((w) => !['con', 'do', 'nay', 'kia', 'ay', 'vay', 'the'].includes(w)).length;
  if (topicalCount >= 2) return last;
  const prev = userTexts[userTexts.length - 2];
  return prev + ' ' + last;
}

// ===== WO-WEB-15D: chốt số điện thoại lạ ở đầu ra =====
// Phạm vi bảo vệ xác định của chốt này CHỈ là số điện thoại được trình
// bày như số liên hệ của Trạm; các nội dung chính thức khác vẫn do
// tầng prompt bảo vệ (Mục II.4 của Chỉ đạo triển khai V1.1).
const OFFICIAL_PHONE_DIGITS = new Set(['02033795898', '02033822115', '115']);
const PHONE_BEFORE_PATTERNS = [
  /(goi (ngay )?(so|den so)?|lien he (tram )?(qua|theo) so|qua so|theo so)\s*$/,
  /(so truc|hotline|duong day nong)[^0-9]{0,30}$/,
  /so (dien thoai|lien he) cua (tram|co so|benh vien)[^0-9]{0,15}$/,
  /so dien thoai lien he[^0-9]{0,10}$/,
];
const PHONE_AFTER_PATTERNS = [
  /^\s*(la so (dien thoai|lien he|truc)|la hotline)/,
  /^\s*(de (nguoi dan )?(lien he|goi))/,
];

function findForeignStationPhone(reply: string): string | null {
  const folded = foldViAligned(reply);
  const re = /(\+?84|0)[\d][\d.\s]{7,14}\d/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(reply)) !== null) {
    let digits = m[0].replace(/\D/g, '');
    if (digits.startsWith('84')) digits = '0' + digits.slice(2);
    if (OFFICIAL_PHONE_DIGITS.has(digits)) continue;
    if (digits.length < 9 || digits.length > 11) continue;
    const before = folded.slice(Math.max(0, m.index - 50), m.index);
    const after = folded.slice(m.index + m[0].length, m.index + m[0].length + 30);
    // "Trạm sẽ gọi <số>" là Trạm gọi tới số của người dân, không phải
    // trình bày số đó như số của Trạm.
    const stationCalling = /(se|vua|da|dang)\s+goi\s*$/.test(before);
    const framed =
      !stationCalling &&
      (PHONE_BEFORE_PATTERNS.some((p) => p.test(before)) ||
        PHONE_AFTER_PATTERNS.some((p) => p.test(after)));
    if (framed) return m[0];
  }
  return null;
}

const FACILITY_NOTE =
  '\n\nLƯU Ý AN TOÀN TỪ HỆ THỐNG: trong hội thoại này, người dân đã nêu một sự kiện nguy hiểm và hiện cho biết người bệnh đang ở cơ sở y tế hoặc đang được nhân viên y tế chăm sóc trực tiếp. Nếu người dân báo dấu hiệu xấu đi, không hướng dẫn gọi 115 như trường hợp chưa được chăm sóc; hãy hướng dẫn báo ngay cho nhân viên y tế đang theo dõi và làm theo chỉ dẫn của họ, đồng thời giữ thái độ khẩn trương, nghiêm túc.';

// WO-WEB-16: thang kiểm soát độ dài theo Mục 3 Báo cáo chỉnh lý. Bỏ
// hẳn cắt cơ học: đo số từ, viết lại đúng một lần bằng chính nhà cung
// cấp vừa trả lời, chỉ dùng bản viết lại khi qua kiểm tra bảo toàn
// xác định; mọi trường hợp còn lại giữ nguyên bản gốc và ghi cờ.
const WORD_CAP = 300;
function countWords(t: string): number {
  const s = t.trim();
  return s ? s.split(/\s+/).length : 0;
}
function extractPhoneSeqs(t: string): string[] {
  const out: string[] = [];
  const re = /(?:\+?84|0)(?:[\s.\-]?\d){8,10}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t)) !== null) {
    const digits = m[0].replace(/\D/g, '');
    if (digits.length >= 9 && digits.length <= 11) out.push(digits);
  }
  return Array.from(new Set(out));
}
function countListLines(t: string): number {
  return t
    .split('\n')
    .filter((l) => /^\s*(?:[-*•]|\d+[.)])\s/.test(l)).length;
}
const DANGER_TERMS_FOLDED = [
  'khó thở',
  'co giật',
  'tím môi',
  'tím tái',
  'lơ mơ',
  'bất tỉnh',
  'chảy máu',
  'sốt cao',
  'nôn nhiều',
  'bỏ bú',
  'khóc thét',
  'lạnh tay chân',
  'nổi vân tím',
  'thở rít',
  'đau ngực',
  'vã mồ hôi',
  'sưng nề',
  'phát ban',
].map(foldVi);
// Kiểm tra bảo toàn theo Mục 3 cộng Mục II.2 của Chỉ đạo: số điện
// thoại, dòng liệt kê và dấu hiệu nguy hiểm của bản gốc phải còn đủ
// trong bản viết lại. Không kiểm chứng được thì coi như không đạt.
function preservationOk(orig: string, rw: string): boolean {
  if (!rw.trim()) return false;
  const rwSeqs = new Set(extractPhoneSeqs(rw));
  for (const s of extractPhoneSeqs(orig)) {
    if (!rwSeqs.has(s)) return false;
  }
  const lo = countListLines(orig);
  if (lo >= 3 && countListLines(rw) < lo) return false;
  const fo = foldVi(orig);
  const fr = foldVi(rw);
  for (const term of DANGER_TERMS_FOLDED) {
    if (fo.includes(term) && !fr.includes(term)) return false;
  }
  return true;
}
const REWRITE_INSTRUCTION =
  'Hãy viết lại câu trả lời ngay trên của bạn cho ngắn gọn, tối đa 250 từ. Giữ nguyên mọi hướng dẫn an toàn, dấu hiệu nguy hiểm, thông tin liên hệ và toàn bộ nội dung liệt kê. Chỉ trả về bản viết lại, không thêm lời dẫn.';

// WO-WEB-18 (05/11/2026): cổng lượt xã giao. Câu người dùng cuối
// cùng, sau khi bỏ dấu, nếu khớp nguyên câu với danh sách đóng các
// mẫu chào hỏi, cảm ơn, tạm biệt và xác nhận ngắn (tối đa 6 từ) thì
// lượt đó bỏ qua truy xuất và luôn trả sources rỗng, để khối Đọc
// thêm không đính kèm các căn cứ không liên quan vào một câu chào.
// Bộ lọc khẩn cấp chạy trước cổng này trong POST nên câu khẩn cấp
// không bao giờ bị cổng nuốt; câu hỏi thật có chứa từ chào kèm chủ
// đề không khớp nguyên câu với mẫu nào nên không trúng cổng.
const SMALL_TALK_EXACT = new Set([
  'xin chao', 'chao', 'chao ban', 'chao an', 'chao tram', 'chao anh',
  'chao chi', 'chao em', 'xin chao ban', 'xin chao an', 'xin chao tram',
  'chao buoi sang', 'chao buoi trua', 'chao buoi chieu', 'chao buoi toi',
  'hello', 'hi', 'hey',
  'cam on', 'cam on ban', 'cam on an', 'cam on tram', 'cam on nhieu',
  'cam on em', 'cam on anh', 'cam on chi', 'thank', 'thanks', 'thank you',
  'tam biet', 'tam biet ban', 'hen gap lai', 'bye', 'goodbye',
  'ok', 'oke', 'okay', 'vang', 'da vang', 'duoc roi', 'roi', 'uhm',
  'da biet', 'biet roi', 'da ro', 'ro roi', 'da',
]);
function isSmallTalkTurn(raw: string): boolean {
  const f = foldVi(raw).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!f) return false;
  const words = f.split(' ');
  if (words.length > 6) return false;
  if (SMALL_TALK_EXACT.has(f)) return true;
  // Bỏ một tiểu từ lịch sự ở cuối (ạ, nhé, nha) rồi đối chiếu lại.
  const last = words[words.length - 1];
  if (['a', 'nha', 'nhe'].includes(last)) {
    const stripped = words.slice(0, -1).join(' ');
    if (SMALL_TALK_EXACT.has(stripped)) return true;
  }
  return false;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const conversationId = resolveConversationId(body);
    const raw = Array.isArray(body?.messages) ? body.messages : [];
    const history = raw
      .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-10)
      .map((m: any) => ({ role: m.role, content: m.content.slice(0, 1000) }));
    const lastUser = [...history].reverse().find((m) => m.role === 'user')?.content || '';
    if (!lastUser) {
      return NextResponse.json({ error: 'Thiếu nội dung câu hỏi' }, { status: 400 });
    }

    // 1) WO-WEB-14: sàng lọc khẩn cấp hai tầng trên toàn bộ lịch sử người
    // dùng (mảng gốc, không qua cửa sổ tin nhắn của AI), chạy trước
    // giới hạn tần suất để câu khẩn cấp không bao giờ bị chặn bởi 429.
    const userTexts = raw
      .filter((m: any) => m && m.role === 'user' && typeof m.content === 'string')
      .map((m: any) => m.content as string);
    const scan = scanEmergency(userTexts);
    if (scan.action === 'emergency') {
      await logChat(lastUser, EMERGENCY_REPLY, 'rule-emergency', conversationId);
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
      await logChat(lastUser, NOT_CONFIGURED_REPLY, 'not-configured', conversationId);
      return NextResponse.json({ reply: NOT_CONFIGURED_REPLY, provider: 'not-configured', sources: [] });
    }

    // 3) Truy xuất bài viết liên quan + gọi AI.
    // 4) WO-WEB-13: trích thông tin ghim từ toàn bộ tin nhắn người dân
    // và ngữ cảnh hóa truy vấn truy xuất khi câu cuối mang tính tham
    // chiếu. Thông tin ghim chỉ sống trong lượt xử lý này, không ghi
    // vào bất kỳ đâu.
    const pinnedLines = PIN_FACTS_ENABLED ? extractPinnedFacts(userTexts) : [];
    const retrievalQuery = PIN_FACTS_ENABLED ? buildRetrievalQuery(userTexts) : lastUser;
    // WO-WEB-18: lượt xã giao bỏ qua truy xuất, sources luôn rỗng.
    const smallTalk = isSmallTalkTurn(lastUser);
    const { context, sources } = smallTalk
      ? { context: '', sources: [] as Source[] }
      : await retrieveContext(retrievalQuery);
    const system =
      buildSystemPrompt(context, buildScheduleLines(), pinnedLines) +
      (scan.action === 'facility-note' ? FACILITY_NOTE : '');
    // WO-WEB-15B: chế độ ép nhà cung cấp, CHỈ bật ở môi trường kiểm
    // thử. Kích hoạt cần đồng thời: VERCEL_ENV tồn tại và khác
    // production, AN_TEST_TOKEN đã đặt (chỉ đặt ở phạm vi Preview) và
    // tiêu đề x-an-test-token khớp theo so sánh hằng thời gian. Thiếu
    // bất kỳ điều kiện nào, trường testProvider bị bỏ qua và chuỗi dự
    // phòng chạy như hiện hành. Khi ép: chỉ gọi đúng nhà cung cấp đó,
    // không chạy chuỗi dự phòng; nhật ký gắn hậu tố |kiem-thu.
    const testToken = process.env.AN_TEST_TOKEN || '';
    const givenToken = request.headers.get('x-an-test-token') || '';
    const tokenOk =
      testToken.length > 0 &&
      givenToken.length === testToken.length &&
      timingSafeEqual(Buffer.from(givenToken), Buffer.from(testToken));
    const forced =
      process.env.VERCEL_ENV !== undefined &&
      process.env.VERCEL_ENV !== 'production' &&
      tokenOk &&
      (body?.testProvider === 'deepseek' ||
        body?.testProvider === 'openrouter' ||
        body?.testProvider === 'gemini')
        ? (body.testProvider as string)
        : '';
    let reply = '';
    let provider = '';
    if (forced) {
      provider = forced + '|kiem-thu';
      try {
        reply =
          forced === 'deepseek'
            ? await callDeepSeek(system, history)
            : forced === 'openrouter'
              ? await callOpenRouter(system, history)
              : await callGemini(system, history);
      } catch (e) {
        // WO-WEB-17: ở chế độ ép, gắn mã lỗi vào trường provider
        // của nhật ký để chẩn đoán được qua cơ sở dữ liệu.
        console.error(`[an-chain] forced ${forced} failed:`, errMsg(e));
        provider = forced + '|kiem-thu|loi:' + errTag(e);
        reply = FALLBACK_REPLY;
      }
    } else
    try {
      reply = await callDeepSeek(system, history);
      provider = 'deepseek';
    } catch (e1) {
      console.error('[an-chain] deepseek failed:', errMsg(e1));
      try {
        reply = await callOpenRouter(system, history);
        provider = 'openrouter';
      } catch (e2) {
        console.error('[an-chain] openrouter failed:', errMsg(e2));
        try {
          reply = await callGemini(system, history);
          provider = 'gemini';
        } catch (e3) {
          console.error('[an-chain] gemini failed:', errMsg(e3));
          reply = FALLBACK_REPLY;
          provider = 'error';
        }
      }
    }
    // 4b) WO-WEB-16: thang kiểm soát độ dài (xem khối hàm phía trên).
    // Chỉ áp cho câu trả lời mô hình; câu trả lời xác định được miễn
    // trừ. Chốt số điện thoại ở bước 5 luôn quét trên văn bản cuối.
    if (provider !== 'error' && reply && reply !== FALLBACK_REPLY) {
      const w0 = countWords(reply);
      if (w0 > WORD_CAP) {
        const base = provider.split('|')[0];
        let rw = '';
        try {
          const rwHistory = [
            ...history,
            { role: 'assistant' as const, content: reply },
            { role: 'user' as const, content: REWRITE_INSTRUCTION },
          ];
          rw =
            base === 'deepseek'
              ? await callDeepSeek(system, rwHistory)
              : base === 'openrouter'
                ? await callOpenRouter(system, rwHistory)
                : await callGemini(system, rwHistory);
        } catch {
          rw = '';
        }
        const w1 = rw ? countWords(rw) : 0;
        if (rw && w1 <= WORD_CAP && w1 < w0 && preservationOk(reply, rw)) {
          reply = rw;
          provider += `|rut-gon:${w0}->${w1}`;
        } else {
          provider += `|vuot-tran-do-dai:${w0}`;
        }
      }
    }

    // 5) WO-WEB-15D: chốt đầu ra. Số điện thoại lạ được trình bày như
    // số liên hệ của Trạm thì thay toàn bộ câu trả lời bằng thông điệp
    // dự phòng và gắn cờ so-la-trong-tra-loi vào provider để rà soát.
    let finalReply = reply;
    let finalProvider = provider;
    if (provider !== 'error' && findForeignStationPhone(reply)) {
      finalReply = FALLBACK_REPLY;
      finalProvider = provider + '|so-la-trong-tra-loi';
    }
    await logChat(lastUser, finalReply, finalProvider, conversationId);
    return NextResponse.json({ reply: finalReply, provider: finalProvider, sources: provider === 'error' ? [] : sources });
  } catch {
    return NextResponse.json({ reply: FALLBACK_REPLY, provider: 'error', sources: [] }, { status: 200 });
  }
}
