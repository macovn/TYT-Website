# WO-WEB-06 Checks

| # | Hạng mục | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | `npm run build` exit 0, route /api/chat xuất hiện trong bảng route | pass | Build 29/10/2026: Compiled successfully, route λ /api/chat có trong bảng route |
| 2 | Kiểm thử cục bộ không khóa: câu hỏi thường trả trạng thái chưa cấu hình êm; câu hỏi khẩn cấp trả đúng thông điệp cấp cứu kèm số 0203.3822.115 | pass | next start cục bộ + curl: câu hỏi lịch tiêm chủng trả provider not-configured kèm số 02033.795.898; câu 'khó thở và co giật' trả provider rule-emergency kèm 0203.3822.115, không qua AI |
| 3 | Bảng chat_logs tạo xong trên Supabase (RLS bật, không policy công khai) | unresolved | |
| 4 | PR merged vào main | unresolved | |
| 5 | Live: widget hiện trên trang chủ, không hiện trong /admin; trang chủ 200 | unresolved | |
| 6 | Live có khóa: hỏi lịch tiêm chủng trả đúng ngày 18, 24, 25 kèm trừ Thứ 7, Chủ nhật, ngày lễ, Tết; hỏi giờ làm việc trả 7:30-16:30; một lượt chat được ghi vào chat_logs | unresolved | |
| 7 | Không hồi quy: /thong-bao, /tai-lieu, /admin/login vẫn 200 | unresolved | |

## Nhật ký kiểm chứng

| Thời gian | Cách kiểm | Môi trường | Kết quả |
|---|---|---|---|
| 29/10/2026 | Build + curl API cục bộ | Local nhánh dot-2/bot-ho-tro-nguoi-dan | Build pass; hai tình huống API đạt như thiết kế |
