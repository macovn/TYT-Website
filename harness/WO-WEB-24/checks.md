# WO-WEB-24 — Checks

| Bước | Yêu cầu | Verdict | Evidence |
|---|---|---|---|
| T1 | Diff chỉ gồm Footer.tsx và hồ sơ WO | pass | push-files chỉ đẩy src/components/Footer.tsx và harness/WO-WEB-24/; grep sau sửa: Tim Berners-Lee còn đúng 1, tên cũ còn 0 |
| T2 | npx tsc --noEmit sạch; npm run build sạch | pass | 14/11/2026: TSC-CLEAN; build hoàn tất không lỗi sau rm -rf .next |
| T3 | Preview bằng mắt: chân trang hiện "Thiết kế bởi: Tim Berners-Lee", không còn tên cũ; bố cục chân trang không vỡ | pending | |
