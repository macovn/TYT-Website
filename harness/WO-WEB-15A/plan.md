# WO-WEB-15A: Đưa toàn văn đoạn tri thức vào ngữ cảnh

- Nguồn lệnh: Chỉ đạo phê duyệt và triển khai Bot An V1.1 của Maco ngày 03/11/2026; thứ tự triển khai: WO-WEB-12 (đã đóng), WO-WEB-15A, WO-WEB-14, WO-WEB-13, WO-WEB-15D, WO-WEB-15B, WO-WEB-16, WO-WEB-15C.
- Xử lý phát hiện F5 (Báo cáo kiểm toán V1.1): tầng lắp ráp ngữ cảnh cắt mỗi đoạn tri thức ở 900 ký tự trong khi 162 trên 309 đoạn (52 phần trăm) dài hơn 900 ký tự; nội dung ở phần đuôi đoạn không bao giờ tới được mô hình.
- Nhánh: dot-2/wo-web-15a-toan-van-doan (từ main sau WO-WEB-12).

## Phạm vi

1. route.ts, hàm retrieveContext: nâng trần ký tự của đoạn tri thức khi lắp ráp ngữ cảnh từ 900 lên 1.500 ký tự. Đoạn dài nhất trong kho hiện hành là 1.458 ký tự nên trần 1.500 không cắt bất kỳ đoạn nào trong thực tế, đồng thời vẫn là một trần cứng phòng ngừa nếu sau này kho có đoạn dài bất thường.
2. Không thay đổi: thuật toán chấm điểm và chọn đoạn (giữ nguyên thành quả WO-WEB-07 đến WO-WEB-11), trần 400 ký tự của bài viết website, mọi thành phần còn lại của route.ts và bot-knowledge.ts, dữ liệu kho.

## Bằng chứng khiếm khuyết trước thay đổi (T17)

- Câu hỏi kiểm chứng: "Các trường hợp phản vệ phải được báo cáo về đâu ạ?"
- Mô phỏng ngoại tuyến theo đúng logic truy xuất đang chạy: đoạn Điều 4 Thông tư 51/2017 được chọn vào nhóm ngữ cảnh; điều khoản quyết định (khoản 4, nghĩa vụ báo cáo về Trung tâm Quốc gia về Thông tin Thuốc và Theo dõi phản ứng có hại của thuốc) nằm ở ký tự 900 trở đi của đoạn, đúng phần bị cắt.
- Kiểm chứng live trên Production trước thay đổi: Bot trả lời bằng chế độ báo cáo hoạt động tiêm chủng theo Điều 15 Thông tư 13/2026, hoàn toàn không nhắc đích báo cáo của Điều 4 Thông tư 51/2017. Khiếm khuyết được xác nhận là do cắt đoạn, không phải do chọn đoạn.

## Ghi chú dữ liệu (ngoài phạm vi)

Đoạn Điều 4 Thông tư 51/2017 trong kho tự nó kết thúc ở 1.200 ký tự giữa một câu (giới hạn khi cắt đoạn lúc nạp kho). WO này không thay đổi dữ liệu kho; đích báo cáo cấp quốc gia nằm trọn trong đoạn nên tiêu chí đạt của T17 không bị ảnh hưởng.

## Phương án quay lui

Revert commit gộp của PR WO-WEB-15A; không có thay đổi dữ liệu.
