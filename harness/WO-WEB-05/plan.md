# Plan — WO-WEB-05: Phát triển tính năng Quản lý tài liệu trong Admin Dashboard

## Hợp đồng đầu vào

- **TASK:** Dựng tính năng Tài liệu trong Admin Dashboard (/admin/dashboard): tab "Tài liệu" hiện là placeholder "Tính năng đang được phát triển." — phải thành trang quản lý đầy đủ (danh sách, tìm kiếm, tải lên kèm file, tải xuống, xóa) trên bảng `documents` và Storage bucket `documents` sẵn có.
- **OUTPUT:** Code trên nhánh `dot-2/quan-ly-tai-lieu`, PR vào main; hồ sơ tại harness/WO-WEB-05/.
- **CHECKS:** Xem checks.md (viết trước khi làm).
- **SOURCES:** Lệnh của Maco "Dựng luôn Tài liệu" ngày 29/10/2026 (tiếp nối WO-WEB-04); src/app/admin/documents/page.tsx (trang độc lập đã có đầy đủ logic: upload Storage docs/<random>.<ext>, insert {title, file_url}, xóa cả file lẫn dòng); sql/dot1-security-migration-live.sql (RLS documents: ghi chỉ admin); src/app/tai-lieu/page.tsx (trang công khai đọc cùng bảng); mẫu UI dashboard từ WO-WEB-04.
- **SCOPE:** Chỉ sửa src/app/admin/dashboard/page.tsx: thêm state/fetch/handler/UI tab documents + modal tải lên; thẻ thống kê "Tài liệu" ở tab tổng quan dùng documents.length thật thay cho số cứng '12'. KHÔNG sửa schema, RLS, Storage, trang độc lập /admin/documents, trang công khai /tai-lieu.
- **LIMIT:** Tối đa 3 vòng sửa/bước.
- **Rules file:** package.json (build = next build); quy ước nhánh + PR, đẩy qua GitHub connector.
- **Điểm khôi phục:** Nhánh mới từ origin/main cb97e969 (đã gồm WO-WEB-04).
- **Căn cứ chạy plan:** Maco ra lệnh trực tiếp ngày 29/10/2026.

## Các bước

| Bước | Việc | File đọc | File ghi | Output |
|---|---|---|---|---|
| 1 | State + fetch documents trong fetchData + handlers tải lên/xóa | dashboard/page.tsx; admin/documents/page.tsx | dashboard/page.tsx | Logic dữ liệu |
| 2 | Thay placeholder tab documents bằng UI quản lý + modal tải lên | dashboard/page.tsx | dashboard/page.tsx | UI hoàn chỉnh |
| 3 | Build + rà soát | diff | checks.md | Build pass |
| 4 | Đẩy nhánh, PR, gộp main | — | GitHub | PR merged |
| 5 | Kiểm chứng live gộp cùng WO-WEB-04: CRUD thông báo + tài liệu thử, kiểm tra /thong-bao, /tai-lieu, ticker | tramytecaibau.com | progress.md, checks.md | Bằng chứng live |

## Checks viết trước khi làm

| Bước | Yêu cầu | Cách kiểm chứng |
|---|---|---|
| 3 | Build sạch | `npm run build` exit 0 |
| 2 | Không còn placeholder nào trong dashboard | grep "Tính năng đang được phát triển" = 0 |
| 1 | Logic khớp trang mẫu: upload vào bucket documents path docs/, insert {title, file_url}, xóa remove Storage + delete dòng | Đối chiếu code |
| 4 | PR merged | GitHub API merged=true |
| 5 | Trên bản live (nếu có phiên admin): tải lên tài liệu thử, thấy ở tab Tài liệu và /tai-lieu, xóa sạch; không có phiên admin thì unresolved, báo Maco | Trình duyệt thật |

## Ngoài SCOPE

- Không đụng trang độc lập /admin/documents và /admin/announcements (đang chạy song song, để nguyên).
