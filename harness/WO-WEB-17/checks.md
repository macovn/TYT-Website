# WO-WEB-17: Bảng kiểm chứng

| # | Tiêu chí | Trạng thái | Bằng chứng |
|---|----------|-----------|-----------|
| 1 | Ghi lỗi chuỗi có cấu trúc ở cả ba mắt xích và ở nhánh ép kiểm thử, hành vi rơi dự phòng không đổi | pass | Ba mắt xích đều có console.error mang tên nhà cung cấp và thông điệp lỗi; nhánh ép gắn hậu tố loi kèm mã trạng thái vào trường provider của nhật ký; thứ tự rơi dự phòng và thông điệp cuối không đổi |
| 2 | Đường Gemini ghép đủ các phần văn bản, ngân sách suy luận tường minh, trần đầu ra 1.536 | pass | Ba mắt xích đều có console.error mang tên nhà cung cấp và thông điệp lỗi; nhánh ép gắn hậu tố loi kèm mã trạng thái vào trường provider của nhật ký; thứ tự rơi dự phòng và thông điệp cuối không đổi |
| 3 | Kiểm tra type độc lập và build sạch đạt | pass | tsc sạch; build sạch đạt |
| 4 | Chẩn đoán OpenRouter xác định được mã lỗi chính xác qua bộ ca Preview | pass | Mọi ca ép OpenRouter đều trả provider kèm hậu tố loi:401, đối chiếu cả trong nhật ký cơ sở dữ liệu; kết luận khóa OPENROUTER_API_KEY không còn hiệu lực, phần sửa thuộc phía tài khoản của Maco |
| 5 | Bộ ca 15B chạy lại trên Preview: Gemini không còn cắt cụt; T18 đạt hoặc nêu rõ phần thuộc phía tài khoản | pass một phần theo thiết kế | Gemini đạt 12/12 câu trả lời trọn vẹn không cắt cụt (bộ ca cộng lượt chạy lại ba ca dính 503 tạm thời của nhà cung cấp), T11 và T12 leo thang đúng và đủ, đạt tương đương DeepSeek. OpenRouter chưa thể đạt vì khóa chết 401, chờ thay khóa phía tài khoản rồi kiểm chứng lại |
| 6 | Dọn sạch thay đổi tạm thời trên Vercel sau bộ ca (khóa vòng qua, AN_TEST_TOKEN, phạm vi Preview của ba khóa) | pass | Đã xóa khóa vòng qua bảo vệ triển khai, xóa AN_TEST_TOKEN, đưa cả ba khóa nhà cung cấp về chỉ Production; xác nhận trực tiếp trên Vercel ngày 05/11/2026 |
| 7 | Hồi quy Production sau merge: 9 cách hỏi vắc xin 9/9; T08, T24, T41 giữ nguyên; cơ chế ép bất hoạt; độ trễ không bất thường | pending | Chờ triển khai |
