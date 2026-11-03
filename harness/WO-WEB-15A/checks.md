# WO-WEB-15A: Bảng kiểm tra

## Trước khi gộp (điều kiện để báo cáo xin xác nhận merge)

| # | Hạng mục | Kết quả | Bằng chứng |
|---|----------|---------|------------|
| 1 | Khiếm khuyết được xác nhận trước thay đổi: câu hỏi T17 trên Production trả lời thiếu đích báo cáo tại khoản 4 Điều 4 Thông tư 51/2017, và mô phỏng ngoại tuyến chứng minh đoạn Điều 4 được chọn nhưng bị cắt ở 900 ký tự | pass | Kiểm chứng live trước thay đổi: Bot trả lời bằng Điều 15 Thông tư 13/2026, không có đích báo cáo của Thông tư 51/2017; mô phỏng ngoại tuyến theo logic truy xuất đang chạy chọn đúng đoạn Điều 4 Thông tư 51/2017 vào ngữ cảnh |
| 2 | Trần mới không cắt bất kỳ đoạn nào trong kho hiện hành: đoạn dài nhất 1.458 ký tự, nhỏ hơn trần 1.500 | pass | Thống kê trên bản sao kho đang vận hành (309 đoạn): 162 đoạn trên 900 ký tự, đoạn dài nhất 1.458 ký tự |
| 3 | Build production đạt | pass | npm run build ngày 03/11/2026: Compiled successfully, 27/27 trang tĩnh |
| 4 | Rà soát diff: thay đổi chỉ gồm hằng số trần ký tự của đoạn tri thức và hồ sơ WO; thuật toán chọn đoạn, trần bài viết và dữ liệu không đổi | pass | Diff đối chiếu bản nhánh chính: route.ts chỉ đổi slice(0, 900) thành slice(0, 1500) tại dòng lắp ráp đoạn tri thức cộng 3 dòng chú thích; không dòng nào khác bị chạm |

## Sau khi được xác nhận merge và triển khai (kiểm chứng trên hệ thống thật)

| # | Hạng mục | Kết quả | Bằng chứng |
|---|----------|---------|------------|
| 5 | T17: câu hỏi "Các trường hợp phản vệ phải được báo cáo về đâu ạ?" trả lời có đích báo cáo Trung tâm Quốc gia về Thông tin Thuốc và Theo dõi phản ứng có hại của thuốc theo khoản 4 Điều 4 Thông tư 51/2017 | pending | Chờ xác nhận merge |
| 6 | Hồi quy hành vi: 9 cách hỏi vắc xin giữ nguyên 9/9; bộ 10 ca WO-WEB-10 giữ nguyên; ca P3, P4 giữ nguyên mức leo thang | pending | Chờ xác nhận merge |
| 7 | Độ trễ sau thay đổi so với mốc nền (đo tại WO-WEB-12 sau triển khai: 3,42 đến 3,87 giây); giới hạn trên ngữ cảnh tăng tối đa từ 5 đoạn nhân 900 lên 5 đoạn nhân 1.500 ký tự, ghi nhận thực tế | pending | Chờ xác nhận merge |
