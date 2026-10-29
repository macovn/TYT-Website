# WO-WEB-06 Checks

| # | Hạng mục | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | `npm run build` exit 0, route /api/chat xuất hiện trong bảng route | pass | Build 29/10/2026: Compiled successfully, route λ /api/chat có trong bảng route |
| 2 | Kiểm thử cục bộ không khóa: câu hỏi thường trả trạng thái chưa cấu hình êm; câu hỏi khẩn cấp trả đúng thông điệp cấp cứu kèm số 0203.3822.115 | pass | next start cục bộ + curl: câu hỏi lịch tiêm chủng trả provider not-configured kèm số 02033.795.898; câu 'khó thở và co giật' trả provider rule-emergency kèm 0203.3822.115, không qua AI |
| 3 | Bảng chat_logs tạo xong trên Supabase (RLS bật, không policy công khai) | pass | SQL Editor 29/10/2026: CREATE TABLE + ENABLE RLS chạy thành công; truy vấn kiểm chứng so_dong = 0, relrowsecurity = true |
| 4 | PR merged vào main | pass | PR #28 merged (61110110); PR #29 bổ sung OpenRouter merged (29af2809) |
| 5 | Live: widget hiện trên trang chủ, không hiện trong /admin; trang chủ 200 | pass | curl bản live 29/10/2026: HTML trang chủ có nút 'Hỏi trợ lý An' (1), HTML /admin/login không có (0); trang chủ 200 |
| 6 | Live có khóa: hỏi lịch tiêm chủng trả đúng ngày 18, 24, 25 kèm trừ Thứ 7, Chủ nhật, ngày lễ, Tết; hỏi giờ làm việc trả 7:30-16:30; một lượt chat được ghi vào chat_logs | unresolved | |
| 7 | Không hồi quy: /thong-bao, /tai-lieu, /admin/login vẫn 200 | pass | curl bản live: /thong-bao 200, /tai-lieu 200, /admin/login 200 |

## Nhật ký kiểm chứng

| Thời gian | Cách kiểm | Môi trường | Kết quả |
|---|---|---|---|
| 29/10/2026 | Build + curl API cục bộ | Local nhánh dot-2/bot-ho-tro-nguoi-dan | Build pass; hai tình huống API đạt như thiết kế |
| 29/10/2026 | SQL Editor + curl bản live | Supabase + tramytecaibau.com | chat_logs tạo xong (RLS true); widget hiện đúng vị trí, ẩn ở /admin; API live trả đúng chưa cấu hình + khẩn cấp; chưa ghi được chat_logs vì Vercel thiếu SUPABASE_SERVICE_ROLE_KEY tại thời điểm đó |
| 29/10/2026 | Đối chiếu tên biến trên Vercel | Vercel project tyt-website | Maco đã thêm đủ khóa; phát hiện biến DeepSeek gõ thừa thành DEEPSDEEPSEEK_API_KEY, Maco đã xóa và thêm lại đúng DEEPSEEK_API_KEY, Marley kiểm lại đạt |
| 29/10/2026 | E2E có khóa qua API + widget thật | tramytecaibau.com | Nội dung trả lời đạt cả 3 tình huống (tiêm chủng, giờ làm việc, rào an toàn triệu chứng), provider deepseek; widget thật đạt 5/5 bước. NHƯNG chat_logs vẫn 0 dòng và truy xuất bài viết trả sources rỗng dù có 19 bài khớp 'tiêm', 16 bài khớp 'chủng': đường Supabase phía server qua service role key không hoạt động (quyền bảng đã kiểm chứng đủ, SET ROLE service_role ghi được) |
| 29/10/2026 | Chẩn đoán + sửa đường ghi/truy xuất | Supabase + mã nguồn | Tạo hàm log_chat SECURITY DEFINER (kiểm chứng ghi được 1 dòng, đã dọn); route chuyển sang khóa anon cho cả truy xuất posts và ghi log qua rpc, bỏ phụ thuộc service role key; sửa từ khóa khẩn cấp: bỏ 'xuất huyết' vì trùng tên bệnh sốt xuất huyết gây báo động giả; thêm quy tắc prompt viết văn bản thuần không markdown. Chờ kiểm chứng lại sau gộp |
