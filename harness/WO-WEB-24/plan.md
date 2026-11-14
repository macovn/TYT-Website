# WO-WEB-24: Sửa dòng ghi công ở chân trang

- TASK: Maco lệnh 14/11/2026: sửa dòng chân trang "Thiết kế bởi: Trương Thái Nguyên và Cộng sự" thành "Thiết kế bởi: Tim Berners-Lee".
- OUTPUT: src/components/Footer.tsx; hồ sơ harness/WO-WEB-24/.
- CHECKS: xem checks.md (T1 phạm vi diff, T2 tsc + build, T3 Preview bằng mắt: chân trang hiện đúng dòng mới, không còn dòng cũ).
- SOURCES: lệnh của Maco 14/11/2026; Footer.tsx dòng 102 hiện tại.
- SCOPE: chỉ thay tên trong dòng ghi công ở Footer.tsx + hồ sơ WO. Không đổi bố cục, màu sắc hay nội dung khác của chân trang.
- LIMIT: tối đa 3 vòng sửa; gộp main chỉ khi Maco xác nhận riêng.
