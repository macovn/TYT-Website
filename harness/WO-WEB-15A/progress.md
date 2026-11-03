# WO-WEB-15A: Tiến độ

## Ngày 03/11/2026 (Marley)

- Maco xác nhận triển khai WO-WEB-15A lúc 10:27, sau khi WO-WEB-12 đóng.
- Thống kê kho đang vận hành: 309 đoạn, 162 đoạn dài hơn 900 ký tự, đoạn dài nhất 1.458 ký tự; trần mới 1.500 ký tự bảo đảm không đoạn nào bị cắt trong thực tế.
- Chốt câu hỏi kiểm chứng T17: "Các trường hợp phản vệ phải được báo cáo về đâu ạ?" Mô phỏng ngoại tuyến xác nhận đoạn Điều 4 Thông tư 51/2017 được chọn vào ngữ cảnh; khoản 4 chứa đích báo cáo nằm trọn ở phần đuôi bị cắt. Kiểm chứng live trước thay đổi xác nhận Bot bỏ sót đích báo cáo này và trả lời bằng chế độ báo cáo của Thông tư 13/2026.
- Đã sửa route.ts: trần đoạn tri thức 900 lên 1.500 ký tự kèm chú thích WO. Build đạt; rà soát diff xác nhận phạm vi đúng một điểm thay đổi.
- Maco xác nhận merge lúc 10:30 ngày 03/11/2026. PR 46 đã gộp vào main (commit gộp 0787e4f2ec7fdc0140045512d9a1b2dd8fefc4d7), triển khai lên sóng sau khoảng 4 lượt thăm dò.
- Kiểm chứng live sau triển khai: toàn bộ checks.md mục 5 đến 7 đạt. T17 trả đúng đích báo cáo tại khoản 4 Điều 4 Thông tư 51/2017 (trước thay đổi bị bỏ sót hoàn toàn); hồi quy 9/9 vắc xin và các ca hành vi giữ nguyên; độ trễ 3,54 đến 4,17 giây, không tăng.
- WO-WEB-15A ĐÓNG. WO tiếp theo theo thứ tự Chỉ đạo là WO-WEB-14 (bộ lọc cấp cứu hai tầng và máy trạng thái sự kiện), chờ Maco xác nhận bắt đầu.
