# VALIDATION LOG TẠM THỜI - VLEARN ACTIVE RECALL

**Nhóm:** 5tuat  
**Owner:** Phạm Công Đạt (2A202601406)  
**Nguồn:** Báo cáo Google Form `Câu trả lời biểu mẫu 1.html`  
**Thời điểm thu thập:** 30/07/2026  
**Cỡ mẫu:** 24 học viên ngoài nhóm

> **Lưu ý phạm vi:** Đây là khảo sát định hướng giải pháp được thu trước vòng
> dùng thử prototype. Dữ liệu này là bằng chứng thật nhưng chưa thay thế
> usability test theo R6. Trước CP5 cần bổ sung log từ ít nhất 5 người trực tiếp
> thao tác trên `codebase/index.html`, trong đó có ít nhất 2 willing users.

## 1. Câu hỏi liên quan trực tiếp đến lát cắt

1. Bạn có sẵn sàng làm một bài Quiz ngắn ngay sau bài học để kiểm tra mức độ hiểu?
2. Bạn cảm thấy thế nào nếu hệ thống chuyển câu hỏi và vùng slide chưa hiểu cho giảng viên khi Quiz không đạt?
3. Quy trình Hỏi AI -> Đọc tài liệu -> Làm Quiz -> Nhờ giảng viên có phức tạp không?
4. Bạn muốn thay đổi hoặc lược bỏ bước nào?
5. Bạn có sẵn sàng chia sẻ lịch sử lỗi sai để hệ thống gợi ý nội dung ôn tập không?

## 2. Kết quả tổng hợp N=24

| Tín hiệu | Kết quả | Ý nghĩa đối với thiết kế |
|---|---:|---|
| Sẵn sàng làm Quiz nếu ngắn | 20/24 (83,33%) | Giữ lát cắt Active Recall nhưng giới hạn số câu |
| Đồng ý chuyển cho giảng viên/TA | 20/24 (83,33%) | Có nhu cầu escalation sau khi Quiz không đạt |
| Muốn được hỏi ý kiến trước khi gửi | 9/24 (37,50%) | Không tự động gửi; dùng nút xác nhận |
| Muốn bỏ tính năng tự động gửi | 10/24 (41,67%) | Quyền kiểm soát phải nằm ở học viên |
| Thấy quy trình quá rườm rà | 7/24 (29,17%) | Cần rút ngắn flow và tránh thêm bước không cần thiết |
| Sẵn sàng chia sẻ lịch sử lỗi sai, mức 3-5/5 | 22/24 (91,67%) | Có thể phát triển lịch sử ôn tập nếu có thêm thời gian |

## 3. Trích dẫn nguyên văn tiêu biểu

Google Form không thu tên người trả lời, vì vậy các phản hồi dưới đây được gắn
mã ẩn danh theo số dòng và thời gian gửi. Không suy diễn danh tính người trả lời.

| Mã phản hồi | Thời gian | Quote nguyên văn | Mức độ | Quyết định |
|---|---|---|---|---|
| GF-4 | 30/07/2026 15:14:48 | "Cần hệ thống hỏi ý kiến (nút \"Đồng ý gửi\") trước khi chuyển cho giảng viên." | Cao | Thêm hành động xác nhận, không tự gửi |
| GF-4 | 30/07/2026 15:14:48 | "Bỏ tính năng tự động gửi giảng viên (chỉ gửi khi tôi chủ động bấm)." | Cao | Chọn Conditional Automation |
| GF-6 | 30/07/2026 15:16:14 | "Sẵn sàng nếu bài Quiz thực sự ngắn" | Trung bình | Giới hạn quiz ở 3 câu |
| GF-7 | 30/07/2026 15:16:31 | "Quá rườm rà, làm gián đoạn quá trình học của tôi." | Cao | Giữ một flow chính, giảm bước phụ |
| GF-7 | 30/07/2026 15:16:31 | "Bỏ bước làm bài Quiz." | Cao | Giữ quiz vì đúng core JTBD, nhưng làm ngắn và cho phép thoát |
| GF-10 | 30/07/2026 15:18:19 | "Bỏ bước cung cấp link tài liệu ngoài." | Trung bình | Ưu tiên trích dẫn slide/transcript nội bộ |

## 4. Changelog từ khảo sát

### Thay đổi đã phản ánh trong prototype

- Chuyển từ ý tưởng tự động gửi sang nút **"Chuyển vùng slide cho TA hỗ trợ"**.
- Chỉ gửi sau khi học viên chủ động xác nhận; phù hợp phản hồi của 9/24 người.
- Quiz được giới hạn ở 3 câu để đáp ứng điều kiện "Quiz thực sự ngắn".
- Kết quả luôn kèm mã trích dẫn `[Txx-xxx]`, không ưu tiên link tài liệu ngoài.

### Giữ nguyên có lý do

- Vẫn giữ bước Quiz dù 3/24 người muốn bỏ, vì Quiz là quyết định trung tâm giúp
  phát hiện "ảo tưởng đã hiểu bài"; thay đổi được chọn là rút ngắn thay vì bỏ.

### Backlog

- Lịch sử lỗi sai và gợi ý chủ đề ôn tập.
- Chế độ hình ảnh/sơ đồ trực quan.
- Kiểm tra xem luồng chuyển TA có tạo cảm giác bị đánh giá hay không.

## 5. Kịch bản usability test cần bổ sung trước CP5

**Task chung:** "Hãy hoàn thành một câu hỏi Active Recall, xem phần giải thích và
quyết định có chuyển vùng slide cho TA hay không."

| Người thử dự kiến | Mã học viên | Trạng thái |
|---|---|---|
| Nguyễn Văn Thành | 2A202601030 | Chưa test |
| Nguyễn Chiến Thắng | 2A202601734 | Chưa test |
| Hồ Ngọc Quỳnh | 2A202601684 | Chưa test |
| Người ngoài nhóm số 4 | Bổ sung tại CP5 | Chưa test |
| Người ngoài nhóm số 5 | Bổ sung tại CP5 | Chưa test |

Mỗi lượt cần ghi: người thử và vai trò, task, quan sát thao tác, quote nguyên
văn, mức nghiêm trọng và thay đổi được quyết định.
