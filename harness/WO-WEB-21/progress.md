# WO-WEB-21 — Progress

- Căn cứ: Maco chọn phương án thêm dòng trạng thái sống và lịch tiêm động vào Hero (11/11/2026 20:37) sau nghiên cứu nhu cầu người dùng ở khu vực Hero; 20:38 Maco yêu cầu xem trước trên bản Preview rồi mới quyết định đẩy lên hay không, nên WO này dừng ở PR + Preview chờ anh chốt, tuyệt đối chưa gộp.
- Nhánh: dot-2/wo-web-21-trang-thai-hero (từ main 5f497bf8, sau đóng WO-WEB-20).
- Đã làm (chỉ src/components/Hero.tsx): thêm hàm tinhDotTiem dùng đúng thuật toán của Bot An (WO-WEB-12) theo giờ Asia/Bangkok; thêm dòng trạng thái sống dưới hai nút bấm ở cột trái; khối Tiêm chủng mở rộng ở thẻ phải chuyển sang hiện buổi tiêm dự kiến gần nhất kèm số ngày còn lại, dòng quy tắc lịch cố định giữ làm dòng phụ. Bố cục và nội dung cũ không đổi.
- Kiểm chứng: tsc sạch, build sạch; kiểm thử ngoại tuyến hàm ngày tiêm pass toàn bộ (T3). Preview PR #77 kiểm chứng bằng mắt 21:14 ngày 11/11/2026: dòng trạng thái và khối tiêm động hiển thị đúng, nội dung cũ nguyên vẹn (T4, T5 pass).
- ĐÃ ĐÓNG 11/11/2026: Maco xem Preview và chốt đẩy lên 21:25; PR #77 gộp vào main (73ea9cd0); deployment Production thành công; kiểm chứng trực tiếp tramytecaibau.com lúc 21:28: dòng trạng thái hiện đúng cả hai vế, khối Tiêm chủng hiện buổi dự kiến 18/11/2026 (lần tải đầu gặp bản cũ đang lan truyền, tải lại thì đúng bản mới). Hồ sơ đóng bằng PR giấy tờ riêng như thông lệ.
- Kỷ luật nội dung: ngày tiêm luôn gọi là DỰ KIẾN như Bot An; không loại ngày lễ vì không có dữ liệu lịch nghỉ; dòng phụ ghi ngày chính thức theo thông báo tháng của Trạm.
