# WO-WEB-15C: Mã hội thoại và ghi nhật ký phiên bản 2

- Nguồn lệnh: Chỉ đạo phê duyệt và triển khai Bot An V1.1 của Maco ngày 03/11/2026 (Maco xác nhận triển khai riêng WO này lúc 06:28 ngày 04/11/2026).
- Xử lý phần kỹ thuật của phát hiện F10 (nhật ký chỉ lưu lượt cuối, không tái dựng được hội thoại) theo đặc tả tại Mục 4 Báo cáo chỉnh lý. Mọi thay đổi về thời hạn lưu trữ, xóa dữ liệu và dòng minh bạch KHÔNG nằm trong WO này, là quyết định riêng của Maco.
- Nhánh: dot-2/wo-web-15c-ma-hoi-thoai (từ main sau WO-WEB-16).

## Thiết kế

1. Widget (SupportChat.tsx): sinh mã hội thoại bằng crypto.randomUUID() tại lần mở khung trò chuyện đầu tiên, giữ trong ref của thẻ đang mở, không lưu vào bộ nhớ trình duyệt; tải lại trang là hội thoại mới. Mỗi lượt gọi gửi kèm trường conversation_id.
2. Route: kiểm tra định dạng UUID của conversation_id; thiếu hoặc sai định dạng thì máy chủ tự sinh mã thay thế cho riêng lượt đó, không bao giờ từ chối trả lời vì lý do mã. Ghi nhật ký qua log_chat_v2 trước; hàm lỗi thì tự lùi về log_chat hiện hành.
3. Cơ sở dữ liệu (cộng thêm thuần túy, file sql/wo-web-15c-log-v2.sql): hai cột mới conversation_id và turn_index (cho phép rỗng) trong chat_logs; bảng mới chat_conversations chỉ gồm mã, thời điểm tạo và số lượt cuối, không chứa nội dung hay định danh; ràng buộc duy nhất trên cặp (conversation_id, turn_index); hàm mới log_chat_v2. Hàm log_chat hiện hành giữ nguyên.

## Rà soát an toàn SECURITY DEFINER (Mục II.3 của Chỉ đạo)

- search_path: hàm đặt SET search_path = public và mọi tham chiếu đối tượng trong thân hàm đều viết đầy đủ kèm tên lược đồ public, nên không thể bị che khuất bởi lược đồ tạm hay lược đồ người dùng.
- Quyền EXECUTE: thu hồi toàn bộ từ PUBLIC, chỉ cấp cho khóa anon, đúng tư thế của log_chat hiện hành. Hàm không trả về dữ liệu hội thoại nào, chỉ trả số thứ tự lượt.
- Nguyên tử và đồng thời: toàn bộ thao tác nằm trong một hàm, tức một giao dịch. Số lượt lấy bằng một câu lệnh chèn hoặc cộng (upsert) nguyên tử trên hàng đếm của chính hội thoại đó; hai yêu cầu đồng thời cùng mã bị khóa hàng nối tiếp nhau nên nhận hai số khác nhau, không trùng, không mất hàng. Ràng buộc duy nhất trên chat_logs là chốt chặn cuối; lỗi ở bước ghi sẽ kéo lùi cả bước đếm.
- Không tin phía gọi: chữ ký hàm không có tham số số lượt; số lượt do máy chủ tự tính. Hàm tự cắt độ dài đầu vào (câu hỏi 1.000 ký tự, khớp trần của log_chat v1 và trần cắt sẵn của route; câu trả lời 8.000; nhà cung cấp 120 vì provider nay mang hậu tố cờ dài hơn trần 32 của v1) và trả về rỗng khi mã hội thoại rỗng. Tên cột và định nghĩa v1 đã đối chiếu trực tiếp trên cơ sở dữ liệu ngày 04/11/2026 trước khi chốt SQL.
- RLS: chat_conversations bật RLS và không có policy công khai nào, giống tư thế hiện nay của chat_logs; đọc dữ liệu chỉ qua vai trò service role và tài khoản quản trị dự án.
- Lùi dự phòng: route gọi v2 trước, lỗi thì gọi v1; việc ghi nhật ký không bao giờ làm hỏng câu trả lời kể cả khi cả hai hàm cùng lỗi (giữ nguyên cơ chế nuốt lỗi có dấu vết hiện hành).

## Tiêu chí đạt (T42 là ca chính)

- Sau triển khai, một hội thoại nhiều lượt trên website tạo các hàng nhật ký mang cùng conversation_id với turn_index tăng dần 1, 2, 3 đúng thứ tự; đối chiếu trực tiếp trong cơ sở dữ liệu.
- Hai yêu cầu gửi gần như đồng thời cùng một mã hội thoại nhận hai số lượt khác nhau, không lỗi ràng buộc.
- conversation_id sai định dạng hoặc bị thiếu: câu trả lời vẫn bình thường, hàng nhật ký mang mã do máy chủ sinh.
- Ép log_chat_v2 lỗi (gọi với mã đã bị khóa thử nghiệm hoặc tạm thu hồi quyền ở môi trường kiểm chứng) thì route vẫn trả lời và hàng nhật ký xuất hiện qua log_chat v1.
- Hồi quy bắt buộc: 9 cách hỏi vắc xin, T08, T24, T41, độ trễ; kiểm tra type và build sạch (gồm cả phía widget).

## Thứ tự thực hiện và quay lui

Chạy migration TRƯỚC khi merge mã nguồn (hàm v2 phải tồn tại khi route mới chạy; chiều ngược lại cũng an toàn nhờ lùi dự phòng). Quay lui ở tầng route và widget bằng revert commit gộp; các cột và bảng đã cộng thêm giữ nguyên trạng thái không dùng tới, không cần xóa. Trước khi viết SQL cuối cùng phải đọc định nghĩa log_chat hiện hành và danh sách cột của chat_logs để khớp tên cột thật.

## Ngoài phạm vi

Không thay đổi chính sách lưu trữ hay xóa nhật ký; không thêm bất kỳ định danh người dùng nào vào nhật ký; không thay đổi prompt, truy xuất, bộ lọc, chốt đầu ra hay thang độ dài.
