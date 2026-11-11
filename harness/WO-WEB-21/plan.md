# WO-WEB-21: Dòng trạng thái sống và lịch tiêm động trong Hero trang chủ

- TASK: Theo lựa chọn của Maco (11/11/2026 20:37): thêm dòng trạng thái sống và lịch tiêm động vào khu vực Hero trang chủ. Bố cục Hero giữ nguyên; chỉ thêm một dòng trạng thái dưới hai nút bấm ở cột trái và làm động khối Tiêm chủng mở rộng ở thẻ phải.
- OUTPUT: src/components/Hero.tsx; hồ sơ harness/WO-WEB-21/.
- CHECKS: xem checks.md (T1 phạm vi diff, T2 tsc + build, T3 kiểm thử ngoại tuyến hàm tính buổi tiêm gồm ca biên cuối tuần/cuối tháng/cuối năm, T4 kiểm chứng Preview bằng mắt, T5 nội dung cũ của Hero không đổi).
- SOURCES: ảnh Hero Maco khoanh 11/11/2026 19:22; thuật toán buổi tiêm đã chứng nhận của Bot An tại src/app/api/chat/route.ts (buildScheduleLines, WO-WEB-12): ngày cố định 18, 24, 25, loại Thứ 7 và Chủ nhật, ngày gọi là DỰ KIẾN, không khẳng định về ngày lễ vì không có dữ liệu.
- SCOPE: chỉ Hero.tsx + hồ sơ WO. Không đổi bố cục, tiêu đề, mô tả, nút bấm, giờ làm việc, khối cấp cứu.
- LIMIT: tối đa 3 vòng sửa mỗi bước; gộp main chỉ khi Maco xác nhận riêng.

## Thiết kế
- Hàm tinhDotTiem(now): lấy ngày hiện tại theo Asia/Bangkok (Intl, giống An), duyệt tối đa 4 tháng kể từ tháng hiện tại, gom 3 buổi đầu tiên thuộc {18, 24, 25} không trùng Thứ 7/Chủ nhật, buổi đầu tiên từ hôm nay trở đi. Trả về kèm số ngày còn lại tới buổi đầu tiên.
- Dòng trạng thái (cột trái, dưới hai nút): chấm màu + một câu gồm hai vế: tình trạng mở cửa hôm nay (đang mở cửa đến 16:30 / mở cửa lúc 7:30 / đã hết giờ / hôm nay nghỉ cuối tuần) và buổi tiêm dự kiến gần nhất kèm "(hôm nay)" / "(ngày mai)" / "(còn N ngày)". Cập nhật cùng nhịp 60 giây với trạng thái mở cửa hiện có.
- Khối Tiêm chủng mở rộng (thẻ phải): dòng chính thành "Buổi tiêm dự kiến gần nhất: Thứ X, ngày D/M/YYYY (còn N ngày)"; dòng phụ giữ quy tắc lịch cố định và ghi rõ ngày chính thức theo thông báo tháng của Trạm.
- Kỷ luật khẳng định: luôn gọi là ngày/buổi DỰ KIẾN như Bot An; không loại ngày lễ vì không có dữ liệu lịch nghỉ.
