# WO-WEB-03 — Progress

## Trạng thái
- ĐÃ XONG phần code + kiểm chứng local (27/10/2026). Đang chờ gộp PR và kiểm chứng live (C7).

## Đã làm
- globals.css: hệ token mới (primary #0C6B58, dark #084C3E, đỏ khẩn cấp #B42318, ink #17201C), bỏ mọi gradient trong file, bóng đổ gần như không còn, bo góc 8/10px, thân 17px/1.65, header bỏ shadow thành viền mảnh, section-tag bỏ dạng pill, thẻ bỏ hiệu ứng nhảy khi hover, quick-access thành dải sáng phẳng có viền, badge cấp cứu đỏ phẳng, prose headings bỏ Playfair.
- tailwind.config.js: font serif trỏ về Be Vietnam Pro (tiêu đề toàn site hết dùng Playfair).
- TopBar: số điện thoại đậm và bấm gọi được, badge cấp cứu là tel link màu đỏ phẳng, bỏ chấm pulse.
- Header: chữ menu 13.5 -> 14.5px, bo góc nhỏ hơn.
- Hero viết lại: nền sáng phẳng, tiêu đề sentence case, 2 nút (Xem dịch vụ / Gọi trạm), cột phải là bảng Giờ làm việc có trạng thái Đang mở cửa tự tính theo giờ máy người xem, lịch tiêm 18/24/25, số trực cấp cứu 26px đỏ bấm gọi được. Cụm số liệu hero đã bỏ khỏi trang chủ (vẫn còn nguyên trong trang Giới thiệu).
- AnnouncementTicker: bỏ marquee chạy chữ, hiện tĩnh tối đa 2 thông báo + link Xem tất cả.
- ServicesSection: thêm dòng lịch từng dịch vụ (dữ liệu schedule đã có sẵn nhưng trước đây không hiển thị), bỏ hiệu ứng đổi màu icon khi hover.
- NewsSection + trang chủ: placeholder ảnh và avatar đội ngũ thành nền phẳng primary-light; thẻ đội ngũ bỏ hover nâng.
- Footer: nền xanh đậm phẳng #084C3E, dùng logo chính thức logo-tram.svg thay ô icon PlusCircle, icon màu mint nhạt.

## Kiểm chứng
- tsc 0 lỗi; build đạt 25/25 trang tĩnh; C1-C6 pass (xem checks.md).

## Ngoài phạm vi, đề xuất đợt sau
- Các trang con (dich-vu, gioi-thieu, tin-tuc...) vẫn còn dải tiêu đề dạng gradient xanh (nay tự chuyển sang tông xanh lá theo token mới); muốn đồng bộ phẳng toàn site cần một WO riêng quét các trang con.
- Chưa có ảnh thật của Trạm để đặt vào hero; khi Maco có ảnh chụp Trạm, bổ sung vào cột phải hero hoặc thay nền hero.
- Font Playfair vẫn được tải ở layout (biến --font-playfair) dù không còn dùng cho tiêu đề; dọn ở đợt sau nếu cần giảm tải trang.

## Quyết định
- --accent được gán lại bằng chính màu primary (xanh lá) để toàn bộ điểm nhấn phụ trong các trang con tự đồng bộ; màu vàng cũ bị loại. Riêng phần tử khẩn cấp dùng --red tường minh.
