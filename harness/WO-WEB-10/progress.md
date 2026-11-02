# WO-WEB-10 Progress

## 02/11/2026 chiều: tích hợp quy trình tư vấn vào prompt An (Marley)

- Nhận hai phần quy trình từ Maco (15:08 phần 1-2; 15:09 phần 3-6). Đối chiếu hệ thống hiện tại: nhánh cấp cứu đã có lớp xác định trước AI (mạnh hơn mức prompt), nhánh chuyên môn và thiếu dữ liệu đã có rào cơ bản trong QUY TẮC BẮT BUỘC; phần mới chủ yếu là khung 5 bước, tiêu chuẩn đầu ra và các nguyên tắc vận hành.
- Đã viết lại phần đầu của buildSystemPrompt trong src/lib/bot-knowledge.ts: thêm mục QUY TRÌNH TƯ VẤN BẮT BUỘC (5 bước, dạng trình tự tư duy linh hoạt), CÁC NHÁNH XỬ LÝ ĐẶC BIỆT (cấp cứu, chuyên môn, thiếu dữ liệu), TIÊU CHUẨN ĐẦU RA; bổ sung vào quy tắc cũ các điểm: không thu thập dữ liệu cá nhân, không tiết lộ thông tin sức khỏe người khác, tránh thuật ngữ khó, không quảng cáo/thúc ép, một lượt một vấn đề, trần khoảng 250 từ.
- Điều hòa một điểm: quy tắc cũ cấm nhắc việc là AI được cụ thể hóa thành "không tự giới thiệu là AI; riêng nhánh chuyên môn thì nói rõ em chỉ là trợ lý hỗ trợ thông tin, không thay thế thăm khám" theo đúng phần 3 Maco ban hành.
- Bổ sung EMERGENCY_KEYWORDS: "mất ý thức", "mat y thuc", "chảy máu nghiêm trọng", "chay mau nghiem trong".

## Kiểm chứng live sau gộp PR #40 (Marley, 02/11/2026)

- PR code #40 (merge bf9a49c) đã gộp chiều 02/11/2026; thăm dò bản live bằng câu mơ hồ cho thấy hành vi mới xuất hiện ở lượt thăm dò thứ 4.
- Bộ kiểm chứng hành vi 10 ca đạt toàn bộ (chi tiết tại checks.md mục 4-10): câu mơ hồ nhận đúng một câu hỏi lựa chọn; câu loại vắc xin giữ nguyên chất lượng dữ liệu của WO-WEB-09 và có thêm khung tư vấn; ca lo lắng, chi phí (dẫn Điều 48 NĐ 165/2026), hai ca chuyên môn, ca thiếu dữ liệu đều xử lý đúng nhánh; ca "mất ý thức" đi đường rule-emergency; hội thoại hai lượt không hỏi lại.
- Điểm chưa hoàn hảo duy nhất: ca xét nghiệm mở đầu lỡ xưng "Chào em" một lần (lỗi xưng hô của mô hình ở một lượt đơn lẻ, phần còn lại đúng anh/chị); ghi nhận để theo dõi, chưa cần can thiệp prompt riêng.
- WO-WEB-10 đóng toàn bộ: tích hợp quy trình, kiểm chứng live.
