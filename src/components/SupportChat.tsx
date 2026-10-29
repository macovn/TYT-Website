'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, X, Send, PhoneCall } from 'lucide-react';

// WO-WEB-06: Widget Bot hỗ trợ người dân "An".
// Chỉ hiện ở trang công khai, tự ẩn trong khu quản trị /admin.
// Câu trả lời hiển thị dạng văn bản thuần (không render HTML).

type Msg = {
  role: 'user' | 'bot';
  text: string;
  sources?: { title: string; url: string }[];
};

const QUICK_QUESTIONS = [
  'Lịch tiêm chủng của Trạm thế nào?',
  'Giờ làm việc của Trạm?',
  'Địa chỉ và số điện thoại của Trạm?',
  'Đến khám bệnh cần mang theo giấy tờ gì?',
];

const GREETING =
  'Chào anh/chị, em là An, trợ lý hỗ trợ người dân của Trạm Y tế Cái Bầu. Anh/chị cần hỏi về lịch tiêm chủng, giờ làm việc, thủ tục hay dịch vụ của Trạm, cứ nhắn cho em nhé.';

export default function SupportChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  if (pathname?.startsWith('/admin')) return null;

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: 'user', text: content }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      const reply: string =
        data?.reply ||
        'Xin lỗi anh/chị, em chưa trả lời được lúc này. Anh/chị vui lòng gọi 02033.795.898 để được hỗ trợ.';
      setMessages([
        ...next,
        { role: 'bot', text: reply, sources: Array.isArray(data?.sources) ? data.sources : [] },
      ]);
    } catch {
      setMessages([
        ...next,
        {
          role: 'bot',
          text: 'Xin lỗi anh/chị, kết nối đang gặp trục trặc. Anh/chị vui lòng thử lại hoặc gọi 02033.795.898 để được hỗ trợ.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Mở trò chuyện với trợ lý An"
          className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 bg-[var(--primary)] text-white pl-4 pr-5 py-3.5 rounded-full shadow-xl hover:bg-[var(--primary-dark)] transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="font-bold text-sm">Hỏi trợ lý An</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-[60] w-[min(92vw,380px)] h-[min(72vh,580px)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-[var(--primary)] text-white px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white text-[var(--primary)] flex items-center justify-center font-extrabold text-lg shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold leading-tight">An, Trợ lý hỗ trợ người dân</p>
              <p className="text-xs text-white/80 leading-tight">Trạm Y tế Cái Bầu, trả lời tự động</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Đóng trò chuyện"
              className="p-1.5 hover:bg-white/15 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <a
            href="tel:02033822115"
            className="bg-red-50 text-[#B42318] px-4 py-2 text-[13px] font-semibold flex items-center gap-2 shrink-0"
          >
            <PhoneCall className="w-4 h-4 shrink-0" />
            Khẩn cấp, gọi ngay: 0203.3822.115
          </a>

          <div ref={scrollRef} className="flex-1 overflow-y-auto bg-[#F4F7F5] px-3 py-3 space-y-2.5">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] bg-[var(--primary)] text-white rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed'
                      : 'max-w-[85%] bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed'
                  }
                >
                  {m.text}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                      <p className="text-xs font-semibold text-gray-500">Đọc thêm:</p>
                      {m.sources.map((s) => (
                        <Link
                          key={s.url}
                          href={s.url}
                          className="block text-xs text-[var(--primary)] font-medium hover:underline"
                        >
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm text-gray-500">
                  An đang trả lời...
                </div>
              </div>
            )}
            {messages.length <= 1 && !loading && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="bg-white border border-[var(--primary)]/30 text-[var(--primary)] text-xs font-medium px-2.5 py-1.5 rounded-full hover:bg-[var(--primary)] hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-3 border-t border-gray-100 flex items-center gap-2 shrink-0 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của anh/chị..."
              maxLength={1000}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Gửi câu hỏi"
              className="bg-[var(--primary)] text-white p-2.5 rounded-xl hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-40"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="px-3 pb-2.5 text-[11px] text-gray-400 text-center bg-white shrink-0">
            Thông tin An cung cấp chỉ để tham khảo, không thay thế việc khám bệnh trực tiếp tại Trạm.
          </p>
        </div>
      )}
    </>
  );
}
