# WO-WEB-15C: Bảng kiểm chứng

| # | Tiêu chí | Trạng thái | Bằng chứng |
|---|----------|-----------|-----------|
| 1 | Rà soát mã nguồn và SQL: đúng đặc tả Mục 4 và đủ sáu điểm rà soát an toàn Mục II.3 tại plan.md | pass | Route kiểm tra UUID bằng biểu thức chính quy, sai thì sinh mã thay thế; logChat thử v2 trước, lỗi lùi v1; widget sinh mã ở lần mở đầu, giữ trong ref. SQL khớp sáu điểm rà soát Mục II.3 (chi tiết tại plan.md) |
| 2 | Kiểm tra type độc lập và build sạch đạt (route và widget) | pass | tsc sạch; build sạch đạt |
| 3 | Migration chạy thành công trên Supabase: hai cột mới, bảng chat_conversations, ràng buộc duy nhất, hàm log_chat_v2 với search_path ghim và EXECUTE chỉ cho anon; log_chat cũ còn nguyên | pass | Migration chạy trước merge ngày 04/11/2026: chat_logs có đủ 7 cột, chat_conversations bật RLS, hai lượt gọi thử trả số lượt 1 rồi 2 và ghi đúng hai hàng (đã xóa dữ liệu thử và đối chiếu còn 0). Quyền EXECUTE của log_chat_v2 sau siết chặt chỉ còn anon và chủ sở hữu postgres (Supabase mặc định cấp thêm cho authenticated và service_role khi tạo hàm, đã thu hồi tường minh). log_chat v1 còn nguyên, kể cả bộ quyền mặc định rộng hơn của nó, ghi nhận là hiện trạng có từ trước ngoài phạm vi WO |
| 4 | T42a: hội thoại nhiều lượt ghi cùng conversation_id, turn_index tăng dần đúng thứ tự | pending | Chờ triển khai và đối chiếu cơ sở dữ liệu |
| 5 | T42b: hai yêu cầu đồng thời cùng mã nhận hai số lượt khác nhau, không lỗi | pending | Chờ triển khai |
| 6 | T42c: conversation_id sai định dạng hoặc thiếu vẫn trả lời bình thường, nhật ký mang mã máy chủ sinh | pending | Chờ triển khai |
| 7 | T42d: khi log_chat_v2 lỗi, route lùi về log_chat v1 và vẫn trả lời | pending | Chờ triển khai |
| 8 | Hồi quy Production: 9 cách hỏi vắc xin 9/9; T08, T24, T41 giữ nguyên; độ trễ không tăng bất thường | pending | Chờ triển khai |
