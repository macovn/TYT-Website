# WO-WEB-09 Progress

## 02/11/2026 chiều: chẩn đoán và chốt phương án (Marley)

- Tái hiện sự cố live và đối chiếu mô phỏng: mô phỏng theo thứ tự ord khớp một phần (Điều 3 hạng 3) nhưng live rớt hẳn, cho thấy pool ứng viên limit 12 không thứ tự là nguồn dao động chính; kiểm tra độ bền bằng 5 thứ tự pool xác nhận thuật toán hiện tại trượt cổng câu đích 16/55 lượt.
- Loại dần các biến thể không đủ mạnh bằng mô phỏng: chỉ giới hạn đoạn/văn bản (trượt thêm cổng phản vệ), chỉ tăng limit pool (14/55), tăng trần âm tiết 10/12/16 (14/55), bigram chuỗi thô đơn thuần (trượt thêm cổng Luật Phòng bệnh).
- Biến thể chốt đạt 12/12 cổng offline và pin mở rộng 10 câu không hồi quy: (1) bigram dựng từ chuỗi âm tiết thô, chỉ bỏ cụm hai từ dừng; (2) điểm vùng tiêu đề Điều x2; (3) chấm toàn bộ bảng bot_chunks theo thứ tự ord, IDF đếm cục bộ; (4) tối đa 3 đoạn mỗi văn bản trong nhóm chọn 4 đoạn.
- Script mô phỏng và dữ liệu tập 309 đoạn: ~/workspace/wo-web-09/ (sim.py, sim2.py, sim3.py, sim4.py, diag.py, diag4.py, battery.py, chunks_live.json).
- Đã sửa src/app/api/chat/route.ts trên nhánh dot-2/wo-web-09-truy-xuat-vac-xin đúng 4 điểm trên; phần bài viết, prompt, khẩn cấp giữ nguyên. Kiểm chứng live sau gộp sẽ bổ sung vào mục này.
