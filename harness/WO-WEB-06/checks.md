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
