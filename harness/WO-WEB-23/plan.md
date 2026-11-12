# WO-WEB-23: Bỏ hẳn dòng trạng thái dưới nút bấm trong Hero

- TASK: Maco lệnh 12/11/2026 07:37: bỏ hẳn dòng trạng thái dưới hai nút bấm ở cột trái Hero (dòng "Đang mở cửa, đến 16:30."). Lý do hiển nhiên: sau WO-WEB-22 dòng này chỉ còn tình trạng mở cửa, mà tình trạng đó đã có sẵn ở đầu thẻ phải ("Đang mở cửa" kèm chấm xanh cạnh Giờ làm việc), nên vẫn là trùng lặp.
- OUTPUT: src/components/Hero.tsx; hồ sơ harness/WO-WEB-23/.
- CHECKS: xem checks.md (T1 phạm vi diff, T2 tsc + build, T3 Preview bằng mắt: không còn dòng trạng thái dưới nút bấm, thẻ phải nguyên vẹn gồm trạng thái mở cửa, lịch tiêm động, số cấp cứu).
- SOURCES: ảnh chụp Hero 12/11/2026 07:37 Maco khoanh dòng trạng thái; mã Hero.tsx hiện tại.
- SCOPE: chỉ Hero.tsx + hồ sơ WO. Xóa phần tử dòng trạng thái và các biến chỉ còn dùng cho nó (veMoCua, homNay, laNgayLamViec). Giữ nguyên trạng thái mở cửa ở thẻ phải, hàm tinhTrangThaiMoCua, tính buổi tiêm và mọi nội dung khác.
- LIMIT: tối đa 3 vòng sửa; gộp main chỉ khi Maco xác nhận riêng.
