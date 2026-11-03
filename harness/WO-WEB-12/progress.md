# WO-WEB-12: Tiến độ

## Ngày 03/11/2026 (Marley)

- Nhận Chỉ đạo phê duyệt và triển khai Bot An V1.1: thứ tự mới 12, 15A, 14, 13, 15D, 15B, 16, 15C; mỗi WO một nhánh, một PR, một hồ sơ; merge vào nhánh chính và triển khai Production phải có xác nhận riêng của Maco cho từng WO.
- Đo mốc nền độ trễ trước thay đổi trên Production hiện hành (đường DeepSeek, câu hỏi lịch tiêm): 6,13 giây; 4,20 giây; 3,40 giây.
- Đối chiếu lịch thật phục vụ kiểm chứng: 03/11/2026 là Thứ Ba; các đợt tháng 11/2026 là 18 (Thứ Tư), 24 (Thứ Ba), 25 (Thứ Tư); 24/10/2026 là Thứ 7 và 25/10/2026 là Chủ nhật (dùng cho kiểm tra loại trừ cuối tuần).
- Hai tệp nguồn tại máy làm việc khớp từng byte với nhánh chính (mã băm blob 8d48f656 cho bot-knowledge.ts và 447cb517 cho route.ts), đủ điều kiện làm nền chỉnh sửa.
- Đã triển khai xong phần code trên nhánh dot-2/wo-web-12-nen-thoi-gian: hàm buildScheduleLines (tính ngày hiện tại theo Asia/Bangkok và ba đợt dự kiến, loại trừ cuối tuần), mục prompt THỜI GIAN HIỆN TẠI VÀ LỊCH TIÊM DỰ KIẾN kèm kỷ luật khẳng định ba loại ngày, lời gọi truyền tham số tại POST handler.
- Kiểm chứng trước gộp: build đạt; hàm tính lịch trích nguyên văn chạy kiểm tra 5 mốc neo đạt toàn bộ; rà soát diff xác nhận phạm vi thay đổi đúng kế hoạch.
- Trạng thái: chờ Maco xác nhận merge theo Mục V của Chỉ đạo. Các hạng mục kiểm chứng trên hệ thống thật (checks.md mục 5 đến 10) sẽ chạy ngay sau khi merge và triển khai.
