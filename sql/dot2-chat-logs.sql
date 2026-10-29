-- WO-WEB-06: Bang nhat ky hoi dap cua Bot ho tro nguoi dan.
-- Chi service role (API route /api/chat) ghi va doc; bat RLS va khong tao
-- policy cong khai de nguoi ngoai khong truy cap duoc nhat ky.
-- Khong luu thong tin ca nhan cua nguoi hoi (khong IP, khong dinh danh).

CREATE TABLE IF NOT EXISTS public.chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  provider text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

COMMIT;

-- Hàm ghi nhật ký cho API route: SECURITY DEFINER để ghi qua khóa anon
-- công khai mà không mở policy INSERT trực tiếp trên bảng. Chỉ ghi vào
-- chat_logs, giới hạn độ dài, không đọc được dữ liệu ra.
CREATE OR REPLACE FUNCTION public.log_chat(q text, a text, p text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.chat_logs (question, answer, provider)
  VALUES (left(q, 1000), left(a, 4000), left(coalesce(p, ''), 32));
END;
$$;

REVOKE ALL ON FUNCTION public.log_chat(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_chat(text, text, text) TO anon, authenticated, service_role;

COMMIT;
