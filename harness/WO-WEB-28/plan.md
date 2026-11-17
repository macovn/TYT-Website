# WO-WEB-28 — Sửa lỗi thẻ tiêu đề "Không tìm thấy bài viết" ở trang chi tiết bài viết dạng slug

## 1. Yêu cầu
Maco lệnh ngày 17/11/2026: "fix lỗi thẻ tiêu đề" — lỗi phát hiện trong lúc kiểm chứng WO-WEB-27, đã đối chiếu là lỗi có sẵn trên Production trước cả WO-WEB-27.

## 2. Nguyên nhân gốc (đã xác định bằng bằng chứng)
- Trang chi tiết bài viết /tin-tuc/[slug]: thân bài do PostDetailClient tải phía trình duyệt nên hiển thị đúng; thẻ tiêu đề do generateMetadata phía server quyết định qua hàm getPost trong src/app/tin-tuc/[slug]/page.tsx.
- Nhánh tra theo slug của getPost truy vấn các cột "id, title, excerpt, content, thumbnail" từ bảng posts. Bảng posts KHÔNG có cột excerpt (kiểm chứng qua API: lỗi 42703 "column posts.excerpt does not exist"). Truy vấn lỗi nên dữ liệu trả về rỗng, getPost luôn trả null với mọi URL dạng slug, generateMetadata luôn rơi về tiêu đề "Không tìm thấy bài viết".
- Nhánh tra theo UUID chọn "*" nên không lỗi; vì vậy các liên kết dạng /tin-tuc/<uuid> (như nguồn đọc thêm của An) có tiêu đề đúng, chỉ URL dạng slug (liên kết từ danh sách tin tức, trang chủ) mới sai.
- Kiểm tra lan rộng: trang thong-bao/[id] dùng select "*" nên không mắc lỗi này. Lỗi chỉ nằm ở một truy vấn duy nhất.

## 3. Cách sửa (tối thiểu, đúng điểm lỗi)
- Bỏ cột excerpt khỏi danh sách chọn của nhánh tra theo slug trong getPost. Phần mô tả trong generateMetadata đã có sẵn đường dự phòng lấy từ nội dung bài khi không có excerpt, nên hành vi sau sửa: tiêu đề là tiêu đề bài viết thật, mô tả trích từ đầu nội dung như thiết kế dự phòng vốn có.
- Không đổi giao diện, không đổi cấu trúc dữ liệu, không thêm cột vào bảng posts.

## 4. Kiểm chứng
- Cổng build: tsc + build sạch.
- Tại máy và trên Preview: mở một bài viết bằng URL dạng slug, thẻ tiêu đề trình duyệt phải là tiêu đề bài viết; mở một bài bằng URL dạng UUID, tiêu đề vẫn đúng như trước; trang danh sách và trang chủ không đổi.
- Sau gộp trên Production: kiểm tra lại URL bài COPD dạng slug và một URL dạng UUID.
