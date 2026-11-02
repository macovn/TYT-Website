# WO-WEB-11: Bảng kiểm tra

| # | Hạng mục | Kết quả | Bằng chứng |
|---|----------|---------|------------|
| 1 | Tái hiện lỗi live trước khi sửa | pass | POST /api/chat với câu trong ảnh chụp: nguồn là 3 đoạn NĐ 165/2026 và NQ 104/NQ-CP, không có Điều 3 TT 13/2026; An từ chối liệt kê theo nhánh thiếu dữ liệu |
| 2 | Chẩn đoán ngoại tuyến xác định được nguyên nhân | pass | diag5.py: Điều 3 hạng 7 (130,9 điểm), thua vị trí chọn cuối 0,5 điểm; 4 cách hỏi anh em dao động hạng 2-6 |
| 3 | Mô phỏng biến thể nhóm chọn 5 đoạn đạt toàn bộ cổng | pass | test_top5.py: 17/17 cổng (12 cổng WO-WEB-09 + 5 cách hỏi mới) |
| 4 | Build production đạt | pass | npm run build ngày 02/11/2026: Compiled successfully |
| 5 | Live: 9 cách hỏi loại vắc xin đều dẫn Điều 3 TT 13/2026 hoặc đoạn 14 loại của QĐ 2780 | pending | Chờ gộp PR và bản live cập nhật |
| 6 | Live hồi quy: danh mục bệnh, điều kiện cơ sở, phản vệ, sàng lọc, lịch tiêm, chi phí không tụt | pending | Chờ gộp PR |
| 7 | Live: hành vi quy trình tư vấn WO-WEB-10 giữ nguyên (câu mơ hồ một câu hỏi làm rõ; ca khẩn cấp đi đường xác định) | pending | Chờ gộp PR |
