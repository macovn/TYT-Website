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
