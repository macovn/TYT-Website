# WO-WEB-12: Bảng kiểm tra

## Trước khi gộp (điều kiện để báo cáo xin xác nhận merge)

| # | Hạng mục | Kết quả | Bằng chứng |
|---|----------|---------|------------|
| 1 | Thuật toán đợt dự kiến đúng tại 4 mốc neo ngoại tuyến: 17/11/2026 cho 18/11 (Thứ Tư); 19/11/2026 cho 24/11 (Thứ Ba); 26/11/2026 cho 18/12 (Thứ Sáu); mốc thật 03/11/2026 cho 18/11, 24/11, 25/11 | pass | Hàm buildScheduleLines được trích nguyên văn từ route.ts và chạy kiểm tra bằng Node với 5 mốc neo: toàn bộ đạt, gồm đúng ngày và đúng thứ |
| 2 | Loại trừ cuối tuần đúng: mốc 24/10/2026 (Thứ 7) bị bỏ qua, đợt dự kiến tính từ mốc này bắt đầu 18/11/2026; ngày 25/10/2026 (Chủ nhật) cũng bị loại | pass | Cùng bộ kiểm tra tại mốc neo 24/10/2026: cả hai ngày cuối tuần của tháng 10 đều bị loại, đợt đầu tiên là 18/11/2026 |
| 3 | Build production đạt | pass | npm run build ngày 03/11/2026: Compiled successfully, 27/27 trang tĩnh |
| 4 | Rà soát diff: thay đổi chỉ gồm hàm tính lịch, lời gọi truyền tham số, một mục prompt mới; không đổi quy trình 5 bước, truy xuất, dữ liệu | pass | Diff đối chiếu với bản nhánh chính đã xác thực từng byte: bot-knowledge.ts đổi chữ ký hàm và cộng 4 dòng mục mới; route.ts cộng 37 dòng thuộc hàm buildScheduleLines và một dòng lời gọi; không dòng nào khác bị chạm |

## Sau khi được xác nhận merge và triển khai (kiểm chứng trên hệ thống thật)

| # | Hạng mục | Kết quả | Bằng chứng |
|---|----------|---------|------------|
| 5 | T15 tại mốc thật: hỏi "Đợt tiêm gần nhất sắp tới của Trạm là ngày nào?" trả đúng 18/11/2026, Thứ Tư, gọi đúng tên ngày dự kiến và kèm đường xác nhận | pending | Chờ xác nhận merge |
| 6 | T16 dạng quy tắc: hỏi ngày tiêm trùng Thứ 7 thì sao, trả lời không tổ chức theo quy tắc cuối tuần và gợi ý đợt liền kề | pending | Chờ xác nhận merge |
| 7 | T28: hỏi "Ngày 18/11/2026 Trạm có chắc chắn tổ chức tiêm không?" trả lời ngày dự kiến kèm hướng dẫn xác nhận, không khẳng định chắc chắn | pending | Chờ xác nhận merge |
| 8 | T29: hỏi ngày 18/11/2026 có trùng ngày lễ không, trả lời rõ chưa có dữ liệu ngày lễ | pending | Chờ xác nhận merge |
| 9 | Hồi quy hành vi: bộ 10 ca WO-WEB-10 giữ nguyên 10/10; 9 cách hỏi vắc xin giữ nguyên 9/9; ca P3, P4 (nhánh AI cấp cứu) giữ nguyên mức leo thang | pending | Chờ xác nhận merge |
| 10 | Độ trễ sau thay đổi so với mốc nền trước thay đổi (3 lượt gọi mẫu: 6,13 giây; 4,20 giây; 3,40 giây trên đường DeepSeek) | pending | Chờ xác nhận merge |
