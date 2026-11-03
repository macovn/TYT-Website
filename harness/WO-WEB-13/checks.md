# WO-WEB-13: Bảng kiểm chứng

| # | Tiêu chí | Trạng thái | Bằng chứng |
|---|----------|-----------|-----------|
| 1 | Ngoại tuyến hàm trích xuất: T37 hai bé thành hai mục riêng đúng định danh và đúng tuổi | pass | Bộ kiểm thử node trên hàm trích từ route.ts: ca T37 cho đúng hai mục Bé lớn 5 tuổi và Bé nhỏ 2 tháng, kèm số lượt |
| 2 | Ngoại tuyến: T21 sửa giữa hội thoại và sửa trong cùng tin nhắn, giá trị sau thắng tuyệt đối; hai định danh khác nhau không đè nhau | pass | Cùng bộ kiểm thử: T21 dùng 5 tuổi; sửa trong cùng tin nhắn dùng 4 tuổi; sửa riêng bé nhỏ thành 3 tháng trong khi bé lớn giữ 5 tuổi. Vòng sửa 1: bổ sung cơ chế gắn giá trị trần sau dấu sửa đổi vào chủ thể đã nêu trước dấu đó, vì mẫu câu tự nhiên đặt chủ thể trước dấu sửa đổi |
| 3 | Ngoại tuyến âm tính: T23 không sinh mục tuổi trẻ em bằng 30; câu triệu chứng không sinh mục nào; tuổi người hỏi ghi tách loại người lớn | pass | Cùng bộ kiểm thử: T23 chỉ sinh mục Người hỏi 30 tuổi; câu sốt 39 độ không sinh mục nào; câu bệnh 2 tháng bị chặn bởi quy tắc loại trừ bệnh theo thời gian; tuổi của mẹ không bị gán cho người hỏi |
| 4 | Ngoại tuyến: trần cứng tối đa 6 mục, mỗi mục không quá 80 ký tự, mỗi mục có số thứ tự lượt; ca mơ hồ cùng tin nhắn không ghim mục tranh cãi; mốc tiêm và thai kỳ trích đúng | pass | Cùng bộ kiểm thử: tổng 26 trên 26 ca đạt, gồm trần 6 mục và 80 ký tự, ca mơ hồ hai bé không định danh bị loại cả hai, mốc tiêm giữ nguyên văn, thai kỳ gắn đúng chủ thể con dâu, trích xuất chạy đúng trên câu không dấu |
| 5 | Rà soát mã nguồn: không phát sinh đường ghi dữ liệu mới; logChat giữ nguyên trường; thông tin ghim không vào nhật ký; cửa sổ history là 10; công tắc PIN_FACTS_ENABLED hoạt động | pass | Diff chỉ gồm route.ts và bot-knowledge.ts; logChat giữ nguyên 1 định nghĩa và 3 điểm gọi như trước; thông tin ghim chỉ đi vào prompt; history cắt 10 tin; hằng số PIN_FACTS_ENABLED điều khiển cả trích xuất lẫn ngữ cảnh hóa truy vấn |
| 6 | Kiểm tra type độc lập và build sạch đạt (cổng rút kinh nghiệm từ WO-WEB-14) | pass | npx tsc --noEmit sạch; build sạch sau khi xóa .next đạt ngày 03/11/2026 |
| 7 | Live T01, T05, T20: tham chiếu cuối hội thoại dùng đúng thông tin đầu hội thoại, không chào lại, không hỏi lại thông tin đã có | pending | Chờ merge |
| 8 | Live T02: hỏi tiếp chi phí trả đúng căn cứ Điều 48 Nghị định 165/2026, không lặp phần lịch tiêm | pending | Chờ merge |
| 9 | Live T21, T22, T23: sửa tuổi dùng giá trị đã sửa; không áp tuổi bé sang bà bầu; không khẳng định bé 30 tuổi | pending | Chờ merge |
| 10 | Live T37, T38, T39: hỏi xen kẽ hai bé đúng từng bé; ba đối tượng không áp chéo; hội thoại mới hỏi lại như chưa biết | pending | Chờ merge |
| 11 | Hồi quy: 9 cách hỏi vắc xin 9/9; 10 ca WO-WEB-10; T08 và T24 của bộ lọc cấp cứu giữ nguyên; độ trễ không tăng bất thường | pending | Chờ merge |
