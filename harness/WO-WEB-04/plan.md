# Plan — WO-WEB-04: Phát triển tính năng Quản lý thông báo trong Admin Dashboard

## Hợp đồng đầu vào

- **TASK:** Phát triển tính năng Thông báo: tab "Thông báo" trong Admin Dashboard (/admin/dashboard) hiện chỉ hiện "Tính năng đang được phát triển." — phải thành trang quản lý đầy đủ (xem danh sách, tìm kiếm, thêm, sửa, xóa, bật/tắt đăng) trên bảng `announcements` sẵn có.
- **OUTPUT:** Code trên nhánh `dot-2/quan-ly-thong-bao`, PR vào main của repo macovn/TYT-Website; hồ sơ tại harness/WO-WEB-04/.
- **CHECKS:** Xem mục Checks bên dưới (đã viết trước khi làm).
- **SOURCES:** Ảnh chụp của Maco ngày 29/10/2026 (tab Thông báo hiện placeholder); src/app/admin/dashboard/page.tsx (nơi chứa placeholder, dòng ~595); src/app/admin/announcements/page.tsx (trang quản lý độc lập đã có CRUD đầy đủ — mẫu logic tham chiếu); sql/dot1-security-migration-live.sql (schema announcements + RLS: SELECT công khai, ghi chỉ admin qua public.is_admin()); src/components/AnnouncementTicker.tsx và src/app/thong-bao/ (phía công khai đã chạy trên cùng bảng).
- **SCOPE:** Chỉ sửa src/app/admin/dashboard/page.tsx (thêm state/fetch/handler/UI cho tab announcements) + hồ sơ harness. KHÔNG sửa schema, RLS, trang độc lập /admin/announcements, ticker, trang công khai /thong-bao, tab Tài liệu (placeholder còn lại — ngoài phạm vi, ghi đề xuất riêng).
- **LIMIT:** Tối đa 3 vòng sửa/bước; dừng ở blocker đầu tiên không tự vượt qua được.
- **Rules file đã đọc:** package.json (scripts: build = next build); quy ước repo: nhánh riêng + PR, không đẩy thẳng main; đẩy code qua GitHub connector (push-files) vì git push qua tunnel lỗi.
- **Điểm khôi phục:** Nhánh mới từ origin/main (6b19599, sau PR #24 là 971433f); không sửa file nào đang dở.
- **Căn cứ chạy plan:** Maco ra lệnh trực tiếp "Phát triển tính năng Thông báo" kèm ảnh chụp ngày 29/10/2026 — phạm vi rõ, chạy luôn không chờ duyệt plan.

## Các bước

| Bước | Việc | File đọc | File ghi | Output | Song song? | Skill |
|---|---|---|---|---|---|---|
| 1 | Thêm state + fetch announcements trong fetchData + handlers CRUD | dashboard/page.tsx (toàn file) | dashboard/page.tsx | Logic dữ liệu | Không | kien-truc-backend (nhẹ) |
| 2 | Thay block placeholder tab announcements bằng UI quản lý (bảng, tìm kiếm, nút thêm) + modal thêm/sửa dùng Editor sẵn có | dashboard/page.tsx; admin/announcements/page.tsx (mẫu) | dashboard/page.tsx | UI hoàn chỉnh | Không | phat-trien-frontend |
| 3 | Build + rà soát code thay đổi | diff | checks.md | Build pass | Không | ra-soat-code |
| 4 | Đẩy nhánh, mở PR, gộp vào main | — | GitHub | PR merged | Không | — |
| 5 | Kiểm chứng live: bản dựng mới lên; thử CRUD thật nếu trình duyệt còn phiên admin; kiểm tra hồi quy ticker và /thong-bao | tramytecaibau.com | progress.md, checks.md | Bằng chứng live | Không | kiem-chung-nghiem-thu |

## Checks viết trước khi làm

| Bước | Yêu cầu kiểm tra | Cách kiểm chứng |
|---|---|---|
| 3 | Build sạch, không lỗi type | `npm run build` exit 0 |
| 2 | Placeholder của tab Thông báo không còn; placeholder Tài liệu giữ nguyên (ngoài scope) | grep "Tính năng đang được phát triển" trong dashboard/page.tsx: còn đúng 1 |
| 1 | CRUD đúng schema announcements (title, content, is_published, created_at), ghi qua supabase client như trang mẫu | Đối chiếu code với sql/dot1-security-migration-live.sql và admin/announcements/page.tsx |
| 4 | PR merged vào main | GitHub API: merged=true |
| 5 | Admin: đăng nhập được thì tạo thông báo thử, thấy xuất hiện ở ticker trang chủ và /thong-bao, sửa, tắt đăng, xóa — có bằng chứng từng thao tác; không đăng nhập được thì ghi unresolved và báo Maco | Trình duyệt thật trên bản live |
| 5 | Không hồi quy: trang chủ và /thong-bao tải bình thường sau triển khai | Mở trực tiếp bản live |

## Ranh giới và điểm cần hỏi trước

- Ngoài SCOPE: tab Tài liệu (placeholder) — ghi đề xuất riêng ở progress.md, không tự làm.
- Xóa dữ liệu thật: không xóa thông báo thật nào khi thử; chỉ tạo/xóa thông báo thử do chính lần chạy này tạo.

## Completion checklist

- [ ] Mọi output tồn tại và mở được
- [ ] Mọi check chạy thành công với phiên bản mới nhất
- [ ] Mọi lỗi đã sửa hoặc đã báo cáo rõ ràng
- [ ] Rules file: không có rule mới từ lần chạy này
