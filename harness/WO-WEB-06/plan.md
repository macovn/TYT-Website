# WO-WEB-06: Bot hỗ trợ người dân trên website Trạm

- Nguồn lệnh: Maco, 29/10/2026 ("Giờ anh muốn phát triển Bot Hỗ trợ người dân trên Web"); Maco duyệt cả 3 đề xuất của Marley cùng ngày: (1) persona "An" + DeepSeek chính, Gemini dự phòng như Bot Zalo; (2) kho tri thức chỉ gồm nội dung công khai của website + bộ câu hỏi thường gặp; (3) lưu nhật ký câu hỏi của người dân (không lưu thông tin cá nhân) để Trạm nắm nhu cầu.
- Nhánh: dot-2/bot-ho-tro-nguoi-dan (từ main e7e61af).

## Phạm vi

1. Widget chat nổi trên mọi trang công khai (ẩn trong khu /admin): nút góc phải dưới, cửa sổ chat, câu hỏi gợi ý nhanh, dải số cấp cứu cố định.
2. API route POST /api/chat (phía server): sàng lọc khẩn cấp bằng từ khóa trước khi gọi AI (trả lời khẩn cấp xác định, không phụ thuộc AI); truy xuất bài viết liên quan trên website theo từ khóa tiêu đề để làm ngữ cảnh + trả nguồn tham khảo; gọi DeepSeek (deepseek-chat), lỗi thì chuyển Gemini (gemini-2.5-flash); thiếu khóa thì trả trạng thái chưa cấu hình một cách êm.
3. Kho tri thức đợt 1: thông tin chính thức của Trạm (đã chốt 27-29/10/2026) + bộ FAQ soạn tay trong mã nguồn; ngữ cảnh động từ bảng posts công khai. Không dùng kho văn bản nội bộ của Bot Zalo.
4. Bảng chat_logs (Supabase): lưu câu hỏi, câu trả lời, nhà cung cấp đã trả lời, thời gian; chỉ service role truy cập (bật RLS, không policy công khai); API route ghi bằng service role key sẵn có trên Vercel.
5. Rào an toàn trong prompt hệ thống: không chẩn đoán, không kê đơn, không bịa lịch/thủ tục ngoài dữ liệu đã nạp, khuyên đến Trạm khám khi cần, nêu số cấp cứu khi khẩn cấp.

## Ngoài phạm vi

- Tìm kiếm ngữ nghĩa bằng vector (đợt sau nếu cần).
- Trang quản trị xem nhật ký chat trong dashboard (đợt này xem qua Supabase; đề xuất WO nối tiếp).
- Đặt lịch hẹn, tra cứu kết quả khám.

## Phụ thuộc ngoài

- Maco tự nhập 2 khóa API (DEEPSEEK_API_KEY, GEMINI_API_KEY) vào Environment Variables của dự án Vercel, giống cách đã làm với Bot Zalo; Marley mở sẵn trang cấu hình và hướng dẫn. Chưa có khóa thì bot vẫn lên sóng ở trạng thái "đang cấu hình" với thông điệp êm + số điện thoại Trạm.
- Endpoint và model DeepSeek/Gemini dùng đúng cấu hình đã kiểm chứng ở Bot Zalo (deepseek-chat, gemini-2.5-flash).

## Nguyên tắc khóa

- Khóa API chỉ ở biến môi trường phía server, tuyệt đối không đưa vào mã nguồn hay phía trình duyệt.
- Không lưu thông tin cá nhân của người hỏi (không IP, không định danh) trong chat_logs.
- Câu trả lời hiển thị dạng văn bản thuần, không render HTML từ AI (chống XSS).
