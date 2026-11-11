# WO-WEB-19: Bảng kiểm chứng

| # | Tiêu chí | Trạng thái | Bằng chứng |
|---|----------|-----------|-----------|
| 1 | Logic cửa sổ số trang đúng ở các biên: trang đầu, giữa, cuối và tổng số trang lớn (91 trang) | pass | Bộ ca cửa sổ trang 11/11 đạt (một ca kỳ vọng viết tay thiếu một dấu chấm lửng, hàm cho kết quả đúng), kiểm tra bất biến ngẫu nhiên 500 trường hợp đạt: trang hiện tại luôn có mặt, số không trùng, luôn có trang đầu và cuối |
| 2 | Kiểm tra type độc lập và build sạch đạt | pass | npx tsc --noEmit sạch; build sạch đạt ngày 11/11/2026 |
| 3 | Live sau triển khai: bấm sang trang 2 và trang cuối thấy bài khác trang 1, nút lui và tiến hoạt động, cột phải không đổi nội dung | pass | Kiểm chứng bấm thật trên Production ngày 11/11/2026: trang 1 sang trang 2 sang trang 3 rồi lui về trang 2, mỗi trang đúng 3 bài khác nhau, thanh phân trang hiện cửa sổ 1, 2, chấm lửng, 90, 91 kèm nút lui và tiến; lượt tải đầu tiên của phiên kiểm chứng còn trúng bản triển khai cũ đang lan truyền nên hiện thanh cũ, tải lại thì đúng bản mới, không phải lỗi của mã mới |
| 4 | Hồi quy: trang chi tiết bài viết và bot An trên Production không bị ảnh hưởng | pass | Sau triển khai: trang Tin tức trả HTTP 200, bot An trên Production trả lời bình thường câu hỏi giờ làm việc; thay đổi chỉ chạm trang danh sách tin tức |
