# Progress — WO-WEB-04

- Bắt đầu: 29/10/2026, theo lệnh của Maco kèm ảnh chụp tab Thông báo hiện "Tính năng đang được phát triển."
- Phát hiện nền: bảng announcements + RLS đã có từ Đợt 1; trang độc lập /admin/announcements đã có CRUD đầy đủ; ticker trang chủ và /thong-bao đã đọc cùng bảng. Phần thiếu duy nhất là tab announcements trong /admin/dashboard còn là placeholder.
- Đề xuất ngoài scope: tab Tài liệu trong dashboard cũng đang là placeholder — chờ Maco giao riêng.
- Hoàn tất 29/10/2026: PR #25 merged (cb97e969). Kiểm chứng live đạt: đăng nhập admin (thông tin đã lưu Secure Vault), tạo/sửa/tắt đăng thông báo thử và hiển thị công khai đều đạt; mục thử đã dọn qua lớp dữ liệu, kiểm chứng count = 0.
- Hạn chế ghi nhận: trình duyệt kiểm thử tự động không kích hoạt được hộp thoại confirm() của nút Xóa (cả Thông báo và Tài liệu), cùng cơ chế với nút xóa bài viết hiện hữu; thao tác xóa dữ liệu đã chứng minh đạt qua SQL. Nếu Maco muốn, có thể thay confirm() bằng modal xác nhận riêng ở một WO sau.
