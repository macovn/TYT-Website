# WO-WEB-27 — Tiến độ và kết quả

- Mở WO: Maco duyệt ngày 17/11/2026 trên cơ sở hồ sơ đánh giá (plan.md).
- Nhánh: dot-2/wo-web-27-next16-react19; PR chính: #88 (gộp d7336e60 sau khi Maco xác nhận riêng ngày 17/11/2026).

## Đã thực hiện
- Nâng next 14.1.0 lên 16.4.6, react/react-dom lên 19.3.1, @types/react 19.3.0, typescript ^5.9.3, @supabase/supabase-js ^2.119.0.
- Thay @supabase/auth-helpers-nextjs (đã khai tử) bằng @supabase/ssr tại middleware, lib/supabase và admin layout; giữ nguyên cơ chế cookie và getSession như hiện hành.
- Chuyển headers()/cookies()/params sang dạng bất đồng bộ tại admin layout, tin-tuc/[slug], thong-bao/[id].
- Build giữ webpack qua cờ --webpack để bảo toàn tùy biến fallback cho sanitize-html; script lint chuyển sang ESLint 9 flat config (eslint.config.mjs), vì Next 16 đã gỡ next lint.
- lucide-react chốt ^0.577.0 thay vì 1.x: bản 1.x đã bỏ icon thương hiệu Facebook, Youtube, Twitter đang dùng ở 6 file; bản 0.577 là bản 0.x cuối, hỗ trợ React 19, không đổi giao diện.
- Giữ nguyên Tailwind 3.4; không đổi giao diện, nội dung, dữ liệu; không gồm Astryx.

## Kiểm chứng
- Cổng build: tsc sạch, build sạch sau rm -rf .next.
- Smoke tại máy Marley trên dữ liệu thật và kiểm chứng Preview PR #88 (T3, T4): trang công khai và khu quản trị (đăng nhập, Dashboard, danh sách bài, trình soạn thảo TipTap) đều đạt.
- Production sau gộp (T5): trang chính đúng, /admin chuyển về đăng nhập, An trả lời đúng các ca tiêm chủng, miễn phí và khẩn cấp; nguồn đọc thêm chỉ gồm bài viết trên website.
- Phát hiện ngoài phạm vi, đã có từ trước trên Production: thẻ tiêu đề trình duyệt của trang chi tiết bài viết dạng slug hiện "Không tìm thấy bài viết" dù nội dung hiển thị đầy đủ (lỗi generateMetadata khi tra theo slug). Chờ Maco quyết nếu muốn lập WO sửa riêng.

## Kết luận
WO-WEB-27 ĐÓNG. Nền tảng đã ở Next.js 16 + React 19, sẵn sàng cho các lựa chọn giao diện sau này (kể cả đánh giá lại Astryx khi thư viện ra bản ổn định).
