# WO-WEB-07 Progress

- 29/10/2026: Maco chốt bỏ mục 8, nạp 8 văn bản. Đã lập plan.md, checks.md; nhánh dot-2/kho-tri-thuc-tiem-chung từ main dbabfd7d.
- Nguồn nạp: ~/workspace/kho-tri-thuc-an/tiem-chung/*.txt (8 tệp, 306.405 ký tự theo manifest đã kiểm chứng).

- 29/10 21:57: Bảng bot_chunks + policy SELECT công khai + hàm add_bot_chunk tạo xong trên Supabase (kiểm chứng 0 dòng, RLS bật).
- 29/10 22:03: Nạp đủ 321/321 đoạn, 0 lỗi; đếm lại qua REST khớp từng văn bản. Đã giao lệnh thu hồi quyền EXECUTE của anon (chỉ còn service_role) trên SQL Editor.
- Thuật toán truy xuất: thử 3 bản trên dữ liệu thật, chốt bản cụm 2 âm tiết + IDF + khử trùng theo Điều/mục (chi tiết trong checks.md). Prompt bổ sung quy tắc nêu căn cứ văn bản khi trả lời từ kho; widget hiển thị nguồn dạng "Căn cứ: ..." khi không có link.
- Build đạt. Chuẩn bị PR.

- 29/10 22:21: SQL Editor xác nhận thu hồi quyền ghi của anon xong và đếm lại đủ 321 đoạn.
- 29/10: PR #33 merged (1e784d6b). Live E2E đạt: câu bệnh bắt buộc dẫn đúng Điều 3 TT 13/2026 với đủ 14 bệnh; câu điều kiện cơ sở dẫn đúng Điều 9 NĐ 104/2016; câu phản vệ dẫn TT 51/2017 và giữ giới hạn an toàn; sốt xuất huyết không báo động giả. WO-WEB-07 HOÀN TẤT.
- Hạn chế còn lại: danh sách nguồn bài viết đôi lúc còn một bài lạc nhẹ (khớp âm tiết ở tiêu đề, ví dụ bài Ngày Quốc tế Điều dưỡng ở câu điều kiện cơ sở); câu trả lời không bị ảnh hưởng. Có thể nâng cấp sau bằng cách áp IDF cho cả bài viết nếu Maco yêu cầu.
