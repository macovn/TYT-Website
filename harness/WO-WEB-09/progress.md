# WO-WEB-09 Progress

## 02/11/2026 chiều: chẩn đoán và chốt phương án (Marley)

- Tái hiện sự cố live và đối chiếu mô phỏng: mô phỏng theo thứ tự ord khớp một phần (Điều 3 hạng 3) nhưng live rớt hẳn, cho thấy pool ứng viên limit 12 không thứ tự là nguồn dao động chính; kiểm tra độ bền bằng 5 thứ tự pool xác nhận thuật toán hiện tại trượt cổng câu đích 16/55 lượt.
- Loại dần các biến thể không đủ mạnh bằng mô phỏng: chỉ giới hạn đoạn/văn bản (trượt thêm cổng phản vệ), chỉ tăng limit pool (14/55), tăng trần âm tiết 10/12/16 (14/55), bigram chuỗi thô đơn thuần (trượt thêm cổng Luật Phòng bệnh).
- Biến thể chốt đạt 12/12 cổng offline và pin mở rộng 10 câu không hồi quy: (1) bigram dựng từ chuỗi âm tiết thô, chỉ bỏ cụm hai từ dừng; (2) điểm vùng tiêu đề Điều x2; (3) chấm toàn bộ bảng bot_chunks theo thứ tự ord, IDF đếm cục bộ; (4) tối đa 3 đoạn mỗi văn bản trong nhóm chọn 4 đoạn.
- Script mô phỏng và dữ liệu tập 309 đoạn: ~/workspace/wo-web-09/ (sim.py, sim2.py, sim3.py, sim4.py, diag.py, diag4.py, battery.py, chunks_live.json).
- Đã sửa src/app/api/chat/route.ts trên nhánh dot-2/wo-web-09-truy-xuat-vac-xin đúng 4 điểm trên; phần bài viết, prompt, khẩn cấp giữ nguyên.

## Kiểm chứng live sau gộp PR #38 (Marley, 02/11/2026)

- PR code #38 (merge f53a5dc) đã gộp chiều 02/11/2026; bản live Vercel cập nhật sau khoảng 2 phút thăm dò.
- Câu trong ảnh chụp của Maco ("Chương trình tiêm chủng mở rộng gồm những loại vắc xin nào?") chuyển từ trả "chưa có thông tin" sang trả danh mục theo Điều 3 TT 13/2026, đoạn Điều 3 vào nguồn ở vị trí 4 (sau 3 đoạn NĐ 165 bị chặn bởi trần 3 đoạn/văn bản).
- Toàn bộ bộ kiểm chứng live đạt: 4/4 cách hỏi loại vắc xin; 3/3 cách hỏi danh mục bệnh; điều kiện cơ sở (Điều 9 NĐ 104 kèm ghi chú chuyển tiếp); phản vệ (TT 51/2017 chiếm 3 nguồn đầu; cách hỏi "sốc phản vệ" đi đường khẩn cấp xác định); Luật Phòng bệnh; khám sàng lọc (QĐ 1575); lịch tiêm 18, 24, 25; khẩn cấp rule-emergency 0203.3822.115.
- WO-WEB-09 đóng toàn bộ: chẩn đoán, tinh chỉnh truy xuất, kiểm chứng live.
