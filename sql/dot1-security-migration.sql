-- ============================================================================
-- MIGRATION BẢO MẬT ĐỢT 1 (WO-WEB-01) — Website Trạm Y tế Cái Bầu
-- ============================================================================
-- Mục đích:
--   B1: Khóa cột role của bảng profiles — người dùng thường KHÔNG tự gán/đổi
--       được role của mình nữa (vá lỗ hổng leo thang đặc quyền thành admin).
--   B2: Siết toàn bộ quyền GHI (INSERT/UPDATE/DELETE) của các bảng nội dung
--       và 3 bucket Storage từ "mọi tài khoản đã đăng nhập" về "chỉ admin"
--       (kiểm tra role qua bảng profiles). Quyền ĐỌC công khai giữ nguyên.
--   D : Bổ sung bảng services nếu project chưa có (file setup cũ thiếu
--       CREATE TABLE services).
--
-- CÁCH CHẠY:
--   1. Mở Supabase Dashboard của project -> SQL Editor -> New query.
--   2. Dán TOÀN BỘ file này vào và Run. File idempotent: chạy lại nhiều lần
--      vẫn an toàn (DROP ... IF EXISTS / CREATE OR REPLACE).
--   3. KHÔNG chạy file supabase_setup.sql đè lên project đang chạy; file này
--      là đường áp dụng cho project live, supabase_setup.sql chỉ dùng khi
--      dựng project mới và đã được cập nhật nhất quán với file này.
--
-- ĐIỀU KIỆN TRƯỚC KHI CHẠY (quan trọng):
--   * Bảo đảm ĐÃ CÓ ít nhất một hồ sơ admin trong bảng profiles. Kiểm tra:
--         SELECT id, email, role FROM public.profiles WHERE role = 'admin';
--     Nếu chưa có, tạo bằng chính SQL Editor (phiên postgres được trigger
--     bảo vệ cho qua — xem hàm protect_profile_role bên dưới):
--         INSERT INTO public.profiles (id, email, role)
--         SELECT id, email, 'admin' FROM auth.users WHERE email = '<email-quan-tri>';
--   * Sau khi chạy migration, cơ chế "email cứng tự phong admin" ở trang
--     đăng nhập sẽ không còn tác dụng với tài khoản chưa có profile admin,
--     vì client không tự ghi được role nữa. Đây là chủ đích của bản vá.
--   * Hệ quả cần biết: tài khoản role='editor' sẽ KHÔNG ghi/sửa/xóa được
--     nội dung qua RLS nữa (chỉ admin). Nếu cần giữ editor đăng bài, phải có
--     quyết định riêng để mở rộng hàm is_admin() — không tự sửa tại đây.
--   * Việc tắt đăng ký công khai (Authentication -> Sign In / Providers)
--     làm ở Dashboard, không nằm trong file SQL này.
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
  'WO-WEB-01: true nếu người gọi (auth.uid) có profiles.role = admin. Dùng trong RLS policy ghi.';

-- ----------------------------------------------------------------------------
-- 2. B1 — Trigger khóa cột role của profiles
--    Cho qua: service_role (API phía server), phiên SQL Editor
--    (postgres/supabase_admin — đường bootstrap admin), admin hiện hữu.
--    Chặn: mọi người gọi còn lại khi INSERT với role khác mặc định 'editor'
--    hoặc UPDATE làm thay đổi role.
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
-- 3. D — Tạo bảng services nếu project chưa có (khớp các cột code đang dùng)
-- ----------------------------------------------------------------------------
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
-- 4. B2 — Siết policy GHI của các bảng nội dung về chỉ admin
--    (SELECT công khai giữ nguyên như thiết kế hiện tại, không khai lại ở đây
--     trừ services ở mục 3 vì bảng có thể vừa được tạo mới.)
-- ----------------------------------------------------------------------------

-- pages
DROP POLICY IF EXISTS "Pages are manageable by authenticated users" ON pages;
DROP POLICY IF EXISTS "Pages are insertable by authenticated users" ON pages;
DROP POLICY IF EXISTS "Pages are insertable by admins" ON pages;
CREATE POLICY "Pages are insertable by admins" ON pages FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Pages are updatable by authenticated users" ON pages;
DROP POLICY IF EXISTS "Pages are updatable by admins" ON pages;
CREATE POLICY "Pages are updatable by admins" ON pages FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Pages are deletable by authenticated users" ON pages;
DROP POLICY IF EXISTS "Pages are deletable by admins" ON pages;
CREATE POLICY "Pages are deletable by admins" ON pages FOR DELETE USING (public.is_admin());

-- categories
DROP POLICY IF EXISTS "Categories are manageable by authenticated users" ON categories;
DROP POLICY IF EXISTS "Categories are insertable by authenticated users" ON categories;
DROP POLICY IF EXISTS "Categories are insertable by admins" ON categories;
CREATE POLICY "Categories are insertable by admins" ON categories FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Categories are updatable by authenticated users" ON categories;
DROP POLICY IF EXISTS "Categories are updatable by admins" ON categories;
CREATE POLICY "Categories are updatable by admins" ON categories FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Categories are deletable by authenticated users" ON categories;
DROP POLICY IF EXISTS "Categories are deletable by admins" ON categories;
CREATE POLICY "Categories are deletable by admins" ON categories FOR DELETE USING (public.is_admin());

-- posts (gồm cả các tên policy cũ từng tồn tại trên project live)
DROP POLICY IF EXISTS "Posts are manageable by authenticated users" ON posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON posts;
DROP POLICY IF EXISTS "Enable update for users based on email" ON posts;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON posts;
DROP POLICY IF EXISTS "Allow public write" ON posts;
DROP POLICY IF EXISTS "Allow public update" ON posts;
DROP POLICY IF EXISTS "Allow public delete" ON posts;
DROP POLICY IF EXISTS "Allow anonymous update" ON posts;
DROP POLICY IF EXISTS "Allow anonymous insert" ON posts;
DROP POLICY IF EXISTS "Allow anonymous delete" ON posts;
DROP POLICY IF EXISTS "Allow all" ON posts;
DROP POLICY IF EXISTS "All can manage" ON posts;

DROP POLICY IF EXISTS "Posts are insertable by authenticated users" ON posts;
DROP POLICY IF EXISTS "Posts are insertable by admins" ON posts;
CREATE POLICY "Posts are insertable by admins" ON posts FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Posts are updatable by authenticated users" ON posts;
DROP POLICY IF EXISTS "Posts are updatable by admins" ON posts;
CREATE POLICY "Posts are updatable by admins" ON posts FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Posts are deletable by authenticated users" ON posts;
DROP POLICY IF EXISTS "Posts are deletable by admins" ON posts;
CREATE POLICY "Posts are deletable by admins" ON posts FOR DELETE USING (public.is_admin());

-- announcements
DROP POLICY IF EXISTS "Announcements are manageable by authenticated users" ON announcements;
DROP POLICY IF EXISTS "Announcements are insertable by authenticated users" ON announcements;
DROP POLICY IF EXISTS "Announcements are insertable by admins" ON announcements;
CREATE POLICY "Announcements are insertable by admins" ON announcements FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Announcements are updatable by authenticated users" ON announcements;
DROP POLICY IF EXISTS "Announcements are updatable by admins" ON announcements;
CREATE POLICY "Announcements are updatable by admins" ON announcements FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Announcements are deletable by authenticated users" ON announcements;
DROP POLICY IF EXISTS "Announcements are deletable by admins" ON announcements;
CREATE POLICY "Announcements are deletable by admins" ON announcements FOR DELETE USING (public.is_admin());

-- documents
DROP POLICY IF EXISTS "Documents are manageable by authenticated users" ON documents;
DROP POLICY IF EXISTS "Documents are insertable by authenticated users" ON documents;
DROP POLICY IF EXISTS "Documents are insertable by admins" ON documents;
CREATE POLICY "Documents are insertable by admins" ON documents FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Documents are updatable by authenticated users" ON documents;
DROP POLICY IF EXISTS "Documents are updatable by admins" ON documents;
CREATE POLICY "Documents are updatable by admins" ON documents FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Documents are deletable by authenticated users" ON documents;
DROP POLICY IF EXISTS "Documents are deletable by admins" ON documents;
CREATE POLICY "Documents are deletable by admins" ON documents FOR DELETE USING (public.is_admin());

-- media
DROP POLICY IF EXISTS "Media are manageable by authenticated users" ON media;
DROP POLICY IF EXISTS "Media are insertable by authenticated users" ON media;
DROP POLICY IF EXISTS "Media are insertable by admins" ON media;
CREATE POLICY "Media are insertable by admins" ON media FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Media are updatable by authenticated users" ON media;
DROP POLICY IF EXISTS "Media are updatable by admins" ON media;
CREATE POLICY "Media are updatable by admins" ON media FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Media are deletable by authenticated users" ON media;
DROP POLICY IF EXISTS "Media are deletable by admins" ON media;
CREATE POLICY "Media are deletable by admins" ON media FOR DELETE USING (public.is_admin());

-- staff (tên policy vốn đã ghi "by admins" nhưng điều kiện cũ chỉ là authenticated)
DROP POLICY IF EXISTS "Staff are manageable by admins" ON staff;
DROP POLICY IF EXISTS "Staff are insertable by admins" ON staff;
CREATE POLICY "Staff are insertable by admins" ON staff FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff are updatable by admins" ON staff;
CREATE POLICY "Staff are updatable by admins" ON staff FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff are deletable by admins" ON staff;
CREATE POLICY "Staff are deletable by admins" ON staff FOR DELETE USING (public.is_admin());

-- services: bổ sung policy ghi (trước đây chỉ có SELECT)
DROP POLICY IF EXISTS "Services are insertable by admins" ON services;
CREATE POLICY "Services are insertable by admins" ON services FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Services are updatable by admins" ON services;
CREATE POLICY "Services are updatable by admins" ON services FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Services are deletable by admins" ON services;
CREATE POLICY "Services are deletable by admins" ON services FOR DELETE USING (public.is_admin());

-- messages: INSERT công khai giữ nguyên (form liên hệ của người dân);
-- đọc/sửa/xóa là việc quản trị -> chỉ admin.
DROP POLICY IF EXISTS "Messages are readable and manageable by authenticated users" ON messages;
DROP POLICY IF EXISTS "Messages are viewable by authenticated users" ON messages;
DROP POLICY IF EXISTS "Messages are viewable by admins" ON messages;
CREATE POLICY "Messages are viewable by admins" ON messages FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Messages are updatable by admins" ON messages;
CREATE POLICY "Messages are updatable by admins" ON messages FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Messages are deletable by authenticated users" ON messages;
DROP POLICY IF EXISTS "Messages are deletable by admins" ON messages;
CREATE POLICY "Messages are deletable by admins" ON messages FOR DELETE USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. B2 — Siết policy GHI của 3 bucket Storage về chỉ admin
--    (SELECT giữ nguyên theo thiết kế hiện tại: yêu cầu authenticated để
--     chống liệt kê thư mục; file vẫn truy cập công khai qua URL trực tiếp
--     vì bucket để public.)
-- ----------------------------------------------------------------------------

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
-- HẾT MIGRATION WO-WEB-01.
-- Kiểm tra sau khi chạy (gợi ý):
--   * Đăng nhập bằng tài khoản KHÔNG phải admin, thử sửa một bài viết qua
--     giao diện/PostgREST -> phải bị từ chối.
--   * Thử UPDATE profiles SET role='admin' cho chính mình -> trigger báo lỗi.
--   * Đăng nhập admin, đăng bài + tải ảnh/tài liệu -> phải hoạt động.
-- ============================================================================
