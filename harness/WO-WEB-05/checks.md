# Checks — WO-WEB-05: Quản lý tài liệu trong Admin Dashboard

| Bước | Yêu cầu | Verdict | Evidence |
|---|---|---|---|
| 3 | `npm run build` exit 0 | pass | Build 29/10/2026: Compiled successfully |
| 2 | grep placeholder trong dashboard = 0 | pass | grep -c 'Tính năng đang được phát triển' = 0 sau khi sửa |
| 1 | Logic upload/xóa khớp trang mẫu admin/documents | pass | Đối chiếu: upload bucket 'documents' path docs/<random>.<ext>, getPublicUrl, insert {title, file_url}; xóa: storage.remove([docs/<file>]) rồi delete dòng — trùng khớp trang mẫu |
| 4 | PR merged vào main | unresolved | |
| 5 | CRUD tài liệu thật trên bản live + /tai-lieu hiển thị đúng | unresolved | |
| 5 | Không hồi quy /tai-lieu và trang chủ | unresolved | |

## Nhật ký kiểm chứng

| Thời gian | Lệnh / tín hiệu | Môi trường | Kết quả |
|---|---|---|---|
| 29/10/2026 | npm run build; grep placeholder | Local, nhánh dot-2/quan-ly-tai-lieu | Build pass; placeholder = 0 |

## Vòng sửa lỗi

| Bước | Lần thử | Lý do fail | Phạm vi sửa | Kết quả |
|---|---|---|---|---|
|  |  |  |  |  |
