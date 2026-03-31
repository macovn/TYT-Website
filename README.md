# Trạm Y tế Cái Bầu - Website Conversion

Dự án chuyển đổi template HTML website y tế thành hệ thống thật sử dụng Next.js và Supabase.

## Tính năng chính
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Lucide Icons.
- **Backend:** Supabase (Auth, Database, Storage).
- **Admin Panel:** Quản lý bài viết, thông báo, tài liệu và tin nhắn liên hệ.
- **Responsive:** Tối ưu hóa cho mọi thiết bị (Mobile, Tablet, Desktop).

## Hướng dẫn cài đặt và chạy Local

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Cấu hình Supabase
- Tạo một dự án mới trên [Supabase](https://supabase.com/).
- Vào phần **SQL Editor** và chạy nội dung file `supabase_setup.sql` để tạo bảng và dữ liệu mẫu.
- Vào phần **Authentication** -> **Users** và tạo một tài khoản admin mới.

### 3. Cấu hình Biến môi trường
Tạo file `.env.local` ở thư mục gốc và điền thông tin từ Supabase (Settings -> API):
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Chạy ứng dụng
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

## Hướng dẫn Deploy

### Vercel (Frontend)
1. Đẩy code lên GitHub/GitLab/Bitbucket.
2. Kết nối dự án với Vercel.
3. Thêm các biến môi trường (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) trong phần Settings -> Environment Variables của Vercel.
4. Nhấn **Deploy**.

### Supabase (Backend)
1. Đảm bảo đã chạy script `supabase_setup.sql`.
2. Cấu hình **Site URL** trong Authentication -> URL Configuration thành URL của Vercel (ví dụ: `https://your-app.vercel.app`).
3. Thêm URL Vercel vào **Redirect URLs**.

## Cấu trúc thư mục
- `/src/app`: Các trang của ứng dụng (Home, Giới thiệu, Tin tức, Admin...).
- `/src/components`: Các thành phần giao diện dùng chung (Header, Footer, Hero...).
- `/src/lib`: Cấu hình Supabase client.
- `/src/app/globals.css`: Styles chính của ứng dụng.
