# WO-WEB-22 — Checks

| Bước | Yêu cầu | Verdict | Evidence |
|---|---|---|---|
| T1 | Diff chỉ gồm Hero.tsx và hồ sơ WO | pass | push-files chỉ đẩy src/components/Hero.tsx và harness/WO-WEB-22/; grep sau sửa: cụm của dòng trạng thái "Buổi tiêm chủng dự kiến gần nhất" còn 0, cụm của thẻ "Buổi tiêm dự kiến gần nhất" còn đúng 1 |
| T2 | npx tsc --noEmit sạch; npm run build sạch | pass | 12/11/2026: TSC-CLEAN; build hoàn tất không lỗi sau rm -rf .next |
| T3 | Preview bằng mắt: dòng trạng thái chỉ còn tình trạng mở cửa hôm nay, không còn ngày tiêm; khối Tiêm chủng vẫn hiện buổi dự kiến gần nhất; bố cục Hero không vỡ | pass | Kiểm chứng bằng mắt trên Preview PR #79 ngày 12/11/2026 lúc 06:57: dòng trạng thái nguyên văn "Hôm nay Trạm mở cửa từ 7:30." không còn ngày tiêm; khối Tiêm chủng vẫn hiện "Buổi tiêm dự kiến gần nhất: Thứ 4, ngày 18/11/2026 (còn 6 ngày)."; giờ làm việc và số cấp cứu nguyên vẹn; không vỡ bố cục |
