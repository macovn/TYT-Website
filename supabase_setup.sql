-- SUPABASE SETUP SCRIPT FOR TRAM Y TE CAI BAU

-- 1. Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT, -- 'news', 'announcement'
  status TEXT DEFAULT 'draft', -- 'draft', 'published'
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  content TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create messages table (for contact form)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create media table
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT, -- 'image', 'video'
  source TEXT DEFAULT 'upload', -- 'upload', 'youtube'
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create services table
-- (WO-WEB-01: bổ sung CREATE TABLE còn thiếu — trước đây chỉ có comment,
--  chạy script trên project trống sẽ lỗi ở các lệnh ALTER/policy phía dưới.
--  Các cột khớp với code đang dùng: admin/services, dich-vu-y-te, ServicesSection.)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create staff table
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT,
  specialization TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8b. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'editor', -- 'admin', 'editor'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8c. Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- 9b. Security helpers (WO-WEB-01 — nhất quán với sql/dot1-security-migration.sql)
-- is_admin(): dùng trong mọi policy GHI của bảng nội dung và Storage.
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

-- protect_profile_role(): khóa cột role của profiles (vá B1 — leo thang
-- đặc quyền). Cho qua: service_role, phiên SQL Editor (postgres/
-- supabase_admin — đường bootstrap admin hợp lệ duy nhất qua client là
-- SQL/service role), admin hiện hữu. Chặn các trường hợp còn lại khi
-- INSERT với role khác mặc định 'editor' hoặc UPDATE làm đổi role.
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

-- 10. Create Policies
-- Policies for profiles
DROP POLICY IF EXISTS "Profiles are select/readable by everyone" ON profiles;
CREATE POLICY "Profiles are select/readable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert/update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
CREATE POLICY "Users can delete their own profile" ON profiles FOR DELETE USING (auth.uid() = id);


-- Policies for pages
DROP POLICY IF EXISTS "Pages are viewable by everyone" ON pages;
CREATE POLICY "Pages are viewable by everyone" ON pages FOR SELECT USING (true);

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


-- Policies for categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

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


-- Policies for messages
DROP POLICY IF EXISTS "Messages are readable and manageable by authenticated users" ON messages;
DROP POLICY IF EXISTS "Messages are viewable by authenticated users" ON messages;
DROP POLICY IF EXISTS "Messages are viewable by admins" ON messages;
CREATE POLICY "Messages are viewable by admins" ON messages FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Messages are updatable by admins" ON messages;
CREATE POLICY "Messages are updatable by admins" ON messages FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Messages are deletable by authenticated users" ON messages;
DROP POLICY IF EXISTS "Messages are deletable by admins" ON messages;
CREATE POLICY "Messages are deletable by admins" ON messages FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);


-- Policies for posts
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);

-- Drop older broad update/insert/delete policies that might exist in the live DB
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


-- Policies for announcements
DROP POLICY IF EXISTS "Announcements are viewable by everyone" ON announcements;
CREATE POLICY "Announcements are viewable by everyone" ON announcements FOR SELECT USING (true);

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


-- Policies for documents
DROP POLICY IF EXISTS "Documents are viewable by everyone" ON documents;
CREATE POLICY "Documents are viewable by everyone" ON documents FOR SELECT USING (true);

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


-- Policies for services
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Services are insertable by admins" ON services;
CREATE POLICY "Services are insertable by admins" ON services FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Services are updatable by admins" ON services;
CREATE POLICY "Services are updatable by admins" ON services FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Services are deletable by admins" ON services;
CREATE POLICY "Services are deletable by admins" ON services FOR DELETE USING (public.is_admin());


-- Policies for media
DROP POLICY IF EXISTS "Media are viewable by everyone" ON media;
CREATE POLICY "Media are viewable by everyone" ON media FOR SELECT USING (true);

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


-- Policies for staff
DROP POLICY IF EXISTS "Staff are viewable by everyone" ON staff;
CREATE POLICY "Staff are viewable by everyone" ON staff FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff are manageable by admins" ON staff;
DROP POLICY IF EXISTS "Staff are insertable by admins" ON staff;
CREATE POLICY "Staff are insertable by admins" ON staff FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff are updatable by admins" ON staff;
CREATE POLICY "Staff are updatable by admins" ON staff FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff are deletable by admins" ON staff;
CREATE POLICY "Staff are deletable by admins" ON staff FOR DELETE USING (public.is_admin());


-- 11. Storage Setup
-- Create the bucket if it doesn't exist and set to public
INSERT INTO storage.buckets (id, name, public)
VALUES ('staff-images', 'staff-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for staff-images
-- To prevent directory listing vulnerability while keeping files public via CDN URLs:
-- SELECT has been restricted to authenticated users. Public users can access images by direct URL.

DROP POLICY IF EXISTS "Allow public read staff images" ON storage.objects;
CREATE POLICY "Allow public read staff images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'staff-images' AND auth.role() = 'authenticated' );

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


-- Storage Policies for media
-- To prevent directory listing vulnerability while keeping files public via CDN URLs:
-- SELECT has been restricted to authenticated users. Public users can access media by direct URL.

DROP POLICY IF EXISTS "Allow public read media" ON storage.objects;
CREATE POLICY "Allow public read media"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' AND auth.role() = 'authenticated' );

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


-- Storage Policies for documents
-- To prevent directory listing vulnerability while keeping files public via CDN URLs:
-- SELECT has been restricted to authenticated users. Public users can access documents by direct URL.

DROP POLICY IF EXISTS "Allow public read documents" ON storage.objects;
CREATE POLICY "Allow public read documents"
ON storage.objects FOR SELECT
USING ( bucket_id = 'documents' AND auth.role() = 'authenticated' );

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


-- 11.5. Function Security and Privileges (Hardens trigger functions/SECURITY DEFINER)
-- We secure public.handle_new_user() by setting its search_path to public 
-- and revoking public execution rights so normal users cannot execute it.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user' AND pronamespace = 'public'::regnamespace) THEN
    ALTER FUNCTION public.handle_new_user() SET search_path = public;
    REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public;
    REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
    REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
  END IF;
END $$;

-- 8. Seed initial data
INSERT INTO categories (name, slug, description) VALUES
('Hoạt động trạm', 'hoat-dong-tram', 'Các hoạt động y tế tại trạm'),
('Tin tức y tế', 'tin-tuc-y-te', 'Thông tin y tế mới nhất'),
('Sức khỏe cộng đồng', 'suc-khoe-cong-dong', 'Kiến thức sức khỏe cho mọi người'),
('Phòng chống dịch', 'phong-chong-dich', 'Thông tin về các dịch bệnh');

-- Insert a sample post
-- (WO-WEB-01: bản gốc INSERT vào cột category_id không tồn tại trong bảng
--  posts — script sẽ lỗi khi chạy trên project trống. Đã sửa sang các cột
--  thật của bảng posts; category là cột TEXT nhận giá trị 'news'.)
INSERT INTO posts (title, content, excerpt, category, status)
VALUES (
  'Trạm Y tế Cái Bầu triển khai tiêm chủng mở rộng tháng 3/2026',
  'Trạm Y tế Cái Bầu thông báo lịch tiêm chủng mở rộng cho trẻ em trên địa bàn trong tháng 3/2026. Đề nghị các bậc phụ huynh đưa trẻ đến đúng giờ để đảm bảo an toàn tiêm chủng...',
  'Lịch tiêm chủng định kỳ cho trẻ em tại Trạm Y tế Cái Bầu trong tháng 3/2026.',
  'news',
  'published'
);

-- 12. (WO-WEB-01: ĐÃ GỠ lệnh cập nhật trực tiếp bảng auth.users ở bản gốc.)
-- Bản gốc có lệnh tự xác nhận email cho MỌI tài khoản chưa xác nhận
-- bằng cách cập nhật trực tiếp cột email_confirmed_at của bảng auth.users.
-- Lệnh này nguy hiểm nếu chạy lại trên project đang vận hành nên đã gỡ
-- khỏi file setup. Nếu thật sự cần xác nhận thủ công một tài khoản cụ thể,
-- thực hiện qua Supabase Dashboard (Authentication -> Users), không dùng
-- lệnh cập nhật hàng loạt vào auth.users.
