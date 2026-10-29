# WO-WEB-06 Progress

- 29/10/2026: Maco giao việc và duyệt 3 đề xuất (persona An + DeepSeek/Gemini; tri thức công khai + FAQ; lưu nhật ký câu hỏi). Đã lập plan.md, checks.md; nhánh dot-2/bot-ho-tro-nguoi-dan từ main e7e61af.
- Điều tra nền: layout gốc bọc mọi trang (widget phải tự ẩn ở /admin theo pathname); API routes hiện có dùng @supabase/supabase-js phía server với SUPABASE_SERVICE_ROLE_KEY đã có trên Vercel; client công khai import { supabase } từ @/lib/supabase.
- Đã dựng: src/lib/bot-knowledge.ts (thông tin Trạm + 8 FAQ + từ khóa khẩn cấp + prompt hệ thống có rào an toàn), src/app/api/chat/route.ts (sàng lọc khẩn cấp, truy xuất bài viết theo từ khóa tiêu đề, DeepSeek chính/Gemini dự phòng, giới hạn 20 lượt/5 phút/IP, ghi chat_logs bằng service role), src/components/SupportChat.tsx (widget nổi, tự ẩn ở /admin, hiển thị văn bản thuần + link bài đọc thêm), gắn vào layout gốc, sql/dot2-chat-logs.sql, bổ sung .env.example.
- Build pass; kiểm thử API cục bộ đạt cả hai tình huống (chưa cấu hình, khẩn cấp).
- PR #28 merged (61110110); bảng chat_logs đã tạo trên Supabase (RLS bật, 0 dòng). Kiểm chứng live trước khóa: widget hiện trên trang chủ, vắng ở /admin/login; API trả đúng hai tình huống chưa cấu hình và khẩn cấp; trang chủ, /thong-bao, /tai-lieu, /admin/login đều 200.
- Phát hiện khi kiểm chứng: Vercel chưa có SUPABASE_SERVICE_ROLE_KEY nên chat_logs chưa ghi được dòng nào (route dự phòng anon bị RLS chặn, đúng thiết kế an toàn). Đã báo Maco bổ sung cả 3 khóa khi anh nhập khóa AI.
- Maco bổ sung thêm OPENROUTER_API_KEY ngoài kế hoạch: đã nối thêm tầng dự phòng OpenRouter (model deepseek/deepseek-chat) vào chuỗi DeepSeek -> OpenRouter -> Gemini trên nhánh dot-2/bot-bo-sung-openrouter, build pass.
