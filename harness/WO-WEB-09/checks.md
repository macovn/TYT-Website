# WO-WEB-09 Checks

| # | Hạng mục | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Tái hiện sự cố trên bản live trước khi sửa | pass | POST /api/chat câu "Chương trình tiêm chủng mở rộng gồm những loại vắc xin nào?" trả "chưa có thông tin chi tiết danh mục các loại vắc xin", nguồn gồm 3 đoạn NĐ 165/2026 + NQ 104, không có Điều 3 TT 13/2026; khớp ảnh Maco gửi 14:31 ngày 02/11/2026 |
| 2 | Chẩn đoán bằng mô phỏng offline trung thực trên tập 309 đoạn live | pass | Thuật toán hiện tại trượt 16/55 lượt khi đổi 5 thứ tự pool; chấm toàn tập: Điều 3 TT 13/2026 hạng 6 (câu trong ảnh), hạng 15 (cách hỏi "Bé được tiêm..."); cụm "vắc xin" không thành đơn vị vì từ dừng "xin" (script tại ~/workspace/wo-web-09/sim.py, sim2.py, diag.py) |
| 3 | Offline: 4 cách hỏi về loại vắc xin trong TCMR đều đưa Điều 3 TT 13/2026 hoặc đoạn "14 loại vắc xin" của QĐ 2780 vào nhóm chọn | pass | Biến thể chốt (bigram chuỗi thô + điểm tiêu đề x2 + tối đa 3 đoạn/văn bản + pool toàn tập) đạt 12/12 cổng (sim4.py + kiểm tra cap trong cùng lượt) |
| 4 | Offline: không hồi quy 8 câu đã đạt (3 cách hỏi danh mục bệnh, điều kiện cơ sở, 2 cách hỏi phản vệ, Luật Phòng bệnh, khám sàng lọc) | pass | Cùng lượt mô phỏng mục 3: cả 8 cổng hồi quy đều đạt; pin mở rộng 10 câu hỏi người dân khác cho chọn đoạn tương đương hoặc tốt hơn (battery.py) |
| 5 | Build production đạt sau khi sửa route.ts | pass | npm run build ngày 02/11/2026 kết thúc exit 0, bảng route đầy đủ |
| 6 | Live sau gộp: 4 cách hỏi loại vắc xin trả danh mục theo Điều 3 TT 13/2026 (hoặc bảng vắc xin QĐ 2780) | pending | Chờ gộp PR và bản live Vercel cập nhật |
| 7 | Live sau gộp: không hồi quy danh mục bệnh (3 cách hỏi), điều kiện cơ sở, phản vệ, Luật Phòng bệnh, lịch tiêm, sàng lọc khẩn cấp | pending | Chờ gộp PR và bản live Vercel cập nhật |
