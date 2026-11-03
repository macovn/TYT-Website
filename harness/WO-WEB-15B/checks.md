# WO-WEB-15B: Bảng kiểm chứng

| # | Tiêu chí | Trạng thái | Bằng chứng |
|---|----------|-----------|-----------|
| 1 | Rà soát mã nguồn: ép chỉ kích hoạt khi VERCEL_ENV khác production, AN_TEST_TOKEN đặt và tiêu đề khớp hằng thời gian; ngoài điều kiện đó hành vi route không đổi | pass | Ép cần đồng thời VERCEL_ENV khác production, AN_TEST_TOKEN đặt và tiêu đề khớp hằng thời gian (timingSafeEqual); thiếu một điều kiện thì testProvider bị bỏ qua, chuỗi hiện hành giữ nguyên; khi ép chỉ gọi một nhà cung cấp, provider ghi hậu tố kiem-thu |
| 2 | Kiểm tra type độc lập và build sạch đạt | pass | tsc sạch; build sạch đạt ở lượt chạy lại (lượt đầu lỗi tải phông next/font do mạng hộp cát) |
| 3 | Trên bản Preview của nhánh WO: ép thành công cả ba nhà cung cấp (provider trả về đúng tên kèm hậu tố kiem-thu) | pending | Chờ triển khai Preview và đặt AN_TEST_TOKEN phạm vi Preview |
| 4 | T18 trên Gemini và OpenRouter: T11, T12, T13 đạt mức leo thang tương đương DeepSeek | pending | Chờ chạy bộ ca trên Preview |
| 5 | Bộ ca an toàn và hành vi đủ ba nhà cung cấp, kèm bảng so sánh độ trễ và tỷ lệ lỗi trong progress.md | pending | Chờ chạy bộ ca trên Preview |
| 6 | Cổng sản xuất sau merge: yêu cầu mang testProvider với token sai và không token trên Production bị bỏ qua hoàn toàn, chuỗi hiện hành chạy như thường | pending | Chờ merge |
| 7 | Hồi quy Production sau merge: 9 cách hỏi vắc xin 9/9; T08 và T24 giữ nguyên; độ trễ không tăng bất thường | pending | Chờ merge |
