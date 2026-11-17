# WO-WEB-27 — Checks (khung kiểm chứng, dùng khi WO được duyệt thực thi)

| Bước | Yêu cầu | Verdict | Evidence |
|---|---|---|---|
| ĐG1 | Hồ sơ đánh giá đủ: hiện trạng có bằng chứng, điểm vỡ theo file, rủi ro, phạm vi, khuyến nghị | pass | plan.md mục 1–6; số liệu phiên bản lấy từ package.json tại main và npm ngày 17/11/2026 |
| T1 | Diff chỉ gồm các file đã liệt kê trong plan mục 5 + hồ sơ WO | pass | push-files chỉ đẩy: package.json, package-lock.json, eslint.config.mjs, src/middleware.ts, src/lib/supabase.ts, src/app/admin/layout.tsx, src/app/tin-tuc/[slug]/page.tsx, src/app/thong-bao/[id]/page.tsx, harness/WO-WEB-27/ |
| T2 | npx tsc --noEmit sạch; npm run build sạch sau rm -rf .next | pass | 17/11/2026: TSC-CLEAN (sau khi chốt lucide-react ^0.577.0 vì bản 1.x bỏ icon thương hiệu); build Next 16 hoàn tất, đủ route. Kiểm chứng phụ tại máy Marley (bản build chạy local, dữ liệu Supabase thật): trang chủ 200, /tin-tuc 200, chi tiết bài viết 200, /gioi-thieu 200, /admin chuyển 307 về /admin/login (middleware @supabase/ssr chạy đúng), /admin/login 200 |
| T3 | Preview: trang chủ, /tin-tuc (danh sách, chi tiết, phân trang), /gioi-thieu, /thong-bao, /dich-vu, khu vực văn bản hiển thị đúng như Production hiện tại | pending | |
| T4 | Preview Admin: đăng nhập được bằng tài khoản admin, mở danh sách bài viết, mở trình soạn thảo TipTap, lưu thử một thay đổi trên môi trường kiểm thử | pending | |
| T5 | Production sau gộp: bộ hồi quy An (câu hỏi tiêm chủng tự nhiên, 10 ca WO-WEB-10, nguồn Đọc thêm WO-WEB-26) đạt như trước nâng cấp; các trang chính tải bình thường | pending | |
| T6 | Hoàn lưu sẵn sàng: ghi rõ mã PR và cách revert trước khi gộp | pending | |
