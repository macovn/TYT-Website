# WO-WEB-17: Sửa đường dự phòng của chuỗi nhà cung cấp

- Nguồn lệnh: Maco xác nhận triển khai ngày 04/11/2026, sau khi đợt V1.1 đóng toàn bộ và PR bổ sung 66 sửa khiếm khuyết ghim Điều 3 hoàn tất.
- Xử lý hai lỗi tích hợp thật phát hiện tại WO-WEB-15B: đường OpenRouter chết hoàn toàn ở mọi ca ép (12/12 ca AI lỗi) nhưng lỗi bị nuốt nên không thấy mã cụ thể; đường Gemini cắt cụt 9/12 câu trả lời.
- Nhánh: dot-2/wo-web-17-duong-du-phong (từ main sau PR 66).

## Ba thay đổi

1. Ghi lỗi chuỗi có cấu trúc: mọi mắt xích lỗi đều để lại dòng nhật ký máy chủ mang tên nhà cung cấp và thông điệp lỗi (ví dụ mã trạng thái HTTP). Ở chế độ ép kiểm thử của WO-WEB-15B, khi nhà cung cấp bị ép lỗi, hậu tố lỗi kèm mã trạng thái được gắn vào trường provider của nhật ký trò chuyện để đọc lại qua cơ sở dữ liệu; cơ chế này chỉ tồn tại trong nhánh ép vốn bất hoạt trên Production. Hành vi trả lời không đổi: vẫn rơi xuống mắt xích tiếp theo, cuối cùng là thông điệp dự phòng.
2. Đường Gemini: ghép toàn bộ các phần văn bản trong mảng parts thay vì chỉ đọc phần đầu tiên; đặt ngân sách suy luận tường minh 256 token và nâng trần đầu ra lên 1.536 token để phần suy luận không ăn hết ngân sách của câu trả lời. Thang độ dài của WO-WEB-16 vẫn kiểm soát độ dài cuối cùng nên trần đầu ra lớn hơn không làm câu trả lời dài hơn trước mặt người dân.
3. Đường OpenRouter theo kết quả chẩn đoán: nếu mã lỗi là 401 hoặc 402 thì nguyên nhân nằm ở khóa hoặc hạn mức tài khoản, phần sửa thuộc phía tài khoản (Maco nạp hạn mức hoặc cấp khóa mới trên openrouter.ai và cập nhật biến môi trường), WO này ghi rõ kết luận và bằng chứng; nếu lỗi thuộc loại khác (ví dụ mã mô hình) thì sửa ngay trong WO.

## Kiểm chứng

- Kiểm tra type độc lập và build sạch.
- Bộ ca đối sánh của WO-WEB-15B chạy lại trên Preview của nhánh (tái lập tạm thời phạm vi Preview cho ba khóa nhà cung cấp, AN_TEST_TOKEN và khóa vòng qua bảo vệ triển khai, dọn sạch sau khi chạy): tiêu chí là OpenRouter trả lời thật thay vì thông điệp dự phòng (trừ khi lỗi tài khoản chưa được xử lý phía Maco, khi đó tiêu chí là xác định được mã lỗi chính xác), Gemini không còn ca nào bị cắt cụt giữa chừng, T18 đạt ở mức tương đương DeepSeek.
- Sau merge: hồi quy Production gồm 9 cách hỏi vắc xin, T08, T24, T41 và độ trễ; cơ chế ép vẫn bất hoạt trên Production.

## Ngoài phạm vi

Không đổi thứ tự chuỗi, không đổi mô hình của DeepSeek và OpenRouter trừ khi chẩn đoán buộc phải đổi, không đổi prompt, truy xuất, bộ lọc khẩn cấp, chốt đầu ra, thang độ dài và cơ chế ghi nhật ký hội thoại.
