# WO-WEB-07: Kho tri thức văn bản tiêm chủng cho Bot An + nâng cấp truy xuất

- Nguồn lệnh: Maco 29/10/2026 giao nạp hệ thống văn bản tiêm chủng (9 văn bản); kết quả thu thập 8/9 đạt (306.405 ký tự toàn văn tại ~/workspace/kho-tri-thuc-an/tiem-chung/); riêng mục 8 (4374/QĐ-BYT) không khớp mô tả, Maco chốt BỎ mục 8, nạp trước 8 văn bản.
- Nhánh: dot-2/kho-tri-thuc-tiem-chung.

## Phạm vi

1. Bảng bot_chunks trên Supabase (doc_code, doc_title, section, content, ord): RLS bật, policy SELECT công khai (nội dung là văn bản pháp luật đã công bố), không policy ghi công khai.
2. Cắt 8 tệp txt thành đoạn theo Điều/mục (giữ nhãn Điều làm section), đoạn dài cắt tiếp theo Khoản, tối đa khoảng 1.200 ký tự mỗi đoạn. Nạp qua hàm rpc add_bot_chunk SECURITY DEFINER cấp quyền tạm cho anon trong lúc nạp, nạp xong THU HỒI quyền (chỉ còn service_role) để chống nạp rác vào kho.
3. Nâng cấp truy xuất trong /api/chat thành chấm điểm xếp hạng dùng chung: đoạn pháp luật (khớp section x3, doc_title x2, content x1; lấy tối đa 4 đoạn, ngưỡng điểm tối thiểu) và bài viết (title x3, content x1; ngưỡng cao hơn để hết nhiễu từ chung chung). Ngữ cảnh đoạn pháp luật kèm trích dẫn tên văn bản + Điều; prompt yêu cầu nêu căn cứ văn bản khi trả lời từ kho.
4. Widget: nguồn tham khảo dạng văn bản (không có link) hiển thị dạng chữ thường thay vì liên kết.

## Ngoài phạm vi

- Tìm kiếm vector/ngữ nghĩa.
- Nạp thêm lĩnh vực khác ngoài tiêm chủng (làm theo cùng khuôn khi Maco giao tiếp).
- Văn bản mục 8 (đã bỏ theo lệnh Maco).

## Nguyên tắc khóa

- Toàn văn dùng để nạp là bản đã kiểm chứng ở bước thu thập (manifest trong thư mục kho).
- Không mở quyền ghi công khai vào bot_chunks sau khi nạp xong.
