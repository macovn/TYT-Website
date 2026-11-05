# WO-WEB-18: Cổng lượt xã giao, không truy xuất và không đính kèm Đọc thêm

- Nguồn lệnh: Maco duyệt ngày 05/11/2026 sau khi anh thử trực tiếp trên website và ảnh chụp cho thấy câu chào "Xin chào" cũng bị đính kèm khối Đọc thêm gồm năm căn cứ không liên quan.
- Nhánh: dot-2/wo-web-18-cong-xa-giao (từ main sau WO-WEB-17).

## Thiết kế

Nhận diện lượt xã giao bằng hàm xác định trên câu người dùng cuối cùng đã bỏ dấu, thuộc danh sách đóng: chào hỏi (xin chào, chào, hello, hi, chào bạn, chào trạm), cảm ơn (cảm ơn, cám ơn, thank), tạm biệt và xác nhận ngắn (tạm biệt, ok, được rồi, vâng, dạ) khi toàn bộ câu chỉ gồm các mẫu đó và độ dài không quá 6 từ. Câu có bất kỳ âm tiết chủ đề nào ngoài mẫu (ví dụ "chào bạn, cho hỏi lịch tiêm") không được coi là xã giao.

Khi trúng cổng: bỏ qua truy xuất tri thức và bài viết, ngữ cảnh để trống, và luôn trả sources rỗng để widget không hiện khối Đọc thêm. Phần còn lại giữ nguyên: bộ lọc khẩn cấp chạy trước cổng như hiện hành, lớp thông tin ghim, chuỗi nhà cung cấp, thang độ dài và chốt đầu ra không đổi. Prompt hệ thống giữ nguyên, mô hình chào đáp tự nhiên theo đúng kỷ luật hiện có.

## Kiểm chứng

- Bộ ca ngoại tuyến cho hàm nhận diện: các câu xã giao mẫu trúng cổng; các câu hỏi thật có chứa từ chào ở đầu không trúng; câu khẩn cấp không bị cổng chặn (bộ lọc chạy trước).
- Live sau triển khai: "Xin chào", "Cảm ơn bạn", "Chào An, cho hỏi lịch tiêm chủng" và một câu hỏi vắc xin mẫu; hai lượt đầu không còn Đọc thêm, hai lượt sau giữ nguyên hành vi hiện nay.
- Hồi quy: 9 cách hỏi vắc xin, T08, T24.
