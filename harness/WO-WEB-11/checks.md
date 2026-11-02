# WO-WEB-11: Bảng kiểm tra

| # | Hạng mục | Kết quả | Bằng chứng |
|---|----------|---------|------------|
| 1 | Tái hiện lỗi live trước khi sửa | pass | POST /api/chat với câu trong ảnh chụp: nguồn là 3 đoạn NĐ 165/2026 và NQ 104/NQ-CP, không có Điều 3 TT 13/2026; An từ chối liệt kê theo nhánh thiếu dữ liệu |
| 2 | Chẩn đoán ngoại tuyến xác định được nguyên nhân | pass | diag5.py: Điều 3 hạng 7 (130,9 điểm), thua vị trí chọn cuối 0,5 điểm; 4 cách hỏi anh em dao động hạng 2-6 |
| 3 | Mô phỏng biến thể nhóm chọn 5 đoạn đạt toàn bộ cổng | pass | test_top5.py: 17/17 cổng (12 cổng WO-WEB-09 + 5 cách hỏi mới) |
| 4 | Build production đạt | pass | npm run build ngày 02/11/2026: Compiled successfully |
| 5 | Live: 9 cách hỏi loại vắc xin đều dẫn Điều 3 TT 13/2026 hoặc đoạn 14 loại của QĐ 2780 | pass | Cả 9/9 cách hỏi (gồm câu trong ảnh chụp) đều có TT 13/2026 trong nguồn và 9/9 đáp án liệt kê danh mục Điều 3; riêng cách hỏi "Trạm có những loại vắc xin nào" còn phân biệt đúng danh mục bắt buộc toàn quốc với lượng vắc xin Trạm có sẵn từng đợt và hướng dẫn gọi xác minh |
| 6 | Live hồi quy: danh mục bệnh, điều kiện cơ sở, phản vệ, sàng lọc, lịch tiêm, chi phí không tụt | pass | Danh mục bệnh 2 cách hỏi đạt; điều kiện cơ sở dẫn Điều 9 NĐ 104/2016; ca "bé bị phản vệ" dẫn 3 đoạn TT 51/2017 kèm chỉ dẫn cấp cứu trước; sàng lọc dẫn QĐ 1575; lịch tiêm 18, 24, 25; chi phí dẫn Điều 48 NĐ 165/2026. Ghi chú: cách hỏi chứa nguyên cụm "sốc phản vệ" đi đường rule-emergency theo thiết kế từ WO-WEB-06, không qua AI |
| 7 | Live: hành vi quy trình tư vấn WO-WEB-10 giữ nguyên (câu mơ hồ một câu hỏi làm rõ; ca khẩn cấp đi đường xác định) | pass | "Em muốn hỏi về tiêm chủng" vẫn nhận đúng một câu hỏi lựa chọn; "mất ý thức" vẫn provider=rule-emergency |
