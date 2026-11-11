# WO-WEB-19: Sửa lỗi không chuyển được trang ở trang Tin tức

- Nguồn lệnh: Maco gửi ảnh chụp trang Tin tức ngày 11/11/2026, khoanh các nút phân trang 1, 2, 3 và nút tiếp, yêu cầu sửa lỗi không chuyển được trang.
- Căn cứ ủy quyền: lệnh trực tiếp của Maco trong phiên này; merge vào main vẫn cần xác nhận riêng như mọi WO.
- Nhánh: dot-2/wo-web-19-phan-trang-tin-tuc (từ main).

## Chẩn đoán đã xác minh

Trang src/app/tin-tuc/page.tsx hiện tại: (1) truy vấn bài viết bị giới hạn cứng .limit(3) nên chỉ 3 bài mới nhất tồn tại ở phía khách; (2) khối phân trang ghi rõ "Pagination Placeholder" gồm bốn nút tĩnh không gắn bất kỳ xử lý bấm nào, nên bấm 2, 3 hay nút tiếp đều không có tác dụng. Số bài thuộc nhóm news trên Production là 271 bài (đếm trực tiếp qua REST ngày 11/11/2026).

## Thiết kế sửa

Giữ nguyên bố cục và kiểu dáng hiện tại, mỗi trang vẫn 3 bài như trang 1 đang hiển thị. Truy vấn theo trang bằng range kèm đếm tổng exact; thanh phân trang thật gồm nút lui, cửa sổ số trang quanh trang hiện tại kèm số trang đầu và cuối với dấu chấm lửng khi cần, và nút tiến; nút trang hiện tại giữ kiểu nền xanh như nút 1 hiện nay. Bấm sang trang thì cuộn lên đầu danh sách và đóng bài đang mở xem nhanh. Khối Bài viết xem nhiều ở cột phải tách thành truy vấn riêng lấy 3 bài mới nhất một lần, để nội dung cột phải không đổi theo trang đang xem, đúng hành vi hiện nay.

## Ngoài phạm vi

Liên kết danh mục ở cột phải trỏ tới /tin-tuc?cat=... nhưng trang chưa lọc theo tham số này; ghi nhận vào progress.md thành đề xuất riêng, không sửa trong WO này. Tiêu đề Bài viết xem nhiều vẫn giữ nguyên như hiện tại.
