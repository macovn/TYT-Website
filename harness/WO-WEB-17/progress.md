# WO-WEB-17: Nhật ký tiến độ

- Mã nguồn hoàn tất ba thay đổi theo plan.md; tsc sạch, build sạch; PR 68 đã mở.
- Môi trường kiểm thử Preview đã dựng: ba khóa nhà cung cấp mở thêm phạm vi Preview, AN_TEST_TOKEN chỉ Preview, khóa vòng qua bảo vệ triển khai đã tạo. Việc triển khai lại để áp biến môi trường bị kẹt ở bước xác thực lại của Vercel (mã email hết hạn trong vòng duyệt từ xa), chuyển sang cách đẩy một commit mới để Vercel tự tạo bản triển khai Preview mới mang biến môi trường hiện hành.
- Đêm 04/11/2026: các POST tới bản Preview đều treo quá 90 giây kể cả đường xác định khẩn cấp và cả khi không kèm khóa vòng qua, trong khi GET vẫn nhanh và Production vẫn bình thường; nghi sự cố đường truyền cục bộ trong đêm (cùng đêm cổng GitHub và các phiên chạy liên tục đứt), chưa kết luận lỗi ở mã nguồn. Phiên Supabase cũng hết hạn đăng nhập. Việc cần làm tiếp: chạy lại bộ ca vào phiên ổn định; nếu POST vẫn treo thì xem nhật ký hàm trên Vercel.
