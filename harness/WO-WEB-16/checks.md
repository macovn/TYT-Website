# WO-WEB-16: Bảng kiểm chứng

| # | Tiêu chí | Trạng thái | Bằng chứng |
|---|----------|-----------|-----------|
| 1 | Rà soát mã nguồn: thang ba bước đúng thiết kế, không tồn tại cắt cơ học ở bất kỳ dạng nào; miễn trừ câu trả lời xác định; chốt số điện thoại quét trên văn bản cuối cùng | pass | Thang đặt sau chuỗi nhà cung cấp và trước chốt số điện thoại, nên chốt luôn quét văn bản cuối; miễn trừ provider error và thông điệp dự phòng; không có bất kỳ thao tác cắt chuỗi nào trong diff |
| 2 | Kiểm thử ngoại tuyến hàm thuần: đếm từ, trích dãy số, đếm dòng liệt kê, kiểm tra bảo toàn đủ năm tình huống | pass | Bộ kiểm thử trích xuất từ chính mã nguồn route: 9/9 đạt (đếm từ, trích đúng hai số Trạm và bỏ qua ngày tháng cùng số quyết định, đếm dòng liệt kê, bảo toàn đạt khi đủ nội dung, trượt khi thiếu số, thiếu dòng liệt kê, thiếu dấu hiệu nguy hiểm hoặc bản viết lại rỗng) |
| 3 | Kiểm tra type độc lập và build sạch đạt | pass | tsc sạch; build sạch đạt ngay lượt đầu |
| 4 | T30 live: danh mục vắc xin nguyên vẹn, số điện thoại và hành động tiếp theo còn nguyên | pending | Chờ merge và triển khai |
| 5 | T40 live: đầu ra giữ đủ dấu hiệu nguy hiểm và cả hai số, kết thúc câu hoàn chỉnh; vượt trần thì có cờ trong nhật ký | pending | Chờ merge và triển khai |
| 6 | Ca kích hoạt thang live: liệt kê đủ nhóm A, B, C cho thấy rút gọn đạt bảo toàn hoặc giữ gốc kèm cờ vượt trần, không đứt câu | pending | Chờ merge và triển khai |
| 7 | Hồi quy Production: 9 cách hỏi vắc xin 9/9; T08, T24, T41 giữ nguyên; độ trễ không tăng bất thường ở ca thường | pending | Chờ merge và triển khai |
