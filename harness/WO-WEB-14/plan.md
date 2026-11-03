# WO-WEB-14: Bộ lọc cấp cứu hai tầng và máy trạng thái nguy hiểm theo sự kiện

- Nguồn lệnh: Chỉ đạo phê duyệt và triển khai Bot An V1.1 của Maco ngày 03/11/2026, gồm yêu cầu riêng tại Mục II.1: chứng minh bộ lọc quét toàn bộ lịch sử người dùng cần thiết, không bị giới hạn bởi cửa sổ 6 hoặc 10 tin nhắn đưa vào AI; bảo đảm quản lý đúng trạng thái nguy hiểm theo từng sự kiện.
- Xử lý phát hiện F1 (dương tính giả với câu phủ định, thăm dò P1), F2 (bộ lọc chỉ quét tin nhắn cuối), F7 (giới hạn tần suất chạy trước bộ lọc và thông điệp 429 thiếu số trực cấp cứu), F8 (khớp từ khóa không chịu lỗi dấu) của Báo cáo kiểm toán V1.1, theo thiết kế tại Báo cáo bổ sung Mục 2 và Báo cáo chỉnh lý Mục 1.
- Nhánh: dot-2/wo-web-14-bo-loc-cap-cuu (từ main sau WO-WEB-15A).

## Thiết kế chốt (scanEmergency, hàm thuần xác định trong route.ts)

Đầu vào: toàn bộ tin nhắn người dùng của yêu cầu, lấy từ mảng messages gốc chưa cắt cửa sổ và chưa cắt ký tự. Đầu ra: một trong ba hành động: emergency (trả EMERGENCY_REPLY), facility-note (đi tiếp vào AI kèm ghi chú an toàn), none (đi tiếp bình thường).

1. Chuẩn hóa: mọi văn bản và mọi mẫu đều được gấp dấu tiếng Việt (bỏ dấu thanh và dấu phụ, đ thành d) và hạ chữ thường trước khi khớp, nên một mẫu duy nhất bao phủ cả dạng có dấu, không dấu và nửa dấu (xử lý F8, tình huống T13).
2. Tầng 1: 29 cụm từ khóa hiện hành trong EMERGENCY_KEYWORDS. Một vị trí khớp bị coi là đã phủ định khi và chỉ khi: trong cùng một phân đoạn câu (không vượt qua dấu chấm, phẩy, chấm phẩy, chấm hỏi, chấm than hoặc xuống dòng) có một dấu phủ định thuộc danh sách đóng (không, chưa; riêng "đâu có" chỉ công nhận khi đứng ở đầu phân đoạn câu) kết thúc cách vị trí khớp tối đa 10 ký tự, và giữa dấu phủ định với vị trí khớp không có từ đối lập "nhưng"; mẫu phủ định kép dạng "không phải ... không ..." được coi là khẳng định. Hai dạng "chẳng" và "có đâu" bị loại khỏi danh sách một cách có chủ đích vì trùng hình thức sau khi gấp dấu với từ thông thường ("chàng trai", "có dấu hiệu"), tránh âm tính giả; các trường hợp đó mặc định kích hoạt. Mọi trường hợp mơ hồ mặc định không phủ định, tức là vẫn kích hoạt.
3. Tầng 2, chốt sự kiện: danh sách đóng các mẫu bối cảnh (đập đầu, ngã, tai nạn, uống nhầm, bỏng, sau tiêm, tiêm về, chó cắn, rắn cắn, sốt ở trẻ sơ sinh...) làm một sự kiện được lên chốt; danh sách đóng các mẫu diễn biến xấu đi (nôn nhiều, lơ mơ, li bì, ngủ gà, ngủ rồi, gọi không tỉnh, khóc thét, bỏ bú, mệt lả, tím tái, khò khè, thở nhanh, sốt cao, nổi mẩn khắp người...) xuất hiện ở bất kỳ tin nhắn nào sau khi đã có bối cảnh, hoặc bối cảnh xuất hiện sau khi đã có diễn biến, đều hoàn tất bức tranh nguy hiểm.
4. Máy trạng thái chăm sóc: xử lý tuần tự theo thứ tự xuất hiện trong hội thoại. Dấu hiệu đang ở cơ sở y tế (danh sách đóng: đang ở bệnh viện, đang ở phòng cấp cứu, đang nằm viện...) đặt trạng thái facility; dấu hiệu đã khám và về theo dõi (đã đi khám, bác sĩ cho về...) đặt trạng thái home; dấu hiệu đã giải quyết (khỏe hẳn, đã xử lý xong...) đặt trạng thái resolved; một bối cảnh mới đặt lại trạng thái none cho sự kiện mới. Không trạng thái nào tự hết hạn theo số lượt hay chuyển chủ đề.
5. Quy tắc kích hoạt tại lượt hiện tại: chỉ xét tín hiệu nằm trong tin nhắn người dùng cuối cùng (từ khóa tầng 1 chưa bị phủ định; diễn biến xấu đi chưa bị phủ định khi đã có sự kiện lên chốt; hoặc bối cảnh mới hoàn tất bức tranh với diễn biến đã thấy trước đó). Nếu kích hoạt và trạng thái là facility thì không trả thông điệp gọi 115 mà đi vào AI kèm ghi chú hệ thống yêu cầu hướng dẫn báo ngay nhân viên y tế đang theo dõi; các trạng thái còn lại trả EMERGENCY_REPLY. Lượt hỏi bình thường sau khi sự kiện đã được đánh giá không bị kích hoạt lại bởi tín hiệu cũ trong lịch sử.
6. Thứ tự trong POST: bộ lọc chạy trên toàn bộ lịch sử người dùng và chạy trước kiểm tra giới hạn tần suất (xử lý F7, tình huống T19); thông điệp 429 được bổ sung số trực cấp cứu 0203.3822.115 và số 115.
7. Prompt bot-knowledge.ts cộng hai quy tắc: tiếp nhận đúng thông tin phủ định triệu chứng và nêu dấu hiệu cần theo dõi; chú ý dấu hiệu nguy hiểm tích lũy qua nhiều lượt và xử lý theo nhánh khẩn cấp. Đây là tuyến AI hỗ trợ cho các lượt theo sau không chứa tín hiệu (ví dụ "em phải làm sao ạ?").

## Chứng minh yêu cầu Mục II.1 (quét toàn bộ lịch sử)

- Bằng cấu trúc mã: scanEmergency nhận mảng tin nhắn người dùng trích từ body.messages gốc; cửa sổ 6 tin nhắn (history) chỉ dùng cho lời gọi AI và không liên quan tới bộ lọc.
- Bằng kiểm thử ngoại tuyến: ca hội thoại 14 tin nhắn, bối cảnh ở tin nhắn 1, tám tin nhắn bình thường xen giữa, diễn biến ở tin nhắn cuối, vẫn kích hoạt; ca này nằm ngoài mọi cửa sổ 6 và 10 tin nhắn.
- Bằng kiểm chứng live sau merge: chạy lại ca T24 và ca khoảng cách dài trên Production.

## Ngoài phạm vi

Không thay đổi EMERGENCY_REPLY, danh sách 29 từ khóa nền (chỉ gấp dấu khi khớp), thuật toán truy xuất, dữ liệu kho, quy trình tư vấn 5 bước (chỉ cộng hai quy tắc prompt nêu trên). T11 (đồng nghĩa nguy hiểm) vẫn do tuyến AI đảm nhiệm như đặc tả đã duyệt; WO này không cam kết tầng xác định bắt được đồng nghĩa ngoài danh sách.

## Điều kiện dừng cứng

T27 thiếu một mẫu trong 29 mẫu nền là toàn bộ WO không đạt: dừng, không trình merge, báo cáo nguyên nhân. Mọi ca trong bộ kiểm thử ngoại tuyến của WO phải đạt trước khi mở PR.

## Phương án quay lui

Revert commit gộp của PR WO-WEB-14, khôi phục nguyên trạng bộ lọc một tầng hiện hành. Không có thay đổi dữ liệu.
