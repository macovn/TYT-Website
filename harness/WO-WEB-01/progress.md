# Progress — WO-WEB-01: Đợt 1 website Trạm Y tế Cái Bầu (bảo mật + thông tin + dọn rác)

Cập nhật sau mỗi giai đoạn. Phiên sau đọc rules file, plan.md và file
này trước khi tiếp tục.

## Plan

- Đã chọn / đã xong: Bước 0 (baseline), 1+4 (SQL: B1/B2/D + migration), 2 (middleware + admin layout + API routes), 3 (sanitize), 5 (dọn file rác), 6 (sửa thông tin đã rõ + grep mục chờ xác nhận), 7 (kiểm chứng cuối + tự rà soát diff).
- Đã chọn / đã xong: Bước 8 — đã push nhánh `dot-1/bao-mat-thong-tin` lên origin (5 commit nội dung + commit hồ sơ), working tree sạch. WO hoàn tất ở cổng harness: toàn bộ checks pass (xem checks.md). Chưa mở PR, chưa gộp, chưa chạy migration, chưa deploy — chờ điều phối chính và Maco.
- Bị chặn: Không.

## Outputs

- `sql/dot1-security-migration.sql` (MỚI) — migration idempotent cho project live: is_admin(), trigger khóa role, siết policy ghi bảng nội dung + messages + 3 bucket Storage, tạo bảng services nếu thiếu; comment đầu file có hướng dẫn chạy SQL Editor + bootstrap admin.
- `supabase_setup.sql` (SỬA) — nhất quán với migration: CREATE TABLE services, khối 9b (is_admin + protect_profile_role + trigger), policy ghi chuyển sang is_admin(), policy ghi cho services, messages SELECT/UPDATE/DELETE chỉ admin, storage write chỉ admin, seed posts sửa cột + bỏ "địa bàn xã", gỡ lệnh cập nhật auth.users cuối file.
- `src/middleware.ts` (MỚI) — chặn /admin/* (trừ /admin/login) khi chưa có phiên cookie; gắn x-pathname.
- `src/app/admin/layout.tsx` (MỚI) — layout server kiểm tra phiên + role ∈ {admin, editor}.
- `src/lib/supabase.ts` (SỬA) — client trình duyệt chuyển sang createClientComponentClient (phiên cookie); server giữ anon client.
- `src/app/api/create-user/route.ts`, `src/app/api/delete-user/route.ts` (SỬA) — đọc profile người gọi bằng service-role client; create-user thêm whitelist role.
- `src/lib/utils.ts` (SỬA) — sanitizeHtml thống nhất hai nhánh: bỏ object/embed, FORBID_TAGS/FORBID_ATTR, allowlist iframe (YouTube + *.supabase.co), siết allowedStyles phía server.
- File đã XÓA: `security_test.js`, `xss_test.ts`, `metadata.json`, `zalo_verifierHTEb3fpTAYzA_QOLlCqKJLZopc2qX1GuCZGm.html` (gốc), `src/app/zalo_verifierHTEb3fpTAYzA_QOLlCqKJLZopc2qX1GuCZGm.html`. Bản `public/zalo_verifier...html` giữ nguyên.
- Sửa nội dung (Bước 6): `src/components/Footer.tsx` (địa chỉ + dòng bản quyền), `src/components/Hero.tsx` (huy hiệu địa chỉ), `src/components/Header.tsx` (dòng phụ), `src/app/layout.tsx` (metadata description), `src/app/lien-he/page.tsx` (2 chỗ địa chỉ), `src/app/gioi-thieu/[slug]/page.tsx` (địa chỉ sidebar), `src/app/gioi-thieu/page.tsx` (câu trực thuộc + ô Trực thuộc), `src/app/hoi-dap/page.tsx` (2 thuật ngữ cũ), `src/app/thong-bao/page.tsx` ("xã Cái Bầu"), `src/app/dich-vu/page.tsx` và `src/components/ServicesSection.tsx` ("người dân trong xã"), `src/app/admin/page.tsx` (dữ liệu mẫu trong code: "xã Cái Bầu", "địa bàn xã").
- Hồ sơ: `harness/WO-WEB-01/plan.md`, `checks.md`, `progress.md`.

## Decisions

- **Căn cứ ủy quyền:** Maco duyệt phạm vi Đợt 1 lúc 07:13 ngày 27/10/2026; điều phối chính giao WO-WEB-01. Không mở PR, không gộp, không deploy, không đụng Supabase live.
- **Điểm khôi phục:** main @ 2565233, working tree sạch trước khi tạo nhánh `dot-1/bao-mat-thong-tin`.
- **B1 — cơ chế trigger:** trigger BEFORE INSERT OR UPDATE trên profiles (thay vì thu hồi quyền theo cột). Lý do: cưỡng chế tại DB cho mọi client gọi PostgREST; column-level REVOKE làm vỡ luồng service-role và khó bảo trì. Trigger cho qua service_role, phiên postgres/supabase_admin (SQL Editor — bootstrap admin), admin hiện hữu. Hệ quả: cơ chế ADMIN_EMAIL tự upsert role admin ở trang login ngừng tác dụng với tài khoản chưa có profile admin — đúng chủ đích đóng lỗ hổng; hướng dẫn bootstrap đã ghi trong đầu file migration.
- **B2 — chỉ admin:** theo đúng chữ WO, policy ghi chỉ cho `is_admin()`. Hệ quả: tài khoản role='editor' mất quyền ghi nội dung qua RLS sau khi migration áp lên project live. Không tự nới sang editor vì nếu project live có trigger tự tạo profile (handle_new_user, nhắc ở mục 11.5 của setup) gán role mặc định 'editor' cho tài khoản tự đăng ký, cho editor ghi sẽ tái mở lỗ hổng B2. Maco chốt riêng nếu muốn giữ editor đăng bài.
- **Middleware/layout:** phiên đăng nhập cũ lưu ở localStorage (supabase-js thuần) nên server không đọc được; đã chuyển client trình duyệt sang createClientComponentClient (auth-helpers đã có sẵn trong dependencies) để phiên lưu cookie. Hệ quả khi triển khai sau này: người dùng admin đang đăng nhập bằng phiên localStorage cũ sẽ phải đăng nhập lại một lần. Không chuyển hẳn sang @supabase/ssr (thuộc đợt nâng cấp B4).
- **Ngưỡng role ở admin layout:** {admin, editor} — khớp ngưỡng trang login hiện hành (login/page.tsx:68). Quản trị tài khoản vẫn chỉ admin qua API route.
- **Sanitize iframe:** allowlist gồm YouTube và *.supabase.co (PDF/tài liệu nhúng từ Storage của Trạm qua khối data-pdf-block trong Editor.tsx), thay vì chỉ YouTube như gợi ý ban đầu của báo cáo 01 — chặn cả supabase.co sẽ làm vỡ tính năng xem PDF hiện có. Thuật ngữ "giới hạn style phía client": giữ style vì DOMPurify tự làm sạch giá trị CSS; phía server đã siết bằng regex chặn url(/expression/javascript:.
- **Seed posts:** bản gốc INSERT vào cột category_id không tồn tại → sửa sang cột thật (category='news') trong phạm vi mục D; đồng thời bỏ chữ "địa bàn xã" trong nội dung seed.
- **package-lock.json:** file khóa trên main vốn lệch package.json (khóa chứa isomorphic-dompurify, jsdom, @types/jsdom không có trong package.json) nên `npm install` tự viết lại khóa. WO này khôi phục package-lock.json về nguyên trạng main để diff không lẫn thay đổi ngoài scope; việc đồng bộ khóa để ở đề xuất riêng.

## Tự rà soát diff 4 trục (Bước 7)

- **Đúng đắn (correctness):** Build đạt 25/25 trang tĩnh, đủ 28 dòng route như baseline; tsc 0 lỗi. Các route /admin/* chuyển từ tĩnh (○) sang động (λ) — hệ quả đúng thiết kế của layout server dùng headers/cookies. Middleware biên dịch thành công. Rủi ro còn lại không kiểm chứng được tại đây: hành vi đăng nhập thật với Supabase live (không có env thật, theo đúng giới hạn WO) — phải kiểm thử khi triển khai: đăng nhập admin, editor, phiên cookie được middleware/layout chấp nhận, API create/delete user.
- **Bảo mật:** Chuỗi khai thác B1 bị chặn ở 2 lớp (trigger khóa role + policy ghi theo is_admin). API route hết phụ thuộc policy SELECT profiles công khai. Sanitize: object/embed bị cấm tường minh ở client, tập thẻ server vốn không có; iframe bị khóa allowlist hai phía; srcdoc bị cấm. Điểm cần lưu ý: profiles SELECT vẫn công khai (S1 ngoài scope) — email/role của tài khoản quản trị vẫn lộ qua anon key cho tới khi xử lý ở WO sau; đã giảm tác hại nhờ API route không còn phụ thuộc vào nó.
- **Hiệu năng:** First Load JS các trang tăng nhẹ (~+4–6 kB) do auth-helpers; Middleware 202 kB (bundle supabase-js cho edge) chỉ chạy trên /admin/*. Trang công khai không chịu chi phí middleware. Không thay đổi nào ảnh hưởng tốc độ tải trang người dân ngoài mức tăng JS nêu trên.
- **Bảo trì:** SQL có một nguồn sự thật kép có chủ đích (setup cho project mới + migration cho project live) và đã đối chiếu nhất quán; mọi thay đổi đều có comment gắn mã WO-WEB-01 và lý do; không đổi tên route, không đổi cấu trúc thư mục ngoài 2 file mới (middleware, admin layout) và thư mục sql/.

## Open issues — CHỜ MACO XÁC NHẬN (chỉ grep, KHÔNG tự sửa)

### 1. Giờ làm việc — đang tồn tại 2 phiên bản
| Phiên bản | Vị trí file:line |
|---|---|
| 7:00 – 17:00 (T2–T6; sáng 7:00–11:30, chiều 13:30–17:00) | src/app/gioi-thieu/page.tsx:88, :89, :90 |
| Làm việc: 7:00 – 17:00 | src/app/gioi-thieu/[slug]/page.tsx:131 |
| T2-T6: 7:30–16:30 (kèm "T7 & CN: Cấp cứu 24/7" ở trang Liên hệ) | src/components/TopBar.tsx:19; src/components/Footer.tsx:39; src/app/page.tsx:41; src/app/lien-he/page.tsx:63 |

### 2. Lịch tiêm chủng — đang mâu thuẫn trực tiếp
| Nội dung | Vị trí file:line |
|---|---|
| "Ngày 18, 24, 25: 7:30–11:00" / "Ngày 18, 24, 25 hàng tháng" | src/app/dich-vu/page.tsx:15; src/app/gioi-thieu/page.tsx:92; src/components/ServicesSection.tsx:17; src/app/page.tsx:46 |
| "sáng thứ 4 hàng tuần" | src/app/hoi-dap/page.tsx:15 (câu FAQ); src/app/admin/page.tsx:155 (dữ liệu mẫu trong code admin) |

### 3. Hai số "cấp cứu" khác nhau — cần chốt số chính thức
| Số | Vị trí file:line |
|---|---|
| 0203.3822.115 (9 vị trí) | src/components/TopBar.tsx:25; src/components/Footer.tsx:31; src/components/ServicesSection.tsx:41; src/app/dich-vu/page.tsx:39; src/app/gioi-thieu/[slug]/page.tsx:122; src/app/hoi-dap/page.tsx:170; src/app/lien-he/page.tsx:61; src/app/page.tsx:56; src/app/tin-tuc/page.tsx:172 |
| 0203.3858.123 (1 vị trí) | src/app/thong-bao/page.tsx:181 |

### 4. Số liệu hero trang chủ và thông tin Trạm trưởng — chưa kiểm chứng
| Nội dung | Vị trí file:line |
|---|---|
| "3.000+" lượt khám | src/components/Hero.tsx:32 |
| "95%" tỷ lệ tiêm chủng | src/components/Hero.tsx:36 |
| "60+" cán bộ | src/components/Hero.tsx:40 |
| "đội ngũ 60+ cán bộ y tế… trên 2.000 hộ dân với hơn 8.000 nhân khẩu" | src/app/gioi-thieu/page.tsx:31 |
| "Trạm trưởng: BS. Nguyễn Văn An" | src/app/gioi-thieu/page.tsx:70 (và placeholder biểu mẫu "Ví dụ: BS. Nguyễn Văn An" tại src/app/admin/staff/page.tsx:265) |
| "Số cán bộ: 60+ người", "Phân hạng: Hạng IV" | src/app/gioi-thieu/page.tsx:71, :72 |

### 5. Việc vận hành phải làm khi áp migration lên project live (ngoài WO này)
- Tắt đăng ký công khai trong Supabase Auth Dashboard; đổi mật khẩu các tài khoản quản trị hiện có (báo cáo 01, mục 4.2).
- Kiểm tra hành vi trigger handle_new_user trên project live (tự tạo profile với role gì) trước khi áp migration.
- Bảo đảm có ít nhất một profile role='admin' trước khi chạy migration (bootstrap bằng SQL Editor theo hướng dẫn đầu file migration).
- Kiểm thử hồi quy sau migration: tài khoản thường không tự đổi được role; không phải admin thì không ghi được nội dung; admin đăng bài + tải file bình thường; đăng nhập lại admin/editor sau khi phiên chuyển sang cookie.

## Đề xuất ngoài SCOPE (ghi lại, chưa làm)

- S1: thu hẹp SELECT profiles (chỉ xem hồ sơ của mình; admin xem tất cả) — nay an toàn để làm vì API route đã hết phụ thuộc.
- S3: bỏ cơ chế ADMIN_EMAIL cứng ở client (login/page.tsx, admin/page.tsx và nhiều trang admin có "Hardcoded admin bypass") — role chỉ gán qua SQL/service role.
- S5: bổ sung security headers trong next.config.js.
- S6: hợp nhất /admin và /admin/dashboard trùng lặp.
- Đồng bộ lại package-lock.json với package.json (khóa đang chứa gói không khai báo) bằng một lần `npm install` có chủ đích ở WO riêng.
- Bổ sung `.next/`, `next-env.d.ts`, `tsconfig.tsbuildinfo` vào .gitignore (hiện chưa có, artifact build hiện thành file chưa theo dõi).
- Nâng Next.js 14.2.35 / chuyển @supabase/ssr (B4) — đợt riêng theo báo cáo 01.
- Form Hỏi đáp ghi vào bảng `questions` không có trong supabase_setup.sql (báo cáo 02) — cần quyết định tạo bảng hay chuyển sang messages.

## Rule mới đề xuất cho rules file

- Không có (repo chưa có rules file; đề xuất tạo AGENTS.md cho repo ở WO sau nếu Maco duyệt).

## Bước tiếp theo sẵn sàng

- Điều phối chính: mở PR từ nhánh dot-1/bao-mat-thong-tin, trình Maco duyệt.
- Sau khi Maco xác nhận 4 nhóm thông tin ở Open issues: mở WO đợt sửa nội dung tương ứng.
- Triển khai thật (chạy migration, deploy) là WO riêng, có lệnh riêng của Maco.
