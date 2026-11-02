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
function chunkSyllablesOf(question: string): { syl: string[]; digitGroups: string[] } {
  const survives = (w: string) => w.length >= 2 && !STOPWORDS.has(w);
  const topical: string[] = [];
  const digitGroups: string[] = [];
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
    for (const p of pieces) if (survives(p)) topical.push(p);
  }
  return { syl: Array.from(new Set(topical)).slice(0, 8), digitGroups };
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
  const bigrams = chunkSyl.syl.slice(0, -1).map((a, i) => `${a} ${chunkSyl.syl[i + 1]}`);
  const units = [
    ...bigrams.map((u) => ({ u, mult: 3 })),
    ...chunkSyl.syl.map((u) => ({ u, mult: 1 })),
  ];

  const { count: totalCount } = await sb
    .from('bot_chunks')
    .select('id', { count: 'exact', head: true });
  const TOTAL = totalCount && totalCount > 0 ? totalCount : 321;

  const perUnit = await Promise.all(
    units.map(async ({ u, mult }) => {
      const [{ count }, { data }] = await Promise.all([
        sb.from('bot_chunks').select('id', { count: 'exact', head: true }).ilike('content', `%${u}%`),
        sb.from('bot_chunks').select('id, doc_title, section, content').ilike('content', `%${u}%`).limit(12),
      ]);
      const w = Math.log(1 + TOTAL / Math.max(1, count || 0));
      return { u, mult, w, rows: (data || []) as any[] };
    })
  );

  const cmap = new Map<string, any>();
  perUnit.forEach((pu) => pu.rows.forEach((r) => cmap.set(r.id, r)));

  // Van ban duoc neu dich danh trong cau hoi (cap so dau cua ma, vd
  // "13/2026"): moi doan cua van ban do deu vao pool ung vien, vi truy van
  // theo cum tu chi lay 12 doan dau moi don vi nen doan dich co the khong
  // lo dien; cac doan nay duoc cong diem phang o buoc cham ben duoi.
  const namedTitles = new Set<string>();
  const namedCount = new Map<string, number>();
  if (chunkSyl.digitGroups.length >= 2) {
    const pair = `${chunkSyl.digitGroups[0]}/${chunkSyl.digitGroups[1]}`;
    const { data: namedRows } = await sb
      .from('bot_chunks')
      .select('id, doc_title, section, content')
      .ilike('doc_title', `%${pair}%`);
    for (const r of (namedRows || []) as any[]) {
      namedTitles.add(r.doc_title as string);
      namedCount.set(r.doc_title as string, (namedCount.get(r.doc_title as string) || 0) + 1);
      cmap.set(r.id, r);
    }
  }
  const scored = Array.from(cmap.values())
    .map((c) => {
      const cl = (c.content || '').toLowerCase();
      const sl = (c.section || '').toLowerCase();
      let score = 0;
      // Vung tieu de cua doan (WO-WEB-08): moc mo Dieu/Muc/Chuong/Phan trong
      // 400 ky tu dau (doan mo dau bang ghi chu hieu luc chen truoc van tim
      // thay moc sau phan ghi chu), tinh den moc liet ke " 1. " dau tien
      // (toi da 160 ky tu); Dieu khong co moc liet ke thi lay 64 ky tu ke
      // tu moc. Don vi khop trong vung tieu de duoc cong them w * mult * 1,
      // vi tieu de Dieu noi dung luong cua ca doan trong vai cum tu.
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
          score += pu.w * pu.mult * (occ + (inSection ? 2 : 0) + (inHead ? 1 : 0));
      }
      if (namedTitles.has(c.doc_title as string)) {
        score += 3 * Math.log(1 + TOTAL / Math.max(1, namedCount.get(c.doc_title as string) || 1));
      }
      return { doc_title: c.doc_title as string, section: (c.section || '') as string, content: c.content as string, score };
    })
    .filter((c) => c.score > 1)
    .sort((a, b) => b.score - a.score);

  const chunks: typeof scored = [];
  const seenSection = new Set<string>();
  for (const c of scored) {
    const k = `${c.doc_title}|${c.section}`;
    if (seenSection.has(k)) continue;
    seenSection.add(k);
    chunks.push(c);
    if (chunks.length >= 4) break;
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
        chunks.map((c) => `[${c.doc_title} — ${c.section}] ${c.content.slice(0, 900)}`).join('\n')
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

    const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
    if (rateLimited(ip)) {
      return NextResponse.json(
        { reply: 'Anh/chị đang gửi câu hỏi quá nhanh. Vui lòng chờ ít phút rồi hỏi lại, hoặc gọi 02033.795.898 để được hỗ trợ.', provider: 'rate_limited', sources: [] },
        { status: 429 }
      );
    }

    // 1) Sàng lọc khẩn cấp trước mọi xử lý khác.
    const normalized = lastUser.toLowerCase();
    if (EMERGENCY_KEYWORDS.some((k) => normalized.includes(k))) {
      await logChat(lastUser, EMERGENCY_REPLY, 'rule-emergency');
      return NextResponse.json({ reply: EMERGENCY_REPLY, provider: 'rule-emergency', sources: [] });
    }

    // 2) Chưa cấu hình khóa AI: trả thông điệp êm.
    if (!process.env.DEEPSEEK_API_KEY && !process.env.GEMINI_API_KEY && !process.env.OPENROUTER_API_KEY) {
      await logChat(lastUser, NOT_CONFIGURED_REPLY, 'not-configured');
      return NextResponse.json({ reply: NOT_CONFIGURED_REPLY, provider: 'not-configured', sources: [] });
    }

    // 3) Truy xuất bài viết liên quan + gọi AI.
    const { context, sources } = await retrieveContext(lastUser);
    const system = buildSystemPrompt(context);
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
