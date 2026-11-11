# WO-WEB-20 — Progress

- Căn cứ: Maco chốt Phương án A ngày 11/11/2026 17:26 trong side chat GitHub, sau khi thu hẹp phạm vi: chỉ phối màu 4 thẻ truy cập nhanh trang chủ, template gốc không đổi (17:23 cùng ngày). Các bản phác thảo lại trang Tin tức v2/v3 bị bỏ, không triển khai.
- Nhánh: dot-2/wo-web-20-the-dich-vu-mau-a (từ main 674fb115).
- Đã làm: thêm 4 bộ màu .qa-blue/.qa-green/.qa-purple/.qa-red vào globals.css; gắn class vào 4 thẻ trong page.tsx và bỏ class màu cũ trên biểu tượng/dòng phụ của 4 thẻ. Chữ, liên kết, bố cục không đổi.
- Kiểm chứng: tsc sạch, build sạch (11/11/2026); T1, T2 pass. Preview PR #75 (https://tyt-website-jhg23sqgr-truong-nguyens-projects-08565b5c.vercel.app) đã kiểm chứng bằng mắt: 4 tông màu đúng Phương án A, biểu tượng đậm cùng tông, dòng phụ nguyên văn, bố cục không đổi; T3, T4 pass.
- ĐÃ ĐÓNG 11/11/2026: Maco xác nhận gộp 18:30; PR #75 gộp vào main (d8a32bd5); deployment Production thành công; kiểm chứng trực tiếp tramytecaibau.com: HTML có đủ 4 class qa-blue/qa-green/qa-purple/qa-red, đủ 4 tiêu đề thẻ và số cấp cứu, CSS bản thật chứa đủ 4 mã màu nền. Hồ sơ đóng bằng PR giấy tờ riêng như thông lệ.
