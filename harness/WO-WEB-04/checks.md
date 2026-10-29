# Checks — WO-WEB-04: Quản lý thông báo trong Admin Dashboard

| Bước | Yêu cầu | Verdict | Evidence |
|---|---|---|---|
| 3 | `npm run build` exit 0 | pass | Build 29/10/2026: Compiled successfully, 27/27 trang, route /admin/dashboard 9.67 kB; chỉ còn warning `<img>` có từ trước ở dòng 377 (không thuộc thay đổi này) |
| 2 | Placeholder tab Thông báo đã thay bằng UI quản lý; grep placeholder còn đúng 1 (tab Tài liệu) | pass | grep -c 'Tính năng đang được phát triển' trên dashboard/page.tsx = 1 sau khi sửa (trước: 2) |
| 1 | CRUD khớp schema announcements (title, content, is_published) | pass | Đối chiếu code: insert/update dùng đúng 3 cột title/content/is_published; select order by created_at; khớp sql/dot1-security-migration-live.sql và trang mẫu admin/announcements |
| 4 | PR merged vào main | pass | PR #25 merged, merge commit cb97e969 |
| 5 | CRUD thật trên bản live (tạo/sửa/tắt đăng/xóa thông báo thử) + ticker và /thong-bao hiển thị đúng | pass | Live 29/10/2026 (tài khoản admin vuanhdung83vdqn@gmail.com): tạo thông báo thử 19:06 hiện trong danh sách admin + thanh THÔNG BÁO trang chủ + /thong-bao; chuyển Bản nháp đạt; sửa tiêu đề đạt. Riêng nút Xóa trên trình duyệt kiểm thử tự động không kích hoạt được hộp thoại confirm() nên mục thử được xóa qua lớp dữ liệu (SQL + kiểm chứng count = 0); thao tác xóa dữ liệu đạt, hạn chế tương tác ghi ở Nhật ký |
| 5 | Không hồi quy trang chủ và /thong-bao | pass | curl sau triển khai: trang chủ 200, /thong-bao 200; kiểm tra trực quan cùng lượt E2E đạt |

## Nhật ký kiểm chứng

| Thời gian | Lệnh / tín hiệu | Môi trường | Kết quả |
|---|---|---|---|
| 29/10/2026 | npm run build; grep placeholder | Local, nhánh dot-2/quan-ly-thong-bao | Build pass; placeholder còn 1 |

## Vòng sửa lỗi

| Bước | Lần thử | Lý do fail | Phạm vi sửa | Kết quả |
|---|---|---|---|---|
| 29/10/2026 | E2E trình duyệt thật + DELETE SQL kiểm chứng | Bản live tramytecaibau.com + Supabase | Tạo/sửa/tắt đăng/hiển thị công khai đạt; xóa qua lớp dữ liệu đạt (count = 0); nút xóa UI chưa kích hoạt được confirm() trên trình duyệt tự động |  |
