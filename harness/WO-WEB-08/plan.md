# WO-WEB-08: Cập nhật hiệu lực kho tri thức tiêm chủng của Bot An

- Nguồn lệnh: lượt rà soát kho tri thức 02/11/2026 phát hiện 3 văn bản trong kho của An đã hết hiệu lực; Maco duyệt xử lý kho website cùng nhịp với kho Zalo lúc 08:00 ngày 02/11/2026.
- Nhánh: dot-2/wo-web-08-kho-tiem-chung (hồ sơ + SQL; thay đổi chủ yếu là dữ liệu Supabase).

## Phát hiện pháp lý (bằng chứng: sổ kho-tri-thuc-status.md của dự án Bot Zalo)

- Luật 03/2007/QH12 hết hiệu lực từ 01/7/2026, thay bằng Luật Phòng bệnh 114/2025/QH15 (khoản 2 Điều 45 Luật 114/2025).
- NĐ 104/2016/NĐ-CP và NĐ 13/2024/NĐ-CP hết hiệu lực từ 01/7/2026 theo khoản 4 Điều 94 NĐ 165/2026/NĐ-CP; riêng Điều 9, 10, 11 của NĐ 104 (điều kiện cơ sở/điểm tiêm chủng, thủ tục công bố đủ điều kiện) còn hiệu lực đến hết 30/6/2027 theo khoản 5 Điều 94 NĐ 165/2026/NĐ-CP.

## Phạm vi

1. Sao lưu toàn bộ 321 đoạn bot_chunks hiện tại ra ~/workspace/backups/ trước mọi thay đổi.
2. Nạp văn bản mới: Luật Phòng bệnh 114/2025/QH15 (toàn văn, cắt theo Điều/mục bằng loader hiện hữu) và NĐ 165/2026/NĐ-CP (chỉ phần điều khoản về tiêm chủng/phòng bệnh liên quan + Điều 94, từ bản scan ký số qua OCR; phạm vi cắt ghi rõ trong progress.md).
3. Gỡ toàn bộ đoạn LUAT-03-2007 và ND-13-2024; NĐ 104/2016 chỉ giữ 6 đoạn thuộc Điều 9, 10, 11, chèn ghi chú áp dụng chuyển tiếp vào đầu đoạn đầu của mỗi Điều.
4. Các văn bản NQ-104-2022, TT-13-2026, TT-51-2017, QD-1575-2023, QD-2780-2025 giữ nguyên từng đoạn.
5. Tuyến nạp giữ đúng WO-WEB-07: tạm cấp EXECUTE hàm add_bot_chunk cho anon, nạp bằng loader, xong THU HỒI ngay (chỉ còn service_role); đếm lại khớp từng văn bản.
6. Kiểm chứng live sau nạp: 5 câu (a)-(e) trong checks.md.

## Ngoài phạm vi

- Sửa code truy xuất/prompt (chỉ làm khi kiểm chứng live cho thấy dữ liệu đúng mà truy xuất sai, và khi đó đi nhánh + PR riêng).
- Thay đổi các kho tri thức khác của An ngoài cụm tiêm chủng.

## Nguyên tắc khóa

- Không xóa dữ liệu khi chưa có sao lưu đã kiểm chứng đếm khớp.
- Nội dung NĐ 104 còn giữ phải luôn đi kèm ghi chú chuyển tiếp; không trình bày NĐ 104 như văn bản còn hiệu lực toàn bộ.
