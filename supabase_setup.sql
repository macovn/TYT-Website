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
  category_id UUID REFERENCES categories(id),
  status TEXT DEFAULT 'draft', -- 'draft', 'published'
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create announcements table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
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
  type TEXT, -- 'media', 'legal', 'form'
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 7. Create Policies
-- Categories: Public read, Admin write
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Categories are manageable by admins" ON categories FOR ALL USING (auth.role() = 'authenticated');

-- Posts: Public read (if published), Admin write
CREATE POLICY "Published posts are viewable by everyone" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Posts are manageable by admins" ON posts FOR ALL USING (auth.role() = 'authenticated');

-- Announcements: Public read, Admin write
CREATE POLICY "Announcements are viewable by everyone" ON announcements FOR SELECT USING (true);
CREATE POLICY "Announcements are manageable by admins" ON announcements FOR ALL USING (auth.role() = 'authenticated');

-- Messages: Public insert, Admin read/write
CREATE POLICY "Messages can be sent by everyone" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Messages are manageable by admins" ON messages FOR ALL USING (auth.role() = 'authenticated');

-- Documents: Public read, Admin write
CREATE POLICY "Documents are viewable by everyone" ON documents FOR SELECT USING (true);
CREATE POLICY "Documents are manageable by admins" ON documents FOR ALL USING (auth.role() = 'authenticated');

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

-- Insert sample announcements
INSERT INTO announcements (title, content) VALUES
('Lịch trực Tết Nguyên Đán 2026', 'Trạm Y tế Cái Bầu thông báo lịch trực cấp cứu 24/24 trong dịp Tết Nguyên Đán...'),
('Khám sức khỏe định kỳ cho người cao tuổi', 'Chương trình khám sức khỏe miễn phí cho người cao tuổi sẽ diễn ra vào sáng thứ 7 tuần này...');
