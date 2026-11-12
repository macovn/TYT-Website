# WO-WEB-22: Bỏ trùng thông tin buổi tiêm trong Hero

- TASK: Maco chỉ ra 12/11/2026: buổi tiêm dự kiến gần nhất đang hiện 2 nơi trên cùng Hero (dòng trạng thái dưới nút bấm và khối Tiêm chủng mở rộng ở thẻ phải). Anh chốt: bỏ ngày tiêm khỏi dòng trạng thái, giữ duy nhất ở thẻ Tiêm chủng.
- OUTPUT: src/components/Hero.tsx; hồ sơ harness/WO-WEB-22/.
- CHECKS: xem checks.md (T1 phạm vi diff, T2 tsc + build, T3 Preview bằng mắt: dòng trạng thái chỉ còn tình trạng mở cửa, khối Tiêm chủng vẫn hiện ngày dự kiến, không vỡ bố cục).
- SOURCES: ảnh chụp Hero sáng 12/11/2026 Maco khoanh hai vị trí trùng; quyết định của Maco 06:49 cùng ngày.
- SCOPE: chỉ Hero.tsx + hồ sơ WO. Không đổi thẻ Tiêm chủng, không đổi nội dung khác.
- LIMIT: tối đa 3 vòng sửa; gộp main chỉ khi Maco xác nhận riêng.

## Thay đổi
- Dòng trạng thái dưới hai nút bấm: chỉ render vế tình trạng mở cửa hôm nay, bỏ toàn bộ vế "Buổi tiêm chủng dự kiến gần nhất...". Điều kiện render không còn phụ thuộc dotDau.
- Khối Tiêm chủng mở rộng ở thẻ phải: giữ nguyên như WO-WEB-21.
