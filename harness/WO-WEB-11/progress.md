# WO-WEB-11: Tiến độ

## Ngày 02/11/2026 (Marley)

- Nhận ảnh chụp của Maco lúc 15:44: cách hỏi "Các loại vắc xin trong Chương trình tiêm chủng mở rộng là gì?" vẫn chưa được trả lời đúng. Tái hiện live xác nhận lỗi còn thật.
- Chẩn đoán ngoại tuyến (diag5.py trên đúng 309 đoạn live): Điều 3 Thông tư 13/2026 hạng 7 với 130,9 điểm, thua Điều 3 Nghị quyết 104/NQ-CP ở vị trí chọn cuối đúng 0,5 điểm; họ câu hỏi liệt kê vắc xin dao động sát ngưỡng chọn.
- Phương án chốt: nhóm chọn 5 đoạn, giữ trần 3 đoạn mỗi văn bản; mô phỏng đạt 17/17 cổng (test_top5.py). Đã loại phương án hạ trần 2 đoạn (phá ca phản vệ) và chuẩn hóa độ dài kiểu BM25 (rủi ro hồi quy toàn diện).
- Đã sửa src/app/api/chat/route.ts trên nhánh dot-2/wo-web-11-nhom-chon-5.

## Kiểm chứng live sau gộp PR #42 (Marley, 02/11/2026)

- PR code #42 (merge 8da64817) đã gộp chiều 02/11/2026; thăm dò bản live bằng chính câu hỏi trong ảnh chụp cho thấy Thông tư 13/2026 xuất hiện trong nguồn ở lượt thăm dò thứ 4.
- Bộ kiểm chứng live: 9/9 cách hỏi loại vắc xin đạt (câu trong ảnh chụp nay trả đủ danh mục Điều 3 Thông tư 13/2026 kèm căn cứ); bộ hồi quy đạt toàn bộ (danh mục bệnh, điều kiện cơ sở, phản vệ qua Thông tư 51/2017, sàng lọc, lịch tiêm, chi phí); hai ca chấm điểm hành vi của WO-WEB-10 (câu mơ hồ, khẩn cấp "mất ý thức") giữ nguyên.
- WO-WEB-11 đóng toàn bộ: họ câu hỏi liệt kê vắc xin nay có 9 cách hỏi đã kiểm chứng live, cộng 5 cách hỏi mô phỏng ngoại tuyến trong checks của WO-WEB-09/11 làm cổng hồi quy cho các lần chỉnh truy xuất sau.
