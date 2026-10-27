-- ============================================================================
-- MIGRATION BẢO MẬT ĐỢT 1 — BẢN LIVE v2 (WO-WEB-01) — Website Trạm Y tế Cái Bầu
-- ============================================================================
-- Bản này THAY bản dot1-security-migration.sql khi áp lên project live
-- "Website" (ref wfygkioqceyjslbdpjht), vì schema/policy thực tế trên live
-- khác file supabase_setup.sql trong repo. Soạn ngày 27/10/2026 dựa trên
-- bản dump catalog thật (pg_tables / pg_policies / storage.buckets).
--
-- HIỆN TRẠNG LIVE ĐÃ XÁC MINH (27/10/2026):
--   * 9 bảng public: categories, documents, media, messages, pages, posts,
--     profiles, services, staff. KHÔNG có bảng announcements dù code dùng
--     ở 9 vị trí (trang Thông báo + ticker) -> mục 3 tạo bổ sung đúng schema
--     trong supabase_setup.sql. Bảng questions cũng không có (Hỏi đáp,
--     thuộc phạm vi Đợt 2, không xử lý ở đây).
--   * Lỗ hổng thật trên live:
--     - posts: policy DELETE "Allow delete posts" với điều kiện true cho
--       role public -> NGƯỜI LẠ KHÔNG CẦN ĐĂNG NHẬP cũng xóa được bài viết.
--     - Storage: policy mẫu "Doc flreew_1" / "Media 1ps738_1" (INSERT) và
--       "Doc1 flreew_0" / "Media1 1ps738_0" (UPDATE) chỉ check bucket_id
--       cho role public -> người lạ tải lên/ghi đè file tài liệu, media.
--     - documents/media/services/staff: policy tên "Admin Manage..." nhưng
--       điều kiện chỉ là auth.role()='authenticated'.
--     - posts: INSERT cho mọi authenticated; UPDATE đã check admin thật
--       (chuẩn hóa về is_admin() ở bản này).
--     - categories/pages/messages: RLS bật nhưng KHÔNG có policy nào
--       (deny-all qua API). Bản này bổ sung quyền quản trị cho admin;
--       riêng messages khôi phục INSERT công khai cho form liên hệ theo
--       đúng thiết kế gốc (trang lien-he ghi qua client).
--   * profiles đã có 1 admin (vuanhdung83vdqn@gmail.com) và 1 editor.
--   * Đăng ký công khai đã TẮT trên Dashboard ngày 27/10/2026 (ngoài SQL).
--
-- CÁCH CHẠY: Supabase Dashboard -> SQL Editor -> dán toàn bộ -> Run.
-- Idempotent: chạy lại nhiều lần vẫn an toàn.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Hàm kiểm tra admin dùng chung cho mọi policy ghi
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

COMMENT ON FUNCTION public.is_admin() IS
  'WO-WEB-01 v2: true nếu người gọi (auth.uid) có profiles.role = admin. Dùng trong RLS policy ghi.';

-- ----------------------------------------------------------------------------
-- 2. B1 — Trigger khóa cột role của profiles
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role'
     OR session_user IN ('postgres', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.role IS DISTINCT FROM 'editor' THEN
      RAISE EXCEPTION 'Khong duoc tu gan role % cho ho so moi', NEW.role;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Khong duoc tu thay doi role';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_role_trigger ON public.profiles;
CREATE TRIGGER protect_profile_role_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- ----------------------------------------------------------------------------
-- 3. Bổ sung bảng announcements (code đang dùng, live chưa có) và services
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  content TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Announcements are viewable by everyone" ON announcements;
CREATE POLICY "Announcements are viewable by everyone" ON announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Announcements are insertable by admins" ON announcements;
CREATE POLICY "Announcements are insertable by admins" ON announcements FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Announcements are updatable by admins" ON announcements;
CREATE POLICY "Announcements are updatable by admins" ON announcements FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Announcements are deletable by admins" ON announcements;
CREATE POLICY "Announcements are deletable by admins" ON announcements FOR DELETE USING (public.is_admin());

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);

-- ----------------------------------------------------------------------------
-- 4. B2 — Siết policy GHI các bảng nội dung về chỉ admin (tên policy thật)
-- ----------------------------------------------------------------------------

-- posts: xóa policy DELETE mở cho public và INSERT cho authenticated
DROP POLICY IF EXISTS "Allow delete posts" ON posts;
DROP POLICY IF EXISTS "Allow authenticated insert" ON posts;
DROP POLICY IF EXISTS "Admin update posts" ON posts;
DROP POLICY IF EXISTS "Posts are manageable by authenticated users" ON posts;
DROP POLICY IF EXISTS "Posts are insertable by admins" ON posts;
CREATE POLICY "Posts are insertable by admins" ON posts FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Posts are updatable by admins" ON posts;
CREATE POLICY "Posts are updatable by admins" ON posts FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Posts are deletable by admins" ON posts;
CREATE POLICY "Posts are deletable by admins" ON posts FOR DELETE USING (public.is_admin());
-- (giữ nguyên 2 policy SELECT công khai hiện có của posts)

-- documents
DROP POLICY IF EXISTS "Admin Manage Documents" ON documents;
DROP POLICY IF EXISTS "Documents are insertable by admins" ON documents;
CREATE POLICY "Documents are insertable by admins" ON documents FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Documents are updatable by admins" ON documents;
CREATE POLICY "Documents are updatable by admins" ON documents FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Documents are deletable by admins" ON documents;
CREATE POLICY "Documents are deletable by admins" ON documents FOR DELETE USING (public.is_admin());

-- media
DROP POLICY IF EXISTS "Admin Manage Media" ON media;
DROP POLICY IF EXISTS "Media are insertable by admins" ON media;
CREATE POLICY "Media are insertable by admins" ON media FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Media are updatable by admins" ON media;
CREATE POLICY "Media are updatable by admins" ON media FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Media are deletable by admins" ON media;
CREATE POLICY "Media are deletable by admins" ON media FOR DELETE USING (public.is_admin());

-- services
DROP POLICY IF EXISTS "Services are manageable by admins" ON services;
DROP POLICY IF EXISTS "Services are insertable by admins" ON services;
CREATE POLICY "Services are insertable by admins" ON services FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Services are updatable by admins" ON services;
CREATE POLICY "Services are updatable by admins" ON services FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Services are deletable by admins" ON services;
CREATE POLICY "Services are deletable by admins" ON services FOR DELETE USING (public.is_admin());

-- staff
DROP POLICY IF EXISTS "Staff are manageable by admins" ON staff;
DROP POLICY IF EXISTS "Staff are insertable by admins" ON staff;
CREATE POLICY "Staff are insertable by admins" ON staff FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Staff are updatable by admins" ON staff;
CREATE POLICY "Staff are updatable by admins" ON staff FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Staff are deletable by admins" ON staff;
CREATE POLICY "Staff are deletable by admins" ON staff FOR DELETE USING (public.is_admin());

-- pages: hiện không có policy nào; bổ sung quyền ghi cho admin
DROP POLICY IF EXISTS "Pages are insertable by admins" ON pages;
CREATE POLICY "Pages are insertable by admins" ON pages FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Pages are updatable by admins" ON pages;
CREATE POLICY "Pages are updatable by admins" ON pages FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Pages are deletable by admins" ON pages;
CREATE POLICY "Pages are deletable by admins" ON pages FOR DELETE USING (public.is_admin());

-- categories: hiện không có policy nào; bổ sung quyền ghi cho admin
DROP POLICY IF EXISTS "Categories are insertable by admins" ON categories;
CREATE POLICY "Categories are insertable by admins" ON categories FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Categories are updatable by admins" ON categories;
CREATE POLICY "Categories are updatable by admins" ON categories FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Categories are deletable by admins" ON categories;
CREATE POLICY "Categories are deletable by admins" ON categories FOR DELETE USING (public.is_admin());

-- messages: khôi phục INSERT công khai cho form liên hệ (thiết kế gốc);
-- đọc/sửa/xóa chỉ admin (admin dashboard đọc messages qua client).
DROP POLICY IF EXISTS "Messages are insertable by everyone" ON messages;
CREATE POLICY "Messages are insertable by everyone" ON messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Messages are viewable by admins" ON messages;
CREATE POLICY "Messages are viewable by admins" ON messages FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS "Messages are updatable by admins" ON messages;
CREATE POLICY "Messages are updatable by admins" ON messages FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Messages are deletable by admins" ON messages;
CREATE POLICY "Messages are deletable by admins" ON messages FOR DELETE USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. B2 — Storage: xóa policy mẫu cho phép người lạ ghi; siết ghi về admin
-- ----------------------------------------------------------------------------

-- Policy mẫu của Supabase (ghi không cần đăng nhập) — XÓA
DROP POLICY IF EXISTS "Doc flreew_1" ON storage.objects;
DROP POLICY IF EXISTS "Media 1ps738_1" ON storage.objects;
DROP POLICY IF EXISTS "Doc1 flreew_0" ON storage.objects;
DROP POLICY IF EXISTS "Media1 1ps738_0" ON storage.objects;

-- staff-images
DROP POLICY IF EXISTS "Allow upload staff images" ON storage.objects;
CREATE POLICY "Allow upload staff images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'staff-images' AND public.is_admin() );

DROP POLICY IF EXISTS "Allow update staff images" ON storage.objects;
CREATE POLICY "Allow update staff images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'staff-images' AND public.is_admin() );

DROP POLICY IF EXISTS "Allow delete staff images" ON storage.objects;
CREATE POLICY "Allow delete staff images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'staff-images' AND public.is_admin() );

-- media
DROP POLICY IF EXISTS "Allow upload media" ON storage.objects;
CREATE POLICY "Allow upload media"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'media' AND public.is_admin() );

DROP POLICY IF EXISTS "Allow update media" ON storage.objects;
CREATE POLICY "Allow update media"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'media' AND public.is_admin() );

DROP POLICY IF EXISTS "Allow delete media" ON storage.objects;
CREATE POLICY "Allow delete media"
ON storage.objects FOR DELETE
USING ( bucket_id = 'media' AND public.is_admin() );

-- documents
DROP POLICY IF EXISTS "Allow upload documents" ON storage.objects;
CREATE POLICY "Allow upload documents"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'documents' AND public.is_admin() );

DROP POLICY IF EXISTS "Allow update documents" ON storage.objects;
CREATE POLICY "Allow update documents"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'documents' AND public.is_admin() );

DROP POLICY IF EXISTS "Allow delete documents" ON storage.objects;
CREATE POLICY "Allow delete documents"
ON storage.objects FOR DELETE
USING ( bucket_id = 'documents' AND public.is_admin() );

-- ============================================================================
-- HẾT MIGRATION LIVE v2 (WO-WEB-01).
-- Kiểm chứng sau chạy:
--   * SELECT proname FROM pg_proc WHERE proname IN ('is_admin','protect_profile_role');
--   * Dump pg_policies: không còn policy GHI nào (INSERT/UPDATE/DELETE/ALL)
--     trên bảng nội dung và storage.objects có điều kiện chỉ là true hoặc
--     auth.role()='authenticated' hoặc chỉ bucket_id; ngoại lệ duy nhất có
--     chủ đích: messages INSERT công khai cho form liên hệ và các SELECT
--     công khai.
-- ============================================================================
