# WO-WEB-15C: Báo cáo hoàn thành

## Phạm vi đã làm

Ba tầng theo đặc tả Mục 4 của Báo cáo chỉnh lý, kèm rà soát an toàn Mục II.3. Migration cơ sở dữ liệu chạy TRƯỚC khi merge mã nguồn: chat_logs thêm hai cột conversation_id và turn_index, bảng mới chat_conversations bật RLS không policy công khai, ràng buộc duy nhất trên cặp mã và số lượt, hàm log_chat_v2 với search_path ghim. Widget sinh mã hội thoại bằng crypto.randomUUID() ở lần mở khung đầu tiên, chỉ giữ trong thẻ đang mở. Route kiểm tra định dạng UUID, sai thì tự sinh mã thay thế cho lượt đó, ghi nhật ký qua v2 trước và lùi về v1 khi lỗi. PR 64 gộp tại cf05df6c.

## Kết quả kiểm chứng

- T42a đạt: hội thoại kiểm thử 3 lượt ghi turn_index 1, 2, 3 đúng thứ tự dưới cùng một mã.
- T42b đạt: hai yêu cầu đồng thời cùng mã nhận hai số lượt phân biệt, không lỗi ràng buộc.
- T42c đạt: mã sai định dạng và lượt thiếu mã đều được trả lời bình thường, nhật ký mang hai UUID khác nhau do máy chủ sinh.
- T42d đạt ở tầng mã: nhánh lùi dùng đúng lời gọi v1 mà Production đã chạy trước đó; không ép lỗi v2 trên dữ liệu thật.
- Kiểm chứng migration độc lập: hai lượt gọi thử hàm v2 trước triển khai trả số lượt 1 rồi 2, dữ liệu thử đã xóa và đối chiếu còn 0.
- Rà soát quyền: Supabase cấp EXECUTE mặc định cho authenticated và service_role khi tạo hàm; đã thu hồi tường minh, trạng thái cuối chỉ còn anon và chủ sở hữu postgres. log_chat v1 còn nguyên bộ quyền mặc định rộng hơn, là hiện trạng có từ trước ngoài phạm vi WO.
- Hồi quy: T08, T24, T41 đạt; độ trễ không bất thường.

## Phát hiện ngoài phạm vi: lỗ hổng ở điều kiện ghim của WO-WEB-15D

Cổng 9 cách hỏi vắc xin đạt 7/9 tại lượt kiểm chứng của WO này. Truy vết bằng bộ mô phỏng truy xuất trung thực cho thấy nguyên nhân nằm ở điều kiện nhận diện ý định của cơ chế ghim tại PR 58: điều kiện chỉ khớp cụm đã bỏ dấu của từ miễn phí, nên các cách hỏi dùng không thu phí (V4) và có mất tiền không (V2) không kích hoạt ghim, và với hai cách hỏi này đoạn Điều 3 của Thông tư 13/2026 cũng không tự lọt nhóm chọn, thành thử kết quả phụ thuộc vào biến thiên của nhà cung cấp và thứ tự hòa điểm, lúc đạt lúc trượt; V4 trượt 4 mẫu liên tiếp tại lượt này và An trả lời chưa có dữ liệu danh mục. Đây là khiếm khuyết có từ khi PR 58 triển khai, không do thay đổi của WO-WEB-15C gây ra (WO này không đụng tới truy xuất). Phương án sửa đã trình Maco: một PR bổ sung chỉ mở rộng các cụm nhận diện ý định miễn phí (không thu phí, không mất tiền, có mất tiền, không tốn tiền), giữ nguyên phần còn lại, kiểm chứng bằng mô phỏng cho đủ 9 cách hỏi trước khi mở PR.

## Ngoài phạm vi còn nguyên

Chính sách thời hạn lưu trữ, xóa nhật ký và dòng minh bạch cho người dân vẫn là quyết định riêng của Maco, không nằm trong WO này. Hàng đợi tiếp theo theo chốt của Maco: WO sửa đường dự phòng (khóa OpenRouter, ghi lỗi chuỗi nhà cung cấp, ghép đủ phần trả lời của Gemini, chạy lại bộ ca của WO-WEB-15B), sau PR bổ sung sửa điều kiện ghim nếu được duyệt.
