# WO-WEB-18: Bảng kiểm chứng

| # | Tiêu chí | Trạng thái | Bằng chứng |
|---|----------|-----------|-----------|
| 1 | Hàm nhận diện xã giao đúng thiết kế: danh sách đóng, trần độ dài, câu hỏi thật chứa từ chào không trúng | pass | Bộ ca ngoại tuyến 25/25: 16 câu xã giao mẫu trúng cổng, 9 câu hỏi thật (kể cả câu mở đầu bằng chào hoặc cảm ơn kèm chủ đề) không trúng; trần 6 từ và bóc tiểu từ cuối câu hoạt động đúng |
| 2 | Kiểm tra type độc lập và build sạch đạt | pass | npx tsc --noEmit sạch; build sạch đạt ngày 05/11/2026 |
| 3 | Live: lượt chào và cảm ơn trả sources rỗng, không hiện Đọc thêm; câu chào kèm câu hỏi và câu hỏi thường giữ nguyên truy xuất | pending | Chờ triển khai |
| 4 | Hồi quy Production: 9 cách hỏi vắc xin 9/9; T08, T24 giữ nguyên | pending | Chờ triển khai |
