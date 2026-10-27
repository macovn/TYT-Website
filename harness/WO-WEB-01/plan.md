# Plan — WO-WEB-01: Đợt 1 tinh chỉnh website Trạm Y tế Cái Bầu (vá bảo mật + sửa thông tin đã rõ + dọn file rác)

## Hợp đồng đầu vào

- **TASK:** Vá bảo mật B1/B2/B3 theo báo cáo 01, sửa an toàn file cài đặt `supabase_setup.sql` + tạo migration cho project đang chạy, dọn file rác, sửa thông tin đã rõ (địa chỉ, trực thuộc, thuật ngữ cũ) — trên nhánh riêng, kiểm chứng build đạt, đẩy nhánh lên GitHub. KHÔNG mở PR, KHÔNG gộp nhánh, KHÔNG deploy, KHÔNG đụng Supabase live.
- **OUTPUT:** Repo `~/workspace/repos/TYT-Website`, nhánh `dot-1/bao-mat-thong-tin` (từ `main` @ 2565233). Hồ sơ harness tại `harness/WO-WEB-01/`; file migration tại `sql/dot1-security-migration.sql`.
- **CHECKS:** (xem bảng dưới — viết trước khi sửa) npm install thành công; `npx tsc --noEmit` 0 lỗi; `npm run build` đạt đủ 25 route như baseline; grep sau sửa không còn chuỗi địa chỉ sai/thuật ngữ trực thuộc sai; cấu hình sanitize không còn object/embed; migration tồn tại và nhất quán với supabase_setup.sql; tự rà soát diff 4 trục; nhánh đã push, git status sạch.
- **SOURCES:** `~/workspace/website-tram-review/01-kien-truc-bao-mat.md` (toàn bộ, có file:line), `02-ux-noi-dung.md` (mục 2 và 5.1), `00-Tu-van-tong-hop.md`.
- **SCOPE:** Đúng 6 nhóm A–F trong WO (chi tiết ở bảng bước). Ngoài scope: thống nhất giờ làm việc, lịch tiêm chủng, hai số cấp cứu 0203.3822.115 / 0203.3858.123, số liệu hero, tên Trạm trưởng (chỉ grep ghi vị trí vào open issues); nâng cấp Next.js (B4); tắt đăng ký công khai Supabase Auth (việc trên Dashboard project live); hợp nhất trang admin trùng (S6); security headers (S5).
- **LIMIT:** Tối đa 3 vòng sửa mỗi bước; gặp blocker không tự vượt qua được thì dừng, ghi progress và báo cáo, không nới scope.
- **Rules file đã đọc:** Không có AGENTS.md/CLAUDE.md trong repo. Rules thực tế: `README.md` (hướng dẫn cài đặt/build bằng npm scripts) + `package.json` (scripts: dev/build/start/lint). Lệnh kiểm chứng lấy từ package.json: `npm install`, `npm run build`; `npx tsc --noEmit` theo báo cáo 01 đã dùng.
- **Điểm khôi phục trước thay đổi:** Nhánh `main` @ commit 2565233, working tree sạch (git status xác nhận trước khi tạo nhánh). Mọi thay đổi nằm trên nhánh `dot-1/bao-mat-thong-tin`, hủy bỏ bằng cách xóa nhánh.
- **Căn cứ chạy plan:** Maco đã duyệt phạm vi Đợt 1 lúc 07:13 ngày 27/10/2026 (qua điều phối chính Marley, WO-WEB-01). Không dừng chờ duyệt plan; ghi căn cứ này theo quy trình harness.

## Quyết định kỹ thuật đã chốt trong plan (ghi lý do đầy đủ ở progress.md)

1. **B1:** Dùng trigger `BEFORE INSERT OR UPDATE` trên `profiles` chặn đổi/gán `role` đối với người gọi không có đặc quyền (cho qua: `service_role`, phiên SQL Editor `postgres`/`supabase_admin`, và admin hiện hữu). Lý do: cơ chế chuẩn của Supabase, cưỡng chế ở tầng DB bất kể client nào gọi PostgREST; thu hồi quyền theo cột (column-level REVOKE) sẽ làm vỡ luồng service-role/admin hợp lệ và khó bảo trì hơn.
2. **B2:** Tạo hàm `public.is_admin()` (SECURITY DEFINER, search_path cố định) kiểm tra `profiles.role = 'admin'` của `auth.uid()`; mọi policy INSERT/UPDATE/DELETE của bảng nội dung (pages, categories, posts, announcements, documents, media, staff, services) + messages (SELECT/UPDATE/DELETE phía quản trị; INSERT công khai giữ nguyên cho form liên hệ) + 3 bucket Storage chuyển điều kiện từ `auth.role() = 'authenticated'` sang `public.is_admin()`. Quyền SELECT công khai giữ nguyên như thiết kế hiện tại. Theo đúng chữ của WO: chỉ admin (không gồm editor) — hệ quả với tài khoản editor được ghi ở open issues để Maco chốt sau.
3. **Bảo vệ server khu admin:** Chuyển client trình duyệt trong `src/lib/supabase.ts` sang `createClientComponentClient` của `@supabase/auth-helpers-nextjs` (đã có sẵn trong dependencies) để phiên đăng nhập lưu bằng cookie; thêm `src/middleware.ts` (createMiddlewareClient) chặn `/admin/*` (trừ `/admin/login`) khi chưa có phiên, đồng thời gắn header `x-pathname`; thêm `src/app/admin/layout.tsx` phía server (createServerComponentClient) kiểm tra phiên + role ∈ {admin, editor} (đúng ngưỡng mà trang login hiện hành đang áp dụng), bỏ qua kiểm tra với riêng `/admin/login` qua header x-pathname. Lớp RLS (B1+B2) vẫn là biên bảo mật thật; middleware/layout là lớp chặn sớm phía server theo yêu cầu WO.
4. **API routes:** Hai route create-user/delete-user đã kiểm tra token + role admin phía server (mẫu đúng). Điểm yếu còn lại (S2 trong báo cáo 01): đọc profile người gọi bằng anon client không gắn JWT — chỉ chạy nhờ policy SELECT profiles đang công khai. Sửa tối thiểu: đọc profile người gọi bằng service-role client sau khi đã xác thực token; thêm whitelist role ∈ {admin, editor} cho tham số role ở create-user.
5. **B3:** Thống nhất một chính sách sanitize cho hai nhánh trong `src/lib/utils.ts`: bỏ `object`/`embed` khỏi ADD_TAGS phía client + FORBID_TAGS/FORBID_ATTR; phía server giữ tập thẻ không chứa object/embed (mặc định sanitize-html vốn không có) và siết `allowedStyles` bằng regex chặn `url(`, `expression`, `javascript:`; iframe ở cả hai phía chỉ cho phép src thuộc youtube/youtube-nocookie hoặc `*.supabase.co` (nơi lưu PDF/tài liệu của Trạm) — client qua hook `uponSanitizeAttribute` của DOMPurify, server qua `transformTags` của sanitize-html. Cả 7 điểm `dangerouslySetInnerHTML` chứa nội dung đều đã đi qua `sanitizeHtml` (đã grep xác nhận; điểm ở layout.tsx là script inline tĩnh, không phải nội dung).
6. **File cài đặt (D):** Bổ sung `CREATE TABLE IF NOT EXISTS services` với các cột code đang dùng (id, name, description, icon, status, created_at — suy ra từ `src/app/admin/services/page.tsx`, `src/app/dich-vu-y-te/page.tsx`, `src/components/ServicesSection.tsx`) + policy ghi admin cho services; gỡ đoạn `UPDATE auth.users` cuối file; sửa seed INSERT INTO posts đang tham chiếu cột `category_id` không tồn tại sang các cột thật (title, content, excerpt, category, status) và bỏ chữ "địa bàn xã" trong seed — để script chạy trọn trên project trống.
7. **Migration:** `sql/dot1-security-migration.sql` chứa toàn bộ thay đổi tầng DB của bước A+B+D (hàm is_admin, trigger khóa role, policy mới, tạo bảng services nếu thiếu) ở dạng idempotent (DROP POLICY IF EXISTS, CREATE OR REPLACE FUNCTION, DROP TRIGGER IF EXISTS), có comment đầu file hướng dẫn chạy trong Supabase SQL Editor và bước bootstrap admin qua SQL khi chưa có profile admin nào. supabase_setup.sql được cập nhật nhất quán cùng nội dung.

## Các bước

| Bước | Việc | File đọc | File ghi | Output của bước | Song song được? | Skill chuyên môn |
|---|---|---|---|---|---|---|
| 0 | Baseline: npm install, tsc, build trên nhánh mới (= main) | package.json | harness/WO-WEB-01/checks.md | Bằng chứng baseline 25 route | Không | kiem-chung-nghiem-thu |
| 1 (A+B2-SQL) | Viết phần SQL: is_admin, trigger khóa role, siết policy bảng nội dung + storage; cập nhật supabase_setup.sql nhất quán | supabase_setup.sql, báo cáo 01 mục B1/B2/S4 | supabase_setup.sql, sql/dot1-security-migration.sql | Bộ SQL vá B1+B2+D | Không | kien-truc-backend |
| 2 (B-server) | Middleware + admin layout server + chuyển browser client sang cookie session; rà soát/sửa 2 API route | src/lib/supabase.ts, src/app/admin/login/page.tsx, src/app/api/*/route.ts | src/middleware.ts (mới), src/app/admin/layout.tsx (mới), src/lib/supabase.ts, src/app/api/create-user/route.ts, src/app/api/delete-user/route.ts | Lớp chặn server cho /admin | Sau bước 1 | kien-truc-backend |
| 3 (C) | Siết sanitizeHtml hai nhánh, allowlist iframe | src/lib/utils.ts, báo cáo 01 mục B3 | src/lib/utils.ts | sanitizeHtml đã siết | Song song với 2 | ra-soat-code |
| 4 (D) | An toàn file cài đặt: CREATE TABLE services, gỡ UPDATE auth.users, sửa seed posts | supabase_setup.sql | supabase_setup.sql (+ migration ở bước 1 đã gồm phần tương ứng) | setup chạy được trên project trống | Gộp trong bước 1 | kien-truc-backend |
| 5 (E) | Grep chứng minh không tham chiếu rồi xóa file rác | toàn repo | Xóa: security_test.js, xss_test.ts, metadata.json, zalo_verifier ở gốc và trong src/app/ (giữ public/) | Repo sạch file rác, bằng chứng grep trong progress | Song song với 3 | — |
| 6 (F) | Sửa địa chỉ (5 vị trí), "Tỉnh Quảng Ninh" → "thành phố Quảng Ninh", trực thuộc (2 vị trí), thuật ngữ "Trung tâm Y tế huyện"/"xã Cái Bầu" chỉ hiện tại; grep ghi vị trí các mục chờ xác nhận vào progress | Báo cáo 02 mục 2, kết quả grep | src/components/Footer.tsx, src/components/Hero.tsx, src/components/Header.tsx, src/app/layout.tsx, src/app/lien-he/page.tsx, src/app/gioi-thieu/page.tsx, src/app/gioi-thieu/[slug]/page.tsx, src/app/hoi-dap/page.tsx, src/app/thong-bao/page.tsx, src/app/dich-vu/page.tsx, src/components/ServicesSection.tsx, src/app/admin/page.tsx, supabase_setup.sql (seed) | Nội dung đã đúng thông tin đã rõ | Sau bước 1 (chung file setup) | — |
| 7 | Kiểm chứng cuối: install/tsc/build lại, các grep hậu kiểm, tự rà soát diff 4 trục | toàn bộ diff | checks.md, progress.md | Toàn bộ checks có verdict + bằng chứng | Không | kiem-chung-nghiem-thu, ra-soat-code |
| 8 | Commit + push nhánh lên origin, git status sạch | — | — | Nhánh dot-1/bao-mat-thong-tin trên GitHub | Không | — |

## Checks viết trước khi làm

| Bước | Yêu cầu kiểm tra | Cách kiểm chứng (lệnh/tín hiệu thật, lấy từ repo) |
|---|---|---|
| 0/7 | npm install thành công | `npm install` — exit 0 |
| 0/7 | TypeScript 0 lỗi | `npx tsc --noEmit` — exit 0, không output lỗi |
| 0/7 | Build đạt đủ route như baseline (25 route) | `npm run build` — dòng "Generating static pages (25/25)" và bảng route |
| 1 | Trigger khóa role + hàm is_admin tồn tại trong cả setup và migration | grep `protect_profile_role`, `is_admin` trong supabase_setup.sql và sql/dot1-security-migration.sql |
| 1 | Không còn policy ghi nào dùng `auth.role() = 'authenticated'` cho bảng nội dung/storage (trừ SELECT storage theo thiết kế giữ nguyên và messages INSERT công khai) | grep `auth.role() = 'authenticated'` trong supabase_setup.sql, đối chiếu từng dòng còn lại |
| 1 | Migration idempotent và có hướng dẫn đầu file | Đọc file: có DROP POLICY IF EXISTS / CREATE OR REPLACE / DROP TRIGGER IF EXISTS + comment hướng dẫn SQL Editor |
| 2 | middleware.ts tồn tại, chặn /admin trừ /admin/login; admin layout server kiểm tra role | Đọc file + build đạt (middleware/layout biên dịch trong build) |
| 2 | 2 API route đọc profile người gọi bằng service-role client sau khi xác thực token; create-user có whitelist role | Đọc diff 2 route |
| 3 | Cấu hình sanitize không còn object/embed | grep `object\|embed` trong src/lib/utils.ts — chỉ còn trong FORBID/danh sách cấm hoặc comment |
| 3 | Cả 7 điểm render nội dung qua dangerouslySetInnerHTML đều dùng sanitizeHtml | grep `dangerouslySetInnerHTML` toàn src, đối chiếu từng điểm |
| 4 | supabase_setup.sql không còn UPDATE auth.users; có CREATE TABLE services | grep `UPDATE auth.users` (0 kết quả), grep `CREATE TABLE IF NOT EXISTS services` |
| 5 | File rác đã xóa, bản public/ còn nguyên; có bằng chứng grep không tham chiếu trước khi xóa | git status + grep toàn repo trước xóa (ghi vào progress) |
| 6 | Không còn "Thôn Đông Hải"; không còn "Tỉnh Quảng Ninh"; không còn câu trực thuộc sai; không còn "Trung tâm Y tế huyện"/"xã Cái Bầu" chỉ hiện tại | grep từng chuỗi trong src + supabase_setup.sql |
| 6b | Các mục chờ Maco xác nhận chỉ grep, không sửa; vị trí file:line ghi vào progress | grep số cấp cứu, giờ làm việc, lịch tiêm, hero/Trạm trưởng (bảng ở progress) |
| 7 | Tự rà soát diff theo 4 trục, kết quả ghi vào progress | `git diff main` đọc toàn bộ |
| 8 | Nhánh đã push lên origin; git status sạch | `git push -u origin dot-1/bao-mat-thong-tin`; `git status` |

## Ranh giới và điểm cần hỏi trước

- Ngoài SCOPE (ghi lại, không tự làm): giờ làm việc thống nhất, lịch tiêm chủng, số cấp cứu chính thức, số liệu hero, tên Trạm trưởng, email lienhe@tramytecaibau.vn, nâng Next.js/@supabase/ssr (B4), profiles SELECT thu hẹp (S1 — chỉ ghi nhận: API route đã được sửa để không còn phụ thuộc vào nó), bỏ cơ chế ADMIN_EMAIL cứng (S3), security headers (S5), hợp nhất admin (S6), console.log production (N1/N2), form Hỏi đáp thiếu bảng questions (báo cáo 02).
- Hành động phải hỏi Maco trước (publish / deploy production / gửi đi / xóa): mở PR (điều phối chính làm), gộp nhánh, chạy migration trên Supabase live, deploy — TẤT CẢ ngoài WO này.
- Lưu ý vận hành ghi kèm bàn giao: sau khi migration chạy trên project live, cần (1) tắt đăng ký công khai trong Supabase Auth Dashboard, (2) bảo đảm có ít nhất một profile role='admin' (bootstrap bằng SQL Editor nếu chưa có) TRƯỚC khi áp chính sách mới, (3) kiểm thử bằng tài khoản editor.

## Completion checklist (dựng từ CHECKS, chốt ở cổng cuối)

- [x] Mọi output tồn tại và mở được
- [x] Mọi check chạy thành công với phiên bản mới nhất
- [x] Mọi lỗi đã sửa hoặc đã báo cáo rõ ràng
- [x] Rules file có rule mới từ lần chạy này (hoặc ghi rõ: không có) — Không có; repo chưa có rules file, đã ghi đề xuất trong progress.md
