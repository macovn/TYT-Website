# WO-WEB-23 — Checks

| Bước | Yêu cầu | Verdict | Evidence |
|---|---|---|---|
| T1 | Diff chỉ gồm Hero.tsx và hồ sơ WO | pass | push-files chỉ đẩy src/components/Hero.tsx và harness/WO-WEB-23/; grep sau sửa: veMoCua còn 0, nhãn Đang mở cửa còn đúng 1 (ở thẻ phải) |
| T2 | npx tsc --noEmit sạch; npm run build sạch | pass | 12/11/2026: TSC-CLEAN; build hoàn tất không lỗi sau rm -rf .next |
| T3 | Preview bằng mắt: dưới hai nút bấm không còn dòng trạng thái; thẻ phải còn đủ trạng thái Đang mở cửa, buổi tiêm dự kiến, giờ 7:30–16:30, số 0203.3822.115; bố cục không vỡ | pass | Kiểm chứng bằng mắt trên Preview PR #81 ngày 12/11/2026 lúc 07:46: dưới hai nút bấm trống hoàn toàn; thẻ phải còn nhãn Đang mở cửa kèm chấm xanh, buổi tiêm dự kiến 18/11/2026 (còn 6 ngày), giờ và số cấp cứu nguyên vẹn; không vỡ bố cục |
