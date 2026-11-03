# WO-WEB-16: Nhật ký thực hiện và kết quả kiểm chứng

- PR 62 đã merge (8a2a6890) theo xác nhận của Maco ngày 04/11/2026. Thang viết lại hoạt động đúng cả hai nhánh trên Production:
  - Nhánh giữ bản gốc kèm cờ: ca liệt kê nhóm A, B, C ghi cờ vuot-tran-do-dai ở các mức 352, 364 từ; ca T40 ghi cờ 319 từ.
  - Nhánh dùng bản viết lại: nhiều lượt liệt kê dài được rút gọn đạt kiểm tra bảo toàn, ví dụ 343 xuống 297 từ, 321 xuống 298 từ, 320 xuống 283 từ; văn bản cuối luôn kết thúc bằng câu hoàn chỉnh (đã đọc trực tiếp phần đuôi của bốn lượt liên tiếp).
- T40 đạt trọn vẹn: đầu ra cuối giữ đủ dấu hiệu nguy hiểm (khó thở, sốt cao), đủ cả hai số điện thoại của Trạm, kết thúc câu hoàn chỉnh, vượt trần nên nhật ký có cờ đúng thiết kế.
- T30 đạt: danh mục vắc xin nguyên vẹn ở 206 từ, thang không cần kích hoạt, số điện thoại và hành động tiếp theo còn nguyên.
- Hồi quy: 9 cách hỏi vắc xin 9/9, T08 và T24 giữ nguyên, T41 đạt, độ trễ ca thường 3,1 đến 3,2 giây (ca kích hoạt thang khoảng 9,5 đến 10,3 giây do thêm một lượt mô hình, đúng chi phí đã chấp nhận trong thiết kế).
- Quan sát ngoài phạm vi, ghi nhận để theo dõi: với câu hỏi đòi liệt kê cả 81 bệnh nhóm A, B, C trong một câu trả lời, tầng truy xuất không đưa đủ năm đoạn của Quyết định 1965 vào ngữ cảnh (giới hạn ba đoạn mỗi văn bản và năm đoạn chọn), nên mô hình liệt kê nhóm A và một phần nhóm B rồi thừa nhận chưa đủ dữ liệu cho nhóm C thay vì bịa. Hỏi theo từng nhóm thì trả đủ, như ca nhóm A đã chứng nhận. Đây là giới hạn truy xuất có từ trước, không thuộc WO này.
- TRẠNG THÁI: WO-WEB-16 ĐÃ ĐÓNG ngày 04/11/2026. WO tiếp theo theo Chỉ đạo là WO-WEB-15C (mã hội thoại và ghi nhật ký v2), chờ Maco xác nhận triển khai.
