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
-- ... (existing services table)

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
CREATE POLICY "Pages are insertable by authenticated users" ON pages FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Pages are updatable by authenticated users" ON pages;
CREATE POLICY "Pages are updatable by authenticated users" ON pages FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Pages are deletable by authenticated users" ON pages;
CREATE POLICY "Pages are deletable by authenticated users" ON pages FOR DELETE USING (auth.role() = 'authenticated');


-- Policies for categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Categories are manageable by authenticated users" ON categories;
DROP POLICY IF EXISTS "Categories are insertable by authenticated users" ON categories;
CREATE POLICY "Categories are insertable by authenticated users" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Categories are updatable by authenticated users" ON categories;
CREATE POLICY "Categories are updatable by authenticated users" ON categories FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Categories are deletable by authenticated users" ON categories;
CREATE POLICY "Categories are deletable by authenticated users" ON categories FOR DELETE USING (auth.role() = 'authenticated');


-- Policies for messages
DROP POLICY IF EXISTS "Messages are readable and manageable by authenticated users" ON messages;
DROP POLICY IF EXISTS "Messages are viewable by authenticated users" ON messages;
CREATE POLICY "Messages are viewable by authenticated users" ON messages FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Messages are deletable by authenticated users" ON messages;
CREATE POLICY "Messages are deletable by authenticated users" ON messages FOR DELETE USING (auth.role() = 'authenticated');

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
CREATE POLICY "Posts are insertable by authenticated users" ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Posts are updatable by authenticated users" ON posts;
CREATE POLICY "Posts are updatable by authenticated users" ON posts FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Posts are deletable by authenticated users" ON posts;
CREATE POLICY "Posts are deletable by authenticated users" ON posts FOR DELETE USING (auth.role() = 'authenticated');


-- Policies for announcements
DROP POLICY IF EXISTS "Announcements are viewable by everyone" ON announcements;
CREATE POLICY "Announcements are viewable by everyone" ON announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Announcements are manageable by authenticated users" ON announcements;
DROP POLICY IF EXISTS "Announcements are insertable by authenticated users" ON announcements;
CREATE POLICY "Announcements are insertable by authenticated users" ON announcements FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Announcements are updatable by authenticated users" ON announcements;
CREATE POLICY "Announcements are updatable by authenticated users" ON announcements FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Announcements are deletable by authenticated users" ON announcements;
CREATE POLICY "Announcements are deletable by authenticated users" ON announcements FOR DELETE USING (auth.role() = 'authenticated');


-- Policies for documents
DROP POLICY IF EXISTS "Documents are viewable by everyone" ON documents;
CREATE POLICY "Documents are viewable by everyone" ON documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Documents are manageable by authenticated users" ON documents;
DROP POLICY IF EXISTS "Documents are insertable by authenticated users" ON documents;
CREATE POLICY "Documents are insertable by authenticated users" ON documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Documents are updatable by authenticated users" ON documents;
CREATE POLICY "Documents are updatable by authenticated users" ON documents FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Documents are deletable by authenticated users" ON documents;
CREATE POLICY "Documents are deletable by authenticated users" ON documents FOR DELETE USING (auth.role() = 'authenticated');


-- Policies for services
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);


-- Policies for media
DROP POLICY IF EXISTS "Media are viewable by everyone" ON media;
CREATE POLICY "Media are viewable by everyone" ON media FOR SELECT USING (true);

DROP POLICY IF EXISTS "Media are manageable by authenticated users" ON media;
DROP POLICY IF EXISTS "Media are insertable by authenticated users" ON media;
CREATE POLICY "Media are insertable by authenticated users" ON media FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Media are updatable by authenticated users" ON media;
CREATE POLICY "Media are updatable by authenticated users" ON media FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Media are deletable by authenticated users" ON media;
CREATE POLICY "Media are deletable by authenticated users" ON media FOR DELETE USING (auth.role() = 'authenticated');


-- Policies for staff
DROP POLICY IF EXISTS "Staff are viewable by everyone" ON staff;
CREATE POLICY "Staff are viewable by everyone" ON staff FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff are manageable by admins" ON staff;
DROP POLICY IF EXISTS "Staff are insertable by admins" ON staff;
CREATE POLICY "Staff are insertable by admins" ON staff FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Staff are updatable by admins" ON staff;
CREATE POLICY "Staff are updatable by admins" ON staff FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Staff are deletable by admins" ON staff;
CREATE POLICY "Staff are deletable by admins" ON staff FOR DELETE USING (auth.role() = 'authenticated');


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
WITH CHECK ( bucket_id = 'staff-images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Allow update staff images" ON storage.objects;
CREATE POLICY "Allow update staff images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'staff-images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Allow delete staff images" ON storage.objects;
CREATE POLICY "Allow delete staff images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'staff-images' AND auth.role() = 'authenticated' );


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
WITH CHECK ( bucket_id = 'media' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Allow update media" ON storage.objects;
CREATE POLICY "Allow update media"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'media' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Allow delete media" ON storage.objects;
CREATE POLICY "Allow delete media"
ON storage.objects FOR DELETE
USING ( bucket_id = 'media' AND auth.role() = 'authenticated' );


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
WITH CHECK ( bucket_id = 'documents' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Allow update documents" ON storage.objects;
CREATE POLICY "Allow update documents"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'documents' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Allow delete documents" ON storage.objects;
CREATE POLICY "Allow delete documents"
ON storage.objects FOR DELETE
USING ( bucket_id = 'documents' AND auth.role() = 'authenticated' );


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
INSERT INTO posts (title, content, excerpt, category_id, status)
SELECT 
  'Trạm Y tế Cái Bầu triển khai tiêm chủng mở rộng tháng 3/2026',
  'Trạm Y tế Cái Bầu thông báo lịch tiêm chủng mở rộng cho trẻ em trên địa bàn xã trong tháng 3/2026. Đề nghị các bậc phụ huynh đưa trẻ đến đúng giờ để đảm bảo an toàn tiêm chủng...',
  'Lịch tiêm chủng định kỳ cho trẻ em tại Trạm Y tế Cái Bầu trong tháng 3/2026.',
  id,
  'published'
FROM categories WHERE slug = 'hoat-dong-tram' LIMIT 1;

-- 12. Fix existing unconfirmed users
-- Run this in the SQL Editor to confirm all current users who haven't confirmed their email
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
