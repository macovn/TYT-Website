# WO-WEB-22 — Progress

- Căn cứ: sáng 12/11/2026 Maco khoanh hai vị trí trùng thông tin buổi tiêm trên cùng Hero và hỏi có cần thiết hiện hai nơi không; anh chốt bỏ ngày tiêm khỏi dòng trạng thái, giữ ở thẻ Tiêm chủng (06:49).
- Nhánh: dot-2/wo-web-22-bo-trung-hero (từ main c4eea56d, sau đóng WO-WEB-21).
- Đã làm (chỉ src/components/Hero.tsx): dòng trạng thái dưới hai nút chỉ còn vế tình trạng mở cửa hôm nay; khối Tiêm chủng mở rộng giữ nguyên bản WO-WEB-21.
- Kiểm chứng: grep sau sửa đúng kỳ vọng (cụm dòng trạng thái 0, cụm thẻ 1); tsc sạch, build sạch (T1, T2 pass). T3 chạy trên Preview của PR.
- ĐÃ ĐÓNG 12/11/2026: Maco chốt gộp 07:26; PR #79 gộp vào main (213c5885); deployment Production thành công; kiểm chứng trực tiếp tramytecaibau.com lúc 07:32 ngay lần tải đầu: dòng trạng thái chỉ còn câu Đang mở cửa, đến 16:30 kèm chấm xanh, không còn ngày tiêm; ngày tiêm dự kiến chỉ còn ở khối Tiêm chủng mở rộng; giờ làm việc và số cấp cứu nguyên vẹn. Hồ sơ đóng bằng PR giấy tờ riêng như thông lệ.
