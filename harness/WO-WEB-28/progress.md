# WO-WEB-28 — Tiến độ và kết quả

- Mở WO: Maco lệnh "fix lỗi thẻ tiêu đề" ngày 17/11/2026 (lỗi phát hiện trong kiểm chứng WO-WEB-27, đã đối chiếu có sẵn trên Production từ trước).
- Nhánh: dot-2/wo-web-28-the-tieu-de; PR chính: #90 (gộp 86a04174 sau khi Maco xác nhận riêng ngày 17/11/2026).

## Nguyên nhân gốc
Hàm getPost trong src/app/tin-tuc/[slug]/page.tsx, nhánh tra theo slug, truy vấn cột excerpt không tồn tại trong bảng posts (bằng chứng: API trả lỗi 42703). Truy vấn lỗi làm getPost luôn trả null với URL dạng slug, generateMetadata luôn rơi về "Không tìm thấy bài viết". Thân bài vẫn đúng vì phía client dùng truy vấn khác; URL dạng UUID không lỗi vì nhánh đó chọn "*".

## Đã thực hiện
- Bỏ cột excerpt khỏi danh sách chọn của nhánh tra theo slug. Mô tả trang dùng đường dự phòng trích từ nội dung bài như thiết kế vốn có.
- Không đổi giao diện, nội dung, dữ liệu.

## Kiểm chứng
- Cổng build: tsc sạch, build sạch.
- Tại máy (dữ liệu thật): URL slug bài COPD cho tiêu đề đúng tên bài; URL dạng UUID vẫn đúng.
- Preview: không lấy được địa chỉ do cổng tra cứu GitHub vượt hạn mức trong ngày; đã báo rõ trước gộp, Maco duyệt trên cơ sở kiểm chứng tại máy.
- Production sau gộp: tiêu đề URL slug bài COPD đã đúng; URL dạng UUID vẫn đúng; trang chủ và /tin-tuc bình thường.

## Kết luận
WO-WEB-28 ĐÓNG.
