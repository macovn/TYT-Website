-- WO-WEB-15C: mã hội thoại và ghi nhật ký v2 (cộng thêm thuần túy).
-- Chạy trên Supabase SQL Editor của project wfygkioqceyjslbdpjht.
-- log_chat hiện hành được giữ nguyên; route tự lùi về v1 khi v2 lỗi.
-- Cấu trúc hiện tại đã đối chiếu trực tiếp ngày 04/11/2026:
-- chat_logs(id uuid, question text, answer text, provider text,
-- created_at timestamptz); log_chat v1 cắt q 1000, a 4000, p 32.

ALTER TABLE public.chat_logs
  ADD COLUMN IF NOT EXISTS conversation_id uuid;
ALTER TABLE public.chat_logs
  ADD COLUMN IF NOT EXISTS turn_index integer;

CREATE TABLE IF NOT EXISTS public.chat_conversations (
  conversation_id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_turn integer NOT NULL DEFAULT 0
);
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
-- Không tạo policy công khai nào cho chat_conversations.

DO $$
BEGIN
  ALTER TABLE public.chat_logs
    ADD CONSTRAINT chat_logs_conv_turn_unique
    UNIQUE (conversation_id, turn_index);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Số lượt do máy chủ tự tính bằng một câu lệnh upsert nguyên tử trên
-- hàng đếm của chính hội thoại; chữ ký hàm không nhận số lượt.
-- Trần độ dài: q 1000 (khớp v1 và trần cắt của route), a 8000,
-- p 120 (provider nay mang hậu tố cờ dài hơn trần 32 của v1).
CREATE OR REPLACE FUNCTION public.log_chat_v2(
  q text, a text, p text, conv uuid
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  next_turn integer;
BEGIN
  IF conv IS NULL THEN
    RETURN NULL;
  END IF;
  INSERT INTO public.chat_conversations (conversation_id, last_turn)
  VALUES (conv, 1)
  ON CONFLICT (conversation_id)
  DO UPDATE SET last_turn = public.chat_conversations.last_turn + 1
  RETURNING last_turn INTO next_turn;
  INSERT INTO public.chat_logs (
    question, answer, provider, conversation_id, turn_index
  )
  VALUES (
    left(q, 1000), left(a, 8000), left(coalesce(p, ''), 120),
    conv, next_turn
  );
  RETURN next_turn;
END;
$function$;

REVOKE ALL ON FUNCTION public.log_chat_v2(text, text, text, uuid)
  FROM PUBLIC;
-- Supabase tự cấp EXECUTE cho authenticated và service_role theo
-- quyền mặc định khi tạo hàm, nên phải thu hồi tường minh hai vai
-- trò này; trạng thái đích chỉ còn anon (và chủ sở hữu postgres).
REVOKE EXECUTE ON FUNCTION public.log_chat_v2(text, text, text, uuid)
  FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.log_chat_v2(text, text, text, uuid)
  FROM service_role;
GRANT EXECUTE ON FUNCTION public.log_chat_v2(text, text, text, uuid)
  TO anon;

COMMIT;
