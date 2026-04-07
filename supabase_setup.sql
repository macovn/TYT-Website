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

-- 9. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- 10. Create Policies
-- ... (existing policies)
CREATE POLICY "Staff are viewable by everyone" ON staff FOR SELECT USING (true);
CREATE POLICY "Staff are manageable by admins" ON staff FOR ALL USING (auth.role() = 'authenticated');

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
-- These policies allow anyone to read and authenticated users to upload to the staff-images bucket

CREATE POLICY "Allow public read staff images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'staff-images' );

CREATE POLICY "Allow upload staff images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'staff-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Allow update staff images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'staff-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Allow delete staff images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'staff-images' AND auth.role() = 'authenticated' );

-- Storage Policies for media
-- These policies allow anyone to read and authenticated users to upload to the media bucket

CREATE POLICY "Allow public read media"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

CREATE POLICY "Allow upload media"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'media' AND auth.role() = 'authenticated' );

CREATE POLICY "Allow update media"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'media' AND auth.role() = 'authenticated' );

CREATE POLICY "Allow delete media"
ON storage.objects FOR DELETE
USING ( bucket_id = 'media' AND auth.role() = 'authenticated' );

-- Storage Policies for documents
-- These policies allow anyone to read and authenticated users to upload to the documents bucket

CREATE POLICY "Allow public read documents"
ON storage.objects FOR SELECT
USING ( bucket_id = 'documents' );

CREATE POLICY "Allow upload documents"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'documents' AND auth.role() = 'authenticated' );

CREATE POLICY "Allow update documents"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'documents' AND auth.role() = 'authenticated' );

CREATE POLICY "Allow delete documents"
ON storage.objects FOR DELETE
USING ( bucket_id = 'documents' AND auth.role() = 'authenticated' );

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
