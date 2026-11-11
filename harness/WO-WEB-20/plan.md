# WO-WEB-20: Phối màu 4 thẻ truy cập nhanh trang chủ (Phương án A)

- TASK: Áp Phương án A (Maco chốt 11/11/2026, 17:26) cho 4 thẻ QUICK ACCESS ở trang chủ: mỗi thẻ một nền màu nhạt riêng, biểu tượng và dòng phụ đậm/nhạt cùng tông. Template gốc, bố cục, chữ, biểu tượng, liên kết giữ nguyên.
- OUTPUT: src/app/page.tsx (thêm class biến thể cho 4 thẻ), src/app/globals.css (4 bộ màu .qa-*), hồ sơ harness/WO-WEB-20/.
- CHECKS: xem checks.md (T1 phạm vi diff, T2 tsc + build, T3 kiểm chứng Preview bằng mắt, T4 chữ và liên kết không đổi).
- SOURCES: ảnh chụp 4 thẻ gốc Maco gửi 11/11/2026 17:23; bản phác thảo ~/workspace/mockup-tin-tuc/phac-thao-4-the-mau.html (Phương án A); mã gốc src/app/page.tsx dòng 38-63 và .quick-item tại src/app/globals.css dòng 235-246.
- SCOPE: chỉ 2 file mã trên + hồ sơ WO. Không đổi nội dung, liên kết, thứ tự thẻ, không đụng trang Tin tức hay thành phần khác.
- LIMIT: tối đa 3 vòng sửa mỗi bước; gộp vào main chỉ khi Maco xác nhận riêng.

## Bảng màu Phương án A
- Khám bệnh (qa-blue): nền #EAF2FB, viền #C9DFF5, biểu tượng #1D6FB8, chữ phụ #5F7A94, hover viền #1D6FB8.
- Tiêm chủng (qa-green): nền #E7F4EE, viền #BFE3D2, biểu tượng #0C6B58, chữ phụ #5B7A6C, hover viền #0C6B58.
- Tư vấn sức khỏe (qa-purple): nền #F3EDFB, viền #DCCFF5, biểu tượng #6B4FC4, chữ phụ #7A6E9C, hover viền #6B4FC4.
- Cấp cứu 24/7 (qa-red): nền #FDECEA, viền #F5C6C0, biểu tượng #B42318, chữ phụ #9C6E68, hover viền #B42318.

## Các bước
1. Lập hồ sơ plan/checks (file này).
2. Sửa globals.css: thêm 4 bộ quy tắc .quick-item.qa-* sau dòng .quick-item:hover; tiêu đề thẻ giữ màu mực gốc.
3. Sửa page.tsx: thêm class qa-* cho 4 thẻ Link, bỏ class màu cũ trên biểu tượng và dòng phụ của 4 thẻ (màu do CSS biến thể quyết định).
4. Cổng build: npx tsc --noEmit; rm -rf .next && npm run build.
5. Tạo nhánh dot-2/wo-web-20-the-dich-vu-mau-a, đẩy file, mở PR.
6. Kiểm chứng trên Preview của PR (bằng mắt: 4 tông màu đúng, chữ/liên kết nguyên vẹn), báo cáo trước gộp kèm nút chốt, chờ Maco xác nhận riêng mới gộp.
