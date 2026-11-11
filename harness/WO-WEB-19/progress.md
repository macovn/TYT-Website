# WO-WEB-19: Tiến độ

Đang thực hiện ngày 11/11/2026. Đã chẩn đoán dứt điểm: truy vấn giới hạn cứng 3 bài và khối phân trang là nút tĩnh không gắn xử lý bấm. Đã sửa trên nhánh dot-2/wo-web-19-phan-trang-tin-tuc: truy vấn theo trang bằng range kèm đếm tổng, thanh phân trang thật dạng cửa sổ, cột phải tách truy vấn riêng. Kiểm chứng ngoại tuyến đạt, type và build sạch, chờ mở PR và xác nhận merge của Maco.

Ngoài phạm vi ghi nhận: liên kết danh mục ở cột phải trỏ /tin-tuc?cat=... nhưng trang chưa lọc theo tham số này; đề xuất xử lý ở một WO riêng nếu Maco yêu cầu.


## Hoàn tất ngày 11/11/2026

Đã merge PR số 73 (329295e4) theo xác nhận của Maco lúc 10:58 ngày 11/11/2026. Kiểm chứng bấm thật trên Production đạt: chuyển trang 1, 2, 3 và lui về 2 đúng nội dung, tổng 91 trang cho 271 bài, cột phải không đổi theo trang. Lượt tải đầu tiên trong phiên kiểm chứng còn trúng bản triển khai cũ đang lan truyền, tải lại thì đúng bản mới. Bot An hồi quy bình thường.
