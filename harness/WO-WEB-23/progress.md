# WO-WEB-23 — Progress

- Căn cứ: Maco lệnh 12/11/2026 07:37, khoanh dòng trạng thái dưới nút bấm trên ảnh Hero: bỏ hẳn hiển thị này đi. Sau WO-WEB-22 dòng này chỉ còn tình trạng mở cửa, trùng với nhãn Đang mở cửa ở đầu thẻ phải.
- Nhánh: dot-2/wo-web-23-bo-dong-trang-thai (từ main 07b4372c, sau đóng WO-WEB-22).
- Đã làm (chỉ src/components/Hero.tsx): xóa phần tử dòng trạng thái dưới hai nút bấm và các biến chỉ dùng cho nó (veMoCua, homNay, laNgayLamViec). Trạng thái mở cửa ở thẻ phải, lịch tiêm động và mọi nội dung khác giữ nguyên.
- Kiểm chứng: grep sau sửa đúng kỳ vọng; tsc sạch, build sạch (T1, T2 pass). T3 chạy trên Preview của PR.
- ĐÃ ĐÓNG 12/11/2026: Maco chốt gộp 07:48; PR #81 gộp vào main (2da7ff19); deployment Production thành công; kiểm chứng trực tiếp tramytecaibau.com lúc 07:51, cả lần tải đầu và sau tải lại: dưới hai nút bấm không còn dòng trạng thái, thẻ phải còn nhãn Đang mở cửa kèm chấm xanh, buổi tiêm dự kiến 18/11/2026, giờ 7:30-16:30 và số cấp cứu nguyên vẹn. Hồ sơ đóng bằng PR giấy tờ riêng như thông lệ.
