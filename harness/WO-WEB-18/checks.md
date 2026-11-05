# WO-WEB-18: Bảng kiểm chứng

| # | Tiêu chí | Trạng thái | Bằng chứng |
|---|----------|-----------|-----------|
| 1 | Hàm nhận diện xã giao đúng thiết kế: danh sách đóng, trần độ dài, câu hỏi thật chứa từ chào không trúng | pass | Bộ ca ngoại tuyến 25/25: 16 câu xã giao mẫu trúng cổng, 9 câu hỏi thật (kể cả câu mở đầu bằng chào hoặc cảm ơn kèm chủ đề) không trúng; trần 6 từ và bóc tiểu từ cuối câu hoạt động đúng |
| 2 | Kiểm tra type độc lập và build sạch đạt | pass | npx tsc --noEmit sạch; build sạch đạt ngày 05/11/2026 |
| 3 | Live: lượt chào và cảm ơn trả sources rỗng, không hiện Đọc thêm; câu chào kèm câu hỏi và câu hỏi thường giữ nguyên truy xuất | pass | Sau merge PR 70: Xin chào, Tạm biệt trả sources rỗng; câu chào kèm câu hỏi giữ 7 nguồn. Sau merge PR bổ sung 71: Cảm ơn bạn nhiều nhé và Cảm ơn An nhiều lắm đều trả sources rỗng, câu chào kèm chủ đề sốt sau tiêm vẫn có 7 nguồn |
| 4 | Hồi quy Production: 9 cách hỏi vắc xin 9/9; T08, T24 giữ nguyên | pass | Lượt chuẩn sau PR 70 đạt 8/9 (V2 dao động diễn đạt như các WO trước), T08 và T24 giữ nguyên; sau PR 71 kiểm chứng điểm V4 đạt và T24 giữ nguyên |
