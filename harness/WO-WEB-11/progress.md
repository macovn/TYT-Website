# WO-WEB-11: Tiến độ

## Ngày 02/11/2026 (Marley)

- Nhận ảnh chụp của Maco lúc 15:44: cách hỏi "Các loại vắc xin trong Chương trình tiêm chủng mở rộng là gì?" vẫn chưa được trả lời đúng. Tái hiện live xác nhận lỗi còn thật.
- Chẩn đoán ngoại tuyến (diag5.py trên đúng 309 đoạn live): Điều 3 Thông tư 13/2026 hạng 7 với 130,9 điểm, thua Điều 3 Nghị quyết 104/NQ-CP ở vị trí chọn cuối đúng 0,5 điểm; họ câu hỏi liệt kê vắc xin dao động sát ngưỡng chọn.
- Phương án chốt: nhóm chọn 5 đoạn, giữ trần 3 đoạn mỗi văn bản; mô phỏng đạt 17/17 cổng (test_top5.py). Đã loại phương án hạ trần 2 đoạn (phá ca phản vệ) và chuẩn hóa độ dài kiểu BM25 (rủi ro hồi quy toàn diện).
- Đã sửa src/app/api/chat/route.ts trên nhánh dot-2/wo-web-11-nhom-chon-5.
- Kiểm chứng live sau gộp sẽ bổ sung vào mục này.
