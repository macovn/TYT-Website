# WO-WEB-17: Bảng kiểm chứng

| # | Tiêu chí | Trạng thái | Bằng chứng |
|---|----------|-----------|-----------|
| 1 | Ghi lỗi chuỗi có cấu trúc ở cả ba mắt xích và ở nhánh ép kiểm thử, hành vi rơi dự phòng không đổi | pass | Ba mắt xích đều có console.error mang tên nhà cung cấp và thông điệp lỗi; nhánh ép gắn hậu tố loi kèm mã trạng thái vào trường provider của nhật ký; thứ tự rơi dự phòng và thông điệp cuối không đổi |
| 2 | Đường Gemini ghép đủ các phần văn bản, ngân sách suy luận tường minh, trần đầu ra 1.536 | pass | Ba mắt xích đều có console.error mang tên nhà cung cấp và thông điệp lỗi; nhánh ép gắn hậu tố loi kèm mã trạng thái vào trường provider của nhật ký; thứ tự rơi dự phòng và thông điệp cuối không đổi |
| 3 | Kiểm tra type độc lập và build sạch đạt | pass | tsc sạch; build sạch đạt |
| 4 | Chẩn đoán OpenRouter xác định được mã lỗi chính xác qua bộ ca Preview | pending | Chờ chạy bộ ca |
| 5 | Bộ ca 15B chạy lại trên Preview: Gemini không còn cắt cụt; T18 đạt hoặc nêu rõ phần thuộc phía tài khoản | pending | Chờ chạy bộ ca |
| 6 | Dọn sạch thay đổi tạm thời trên Vercel sau bộ ca (khóa vòng qua, AN_TEST_TOKEN, phạm vi Preview của ba khóa) | pending | Chờ xác nhận sau bộ ca |
| 7 | Hồi quy Production sau merge: 9 cách hỏi vắc xin 9/9; T08, T24, T41 giữ nguyên; cơ chế ép bất hoạt; độ trễ không bất thường | pending | Chờ triển khai |
