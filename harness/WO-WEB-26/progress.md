# WO-WEB-26 — Progress

- Lệnh: Maco, 17/11/2026 (kèm ảnh chụp khối Đọc thêm): phần đọc thêm không liên quan, chỉ để các bài viết liên quan đến nội dung câu hỏi trên Website.
- Đã làm: PR #86 (nhánh dot-2/wo-web-26-doc-them-bai-viet), thay đổi 2 file:
  - src/app/api/chat/route.ts: sources trả về chỉ gồm bài viết đủ điều kiện hiển thị (điểm >= 6, tiêu đề khớp ít nhất 1 âm tiết chủ đề không phải số thuần, loại bài nhắc tháng khác với tháng trong câu hỏi). Đoạn kho tri thức/văn bản pháp luật chỉ còn là ngữ cảnh nội bộ; ngữ cảnh đưa vào mô hình không đổi.
  - src/components/SupportChat.tsx: bỏ nhánh hiển thị "Căn cứ: ...", mọi mục Đọc thêm đều là liên kết bài viết.
- Kiểm chứng: T1, T2 đạt; T3 mô phỏng ngoại tuyến trên 300 bài viết thật đạt (tái hiện đúng lỗi theo luật cũ, đúng theo luật mới); T4 Preview bị chặn vì khóa AI chỉ đặt cho Production (đã ghi rõ trong checks.md); T5 Production đạt sau gộp (xem checks.md). Lần gộp đầu bị hết hạn thẻ phê duyệt của công cụ, đã kiểm tra PR chưa gộp rồi mới gộp lại thành công (commit df54ce76).
- Kết quả: ĐÓNG WO-WEB-26 ngày 17/11/2026. Giới hạn còn lại đã công khai: độ liên quan bài viết ở mức chủ đề, chưa theo đúng khía cạnh câu hỏi (ví dụ câu miễn phí dẫn bài lịch tiêm chủng mở rộng); xử lý sâu hơn cần WO riêng nếu Maco yêu cầu.
