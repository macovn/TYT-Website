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
| 5 | T15 tại mốc thật: hỏi "Đợt tiêm gần nhất sắp tới của Trạm là ngày nào?" trả đúng 18/11/2026, Thứ Tư, gọi đúng tên ngày dự kiến và kèm đường xác nhận | pass | Kiểm chứng live ngày 03/11/2026 sau merge 1a2e12e: trả đủ ba ngày dự kiến và nêu đợt gần nhất là Thứ 4 ngày 18/11/2026, nói rõ "đây chỉ là ngày dự kiến" và kèm đường xác nhận |
| 6 | T16 dạng quy tắc: hỏi ngày tiêm trùng Thứ 7 thì sao, trả lời không tổ chức theo quy tắc cuối tuần và gợi ý đợt liền kề | pass | Kiểm chứng live: giải thích ngày trùng Thứ 7 thì không tổ chức tiêm theo lịch cố định, đồng thời nhắc các ngày 18, 24, 25 chỉ là ngày dự kiến và hướng dẫn xác nhận qua bài thông báo tháng |
| 7 | T28: hỏi "Ngày 18/11/2026 Trạm có chắc chắn tổ chức tiêm không?" trả lời ngày dự kiến kèm hướng dẫn xác nhận, không khẳng định chắc chắn | pass | Kiểm chứng live: nói rõ đây là ngày dự kiến, chưa có bài thông báo tháng 11 trong lượt tra cứu nên chưa thể khẳng định là ngày đã xác nhận, đưa hai đường xác nhận |
| 8 | T29: hỏi ngày 18/11/2026 có trùng ngày lễ không, trả lời rõ chưa có dữ liệu ngày lễ | pass | Kiểm chứng live: nói rõ chưa có dữ liệu lịch nghỉ lễ, Tết nên không thể khẳng định có trùng hay không, giữ khung ngày dự kiến và đường xác nhận |
| 9 | Hồi quy hành vi: bộ 10 ca WO-WEB-10 giữ nguyên 10/10; 9 cách hỏi vắc xin giữ nguyên 9/9; ca P3, P4 (nhánh AI cấp cứu) giữ nguyên mức leo thang | pass | Kiểm chứng live ngày 03/11/2026: 9/9 cách hỏi mở đầu bằng danh mục Điều 3 Thông tư 13/2026; 10/10 ca hành vi giữ đúng chuẩn đã nghiệm thu (ca danh mục rõ ràng đối ứng phần 9 cách hỏi); ca mất ý thức vẫn qua tầng xác định rule-emergency; P3 và P4 vẫn leo thang đúng bằng nhánh AI kèm số 115 và 0203.3822.115 |
| 10 | Độ trễ sau thay đổi so với mốc nền trước thay đổi (3 lượt gọi mẫu: 6,13 giây; 4,20 giây; 3,40 giây trên đường DeepSeek) | pass | Ba lượt gọi sau thay đổi: 3,87 giây; 3,75 giây; 3,42 giây; không tăng so với mốc nền, nằm trong dao động thường lệ của đường DeepSeek |
