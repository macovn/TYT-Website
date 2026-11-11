# WO-WEB-19: Bảng kiểm chứng

| # | Tiêu chí | Trạng thái | Bằng chứng |
|---|----------|-----------|-----------|
| 1 | Logic cửa sổ số trang đúng ở các biên: trang đầu, giữa, cuối và tổng số trang lớn (91 trang) | pass | Bộ ca cửa sổ trang 11/11 đạt (một ca kỳ vọng viết tay thiếu một dấu chấm lửng, hàm cho kết quả đúng), kiểm tra bất biến ngẫu nhiên 500 trường hợp đạt: trang hiện tại luôn có mặt, số không trùng, luôn có trang đầu và cuối |
| 2 | Kiểm tra type độc lập và build sạch đạt | pass | npx tsc --noEmit sạch; build sạch đạt ngày 11/11/2026 |
| 3 | Live sau triển khai: bấm sang trang 2 và trang cuối thấy bài khác trang 1, nút lui và tiến hoạt động, cột phải không đổi nội dung | pending | Chờ triển khai |
| 4 | Hồi quy: trang chi tiết bài viết và bot An trên Production không bị ảnh hưởng | pending | Chờ triển khai |
