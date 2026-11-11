# WO-WEB-22 — Progress

- Căn cứ: sáng 12/11/2026 Maco khoanh hai vị trí trùng thông tin buổi tiêm trên cùng Hero và hỏi có cần thiết hiện hai nơi không; anh chốt bỏ ngày tiêm khỏi dòng trạng thái, giữ ở thẻ Tiêm chủng (06:49).
- Nhánh: dot-2/wo-web-22-bo-trung-hero (từ main c4eea56d, sau đóng WO-WEB-21).
- Đã làm (chỉ src/components/Hero.tsx): dòng trạng thái dưới hai nút chỉ còn vế tình trạng mở cửa hôm nay; khối Tiêm chủng mở rộng giữ nguyên bản WO-WEB-21.
- Kiểm chứng: grep sau sửa đúng kỳ vọng (cụm dòng trạng thái 0, cụm thẻ 1); tsc sạch, build sạch (T1, T2 pass). T3 chạy trên Preview của PR.
- Còn lại: chờ Maco xác nhận riêng để gộp; sau gộp kiểm chứng Production và đóng hồ sơ bằng PR giấy tờ.
