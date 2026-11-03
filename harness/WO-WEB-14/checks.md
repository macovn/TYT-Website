# WO-WEB-14: Bảng kiểm tra

## Trước khi gộp (toàn bộ chạy ngoại tuyến trên hàm scanEmergency trích nguyên văn từ mã nguồn)

| # | Hạng mục | Kết quả | Bằng chứng |
|---|----------|---------|------------|
| 1 | T27: bộ mẫu nền 29 cụm từ khóa hiện hành kích hoạt 29 trên 29 (điều kiện dừng cứng) | pass | Bộ kiểm thử ngoại tuyến trên hàm scanEmergency trích nguyên văn từ mã nguồn: 29 trên 29 kích hoạt, gồm cả mẫu "có dấu hiệu đột quỵ" từng bị hụt ở vòng chạy đầu do va chạm hình thức với dấu phủ định, đã xử lý và chạy lại đạt |
| 2 | T26: bộ sáu câu phủ định nhóm B không kích hoạt cả sáu, gồm đúng ca thăm dò P1 | pass | Cùng bộ kiểm thử: 6 trên 6 không kích hoạt |
| 3 | T08 và T09: hai câu phủ định tường minh không kích hoạt ở tầng xác định | pass | Cùng bộ kiểm thử: cả hai cho hành động none |
| 4 | Nhóm A đa lượt: P4 hai lượt; T24 ca ba lượt bắt buộc và biến thể dấu hiệu chỉ ở lượt 3; T12 lượt cuối vẫn kích hoạt; T25 hai câu phủ định một phần vẫn kích hoạt; T13 hai mẫu thiếu dấu và nửa dấu kích hoạt | pass | Cùng bộ kiểm thử: toàn bộ 9 ca đạt kỳ vọng emergency |
| 5 | Máy trạng thái: T31 lượt hỏi bình thường sau khi đã khám và về theo dõi không kích hoạt; T32 tái diễn sau theo dõi tại nhà kích hoạt lại; T33 đang ở cơ sở y tế cho hành động facility-note, không trả thông điệp 115; T34 đã giải quyết rồi tái diễn vẫn kích hoạt; T35 khoảng cách 8 lượt vẫn kích hoạt; T36 sự kiện mới sau sự kiện đã giải quyết kích hoạt bình thường | pass | Cùng bộ kiểm thử: T31 none, T32 emergency, T33 facility-note, T34 emergency, T35 emergency, T36 emergency, đúng toàn bộ kỳ vọng |
| 6 | Chứng minh Mục II.1: ca 14 tin nhắn (bối cảnh ở tin nhắn 1, diễn biến ở tin nhắn cuối) kích hoạt; ca hoàn tất ngược thứ tự (diễn biến trước, bối cảnh sau) kích hoạt; các ca kiểm soát bình thường (lịch tiêm, sốt nhẹ sau tiêm) không kích hoạt | pass | Cùng bộ kiểm thử: ca 14 tin nhắn kích hoạt; ca thứ tự ngược kích hoạt; 6 ca kiểm soát (lịch tiêm, sốt nhẹ sau tiêm, chưa tiêm xong, và các ca biên) đúng kỳ vọng; tổng toàn bộ bộ kiểm thử 61 trên 61 đạt |
| 7 | Build production đạt | pass | npm run build ngày 03/11/2026: Compiled successfully, 27/27 trang tĩnh |
| 8 | Rà soát diff: thay đổi chỉ gồm khối bộ lọc mới, thứ tự sàng lọc trước giới hạn tần suất, câu chữ 429 và hai quy tắc prompt cộng thêm | pass | route.ts: cộng khối scanEmergency và các danh sách mẫu, thay đoạn sàng lọc cũ bằng lời gọi bộ lọc mới đặt trước rate limit, bổ sung số trực cấp cứu vào thông điệp 429, nối ghi chú facility-note vào prompt; bot-knowledge.ts: cộng đúng hai quy tắc (tiếp nhận phủ định, dấu hiệu tích lũy); không chạm truy xuất, dữ liệu, EMERGENCY_REPLY và danh sách 29 từ khóa |

## Sau khi được xác nhận merge và triển khai (kiểm chứng trên hệ thống thật)

| # | Hạng mục | Kết quả | Bằng chứng |
|---|----------|---------|------------|
| 9 | T24 live: chuỗi ngã đập đầu, nôn nhiều kích hoạt rule-emergency ngay tại lượt 2; T08 live: câu phủ định P1 đi vào AI và được trả lời hữu ích, không nhận thông điệp cấp cứu | pending | Chờ xác nhận merge |
| 10 | Chuỗi trạng thái live: T31 đến T33 chạy nối tiếp trên Production cho kết quả đúng máy trạng thái; T11 đồng nghĩa nguy hiểm leo thang bằng tuyến AI kèm số 115 và 0203.3822.115 | pending | Chờ xác nhận merge |
| 11 | Hồi quy: 9 cách hỏi vắc xin 9/9; bộ 10 ca WO-WEB-10 giữ nguyên; ca mất ý thức vẫn qua rule-emergency; độ trễ không tăng bất thường | pending | Chờ xác nhận merge |
| 12 | T19: thứ tự sàng lọc trước giới hạn tần suất đối chiếu trực tiếp trong mã nguồn đã triển khai và câu chữ 429 có số trực cấp cứu; không tái hiện cưỡng bức giới hạn trên Production vì bộ đếm theo IP nằm trong bộ nhớ từng phiên bản máy chủ serverless, ghi rõ giới hạn bằng chứng này | pending | Chờ xác nhận merge |
