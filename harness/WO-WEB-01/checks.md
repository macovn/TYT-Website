# Checks — WO-WEB-01: Đợt 1 website Trạm Y tế Cái Bầu (bảo mật + thông tin + dọn rác)

Verdict chỉ dùng ba giá trị: `pass` (có bằng chứng), `fail` (bằng chứng
cho thấy chưa đạt), `unresolved` (chưa có bằng chứng — không kết luận pass).

| Bước | Yêu cầu | Verdict | Evidence |
|---|---|---|---|
| 0 | Baseline: npm install thành công trên nhánh mới | pass | `npm install` exit 0, cuối output "193 packages are looking for funding" |
| 0 | Baseline: npx tsc --noEmit 0 lỗi | pass | `npx tsc --noEmit` exit 0, không output lỗi |
| 0 | Baseline: npm run build đạt, đủ 25 route | pass | "✓ Generating static pages (25/25)", bảng Route đủ 25 dòng, First Load JS shared 84.4 kB |
| 1 | Trigger khóa role profiles + hàm is_admin có trong supabase_setup.sql và sql/dot1-security-migration.sql | pass | setup: `public.is_admin()` dùng 37 chỗ, trigger tại dòng 137–170; migration: hàm tại mục 1–2, trigger dòng 63–96 |
| 1 | Không còn policy ghi (INSERT/UPDATE/DELETE) nào của bảng nội dung/storage dùng `auth.role() = 'authenticated'` | pass | grep còn đúng 3 dòng (setup:376, 401, 426) — đều là policy SELECT của storage, giữ nguyên theo thiết kế chống liệt kê thư mục |
| 1 | Migration idempotent (DROP ... IF EXISTS / CREATE OR REPLACE) và có comment hướng dẫn chạy SQL Editor ở đầu file | pass | sql/dot1-security-migration.sql: khối comment đầu file (mục đích, cách chạy, điều kiện bootstrap admin); 37 CREATE POLICY kèm DROP IF EXISTS; CREATE OR REPLACE FUNCTION x2 |
| 2 | src/middleware.ts tồn tại: chặn /admin/* trừ /admin/login khi chưa có phiên | pass | File tồn tại; build sinh "ƒ Middleware 202 kB"; matcher ['/admin/:path*'], isLoginPage bỏ qua |
| 2 | src/app/admin/layout.tsx (server) kiểm tra phiên + role admin/editor, bỏ qua /admin/login | pass | File tồn tại (createServerComponentClient + redirect); các route /admin/* chuyển ○→λ (dynamic) trong bảng route sau build — bằng chứng layout server đã chạy |
| 2 | API create-user/delete-user: xác thực token rồi đọc profile người gọi bằng service-role client; create-user whitelist role {admin, editor} | pass | git diff 2 route: supabaseAdmin tạo trước bước kiểm tra, `.from('profiles')` đọc bằng supabaseAdmin; safeRole tại create-user (3 điểm dùng) |
| 3 | src/lib/utils.ts: cấu hình sanitize không còn cho phép object/embed ở cả hai nhánh | pass | grep object/embed trong utils.ts chỉ còn ở comment (dòng 36) và FORBID_TAGS (dòng 78); ADD_TAGS đã bỏ embed/object; nhánh server tập thẻ cho phép vốn không chứa object/embed |
| 3 | Mọi điểm dangerouslySetInnerHTML chứa nội dung đều qua sanitizeHtml | pass | grep toàn src: 8 điểm — 7 điểm nội dung đều bọc sanitizeHtml (gioi-thieu/[slug]:83, thong-bao:143, thong-bao/[id]:123, tin-tuc:101, tin-tuc/[slug]:135, NewsSection:76,135); điểm còn lại layout.tsx:34 là script inline tĩnh, không chứa nội dung người dùng |
| 4 | supabase_setup.sql: không còn UPDATE auth.users; có CREATE TABLE services; seed posts dùng cột thật | pass | grep "UPDATE auth.users" rc=1 (chỉ còn chữ "bảng auth.users" trong comment giải thích); CREATE TABLE IF NOT EXISTS services tại setup:68; seed INSERT dùng (title, content, excerpt, category, status) |
| 5 | Đã xóa security_test.js, xss_test.ts, metadata.json, zalo_verifier ở gốc và src/app/; bản public/ còn nguyên; grep trước xóa chứng minh không tham chiếu | pass | grep tham chiếu trước xóa: cả 2 lượt grep exit=1 (0 kết quả); git rm 5 file; public/zalo_verifier...html còn nguyên, md5 3 bản trước xóa giống hệt nhau 23a8a57267f1b96c8dc3dc9af45010f7 |
| 6 | grep "Thôn Đông Hải" = 0 kết quả trong src + supabase_setup.sql | pass | grep rc=1 sau sửa (trước sửa: 5 vị trí) |
| 6 | grep "Tỉnh Quảng Ninh" = 0 kết quả trong src | pass | grep rc=1 sau sửa (trước sửa: 6 vị trí tính cả trong chuỗi địa chỉ) |
| 6 | grep câu trực thuộc sai ("Trung tâm Y tế Đặc khu", "TT Y tế Đặc khu") = 0 | pass | grep rc=1 sau sửa |
| 6 | grep "Trung tâm Y tế huyện" và "xã Cái Bầu" chỉ hiện tại = 0 | pass | grep rc=1 cho cả cụm "Trung tâm Y tế huyện", "xã Cái Bầu", "địa bàn xã", "người dân trong xã", "phát thanh xã" |
| 6b | Đã grep và ghi file:line các mục chờ Maco xác nhận (giờ làm việc, lịch tiêm, 2 số cấp cứu, hero, Trạm trưởng) vào progress, không tự sửa | pass | Bảng đầy đủ ở progress.md mục Open issues; git diff không chứa thay đổi nào tại các vị trí đó |
| 7 | Sau sửa: npm install thành công | pass | `npm install` exit 0 |
| 7 | Sau sửa: npx tsc --noEmit 0 lỗi | pass | TSC_EXIT=0 |
| 7 | Sau sửa: npm run build đạt đủ 25 route | pass | "✓ Compiled successfully", "✓ Generating static pages (25/25)" — bằng baseline; bảng route đủ 28 dòng route như baseline (25 là số trang tĩnh), thêm dòng ƒ Middleware |
| 7 | Tự rà soát diff theo 4 trục (đúng đắn, bảo mật, hiệu năng, bảo trì), kết quả ghi vào progress | pass | progress.md mục "Tự rà soát diff 4 trục" |
| 8 | Nhánh dot-1/bao-mat-thong-tin đã push lên origin; git status sạch | unresolved | Chạy ở bước cuối |

## Nhật ký kiểm chứng

| Thời gian | Lệnh / tín hiệu đã chạy thật | Môi trường | Kết quả nguyên văn (tóm tắt) |
|---|---|---|---|
| 27/10/2026 | `npm install` | Repo local, nhánh dot-1/bao-mat-thong-tin (= main 2565233) | exit 0 |
| 27/10/2026 | `npx tsc --noEmit` | nt | exit 0, không lỗi |
| 27/10/2026 | `npm run build` | nt | ĐẠT, "Generating static pages (25/25)" |
| 27/10/2026 | grep tiền kiểm Bước 5/6 (tham chiếu file rác; chuỗi thông tin sai; vị trí chờ xác nhận) | nt | Ghi đầy đủ ở progress.md |
| 27/10/2026 | `npm install` (sau sửa) | Repo local, nhánh dot-1/bao-mat-thong-tin | exit 0 |
| 27/10/2026 | `npx tsc --noEmit` (sau sửa) | nt | TSC_EXIT=0 |
| 27/10/2026 | `npm run build` (sau sửa, log /tmp/wo-web-01-build.log) | nt | exit 0, "✓ Compiled successfully", "✓ Generating static pages (25/25)", "ƒ Middleware 202 kB", route /admin/* chuyển λ (dynamic) |
| 27/10/2026 | grep hậu kiểm Bước 1/3/4/6 (is_admin, object/embed, UPDATE auth.users, chuỗi sai) | nt | Kết quả từng mục ở bảng checks phía trên |

## Vòng sửa lỗi

| Bước | Lần thử | Lý do fail (kèm bằng chứng) | Phạm vi sửa (chỉ bước này) | Kết quả |
|---|---|---|---|---|
| | 1/3 | | | |
