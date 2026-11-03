# WO-WEB-15A: Tiến độ

## Ngày 03/11/2026 (Marley)

- Maco xác nhận triển khai WO-WEB-15A lúc 10:27, sau khi WO-WEB-12 đóng.
- Thống kê kho đang vận hành: 309 đoạn, 162 đoạn dài hơn 900 ký tự, đoạn dài nhất 1.458 ký tự; trần mới 1.500 ký tự bảo đảm không đoạn nào bị cắt trong thực tế.
- Chốt câu hỏi kiểm chứng T17: "Các trường hợp phản vệ phải được báo cáo về đâu ạ?" Mô phỏng ngoại tuyến xác nhận đoạn Điều 4 Thông tư 51/2017 được chọn vào ngữ cảnh; khoản 4 chứa đích báo cáo nằm trọn ở phần đuôi bị cắt. Kiểm chứng live trước thay đổi xác nhận Bot bỏ sót đích báo cáo này và trả lời bằng chế độ báo cáo của Thông tư 13/2026.
- Đã sửa route.ts: trần đoạn tri thức 900 lên 1.500 ký tự kèm chú thích WO. Build đạt; rà soát diff xác nhận phạm vi đúng một điểm thay đổi.
- Trạng thái: chờ Maco xác nhận merge theo Mục V của Chỉ đạo. Kiểm chứng live sau triển khai (checks.md mục 5 đến 7) chạy ngay sau khi merge.
