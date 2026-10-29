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
// liên quan -> DeepSeek chính, Gemini dự phòng -> ghi nhật ký chat_logs.
// Khóa API chỉ nằm ở biến môi trường phía server.

export const dynamic = 'force-dynamic';

const STOPWORDS = new Set([
  'cho', 'hoi', 'muon', 'biet', 'duoc', 'khong', 'nhung', 'ngay', 'thang',
  'tram', 'the', 'nao', 'gi', 'co', 'la', 'cua', 'va', 'thi', 'em', 'anh',
  'chi', 'xin', 've', 'o', 'tai', 'khi', 'den', 'di', 'lam', 'sao', 'bao',
  'nhieu', 'mot', 'hai', 'nay', 'do', 'ra', 'vao', 'len', 'voi', 'tu',
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

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function logChat(question: string, answer: string, provider: string) {
  try {
    const sb = serverClient();
    if (!sb) return;
    await sb.from('chat_logs').insert({ question, answer, provider });
  } catch {
    // Ghi nhật ký lỗi không được làm hỏng câu trả lời.
  }
}

function stripHtml(html: string): string {
  return (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function retrievePosts(question: string) {
  const sb = serverClient();
  if (!sb) return { context: '', sources: [] as { title: string; url: string }[] };
  const words = question
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w))
    .sort((a, b) => b.length - a.length)
    .slice(0, 4);
  const byId = new Map<string, any>();
  for (const w of words) {
    const { data } = await sb
      .from('posts')
      .select('id, title, content')
      .ilike('title', `%${w}%`)
      .limit(3);
    (data || []).forEach((p: any) => byId.set(p.id, p));
    if (byId.size >= 3) break;
  }
  const posts = Array.from(byId.values()).slice(0, 3);
  const context = posts
    .map((p) => `- Bài "${p.title}": ${stripHtml(p.content).slice(0, 500)}`)
    .join('\n');
  const sources = posts.map((p) => ({ title: p.title, url: `/tin-tuc/${p.id}` }));
  return { context, sources };
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
    if (!process.env.DEEPSEEK_API_KEY && !process.env.GEMINI_API_KEY) {
      await logChat(lastUser, NOT_CONFIGURED_REPLY, 'not-configured');
      return NextResponse.json({ reply: NOT_CONFIGURED_REPLY, provider: 'not-configured', sources: [] });
    }

    // 3) Truy xuất bài viết liên quan + gọi AI.
    const { context, sources } = await retrievePosts(lastUser);
    const system = buildSystemPrompt(context);
    let reply = '';
    let provider = '';
    try {
      reply = await callDeepSeek(system, history);
      provider = 'deepseek';
    } catch {
      try {
        reply = await callGemini(system, history);
        provider = 'gemini';
      } catch {
        reply = FALLBACK_REPLY;
        provider = 'error';
      }
    }
    await logChat(lastUser, reply, provider);
    return NextResponse.json({ reply, provider, sources: provider === 'error' ? [] : sources });
  } catch {
    return NextResponse.json({ reply: FALLBACK_REPLY, provider: 'error', sources: [] }, { status: 200 });
  }
}
