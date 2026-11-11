# WO-WEB-21 — Checks

| Bước | Yêu cầu | Verdict | Evidence |
|---|---|---|---|
| T1 | Diff chỉ gồm Hero.tsx và hồ sơ WO | pass | push-files chỉ đẩy src/components/Hero.tsx và harness/WO-WEB-21/ |
| T2 | npx tsc --noEmit sạch; npm run build sạch | pass | 11/11/2026: TSC-CLEAN; build hoàn tất không lỗi sau rm -rf .next |
| T3 | Hàm tính buổi tiêm pass kiểm thử ngoại tuyến: 11/11/2026 cho buổi đầu 18/11/2026 còn 7 ngày; đúng ngày tiêm thì còn 0; qua 25 thì sang tháng sau; không buổi nào rơi Thứ 7/Chủ nhật; qua năm mới vẫn đúng | pass | Kiểm thử node 11/11/2026: 7 ca đích danh đều pass (gồm tháng 01/2026 cả ba ngày đều cuối tuần nên bỏ cả tháng, buổi đầu 18/02/2026) và quét tính chất 400 ngày liên tiếp pass (đúng tập ngày, không cuối tuần, tăng dần) |
| T4 | Preview bằng mắt: dòng trạng thái hiện đúng cả hai vế, khối Tiêm chủng hiện ngày dự kiến gần nhất, bố cục Hero không vỡ | pass | Kiểm chứng bằng mắt trên Preview PR #77 ngày 11/11/2026 lúc 21:14: dòng trạng thái nguyên văn "Hôm nay đã hết giờ làm việc. Buổi tiêm chủng dự kiến gần nhất: Thứ 4, ngày 18/11/2026 (còn 7 ngày)." với chấm đỏ đúng ngoài giờ; khối Tiêm chủng hiện cùng ngày dự kiến và dòng phụ lịch cố định; không vỡ bố cục |
| T5 | Nội dung cũ không đổi: tiêu đề, mô tả, hai nút, giờ 7:30–16:30, số cấp cứu 0203.3822.115 | pass | Cùng lượt kiểm chứng Preview: thẻ phải còn đủ Giờ làm việc, Thứ 2 – Thứ 6, 7:30 – 16:30, Trực cấp cứu 24/7 và 0203.3822.115; tiêu đề và hai nút không đổi |
