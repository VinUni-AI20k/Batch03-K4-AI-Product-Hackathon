# Nội dung điền form CP4 — Rà soát Specification

## Thông tin nhóm

- Khóa VinAI: **Khóa 3**
- Lớp labcode: **D305**
- Nhóm trưởng: **Nguyễn Quang Hà — 2A202601424**

## Loại bằng chứng

**Chỉ chọn A — Đã khảo sát người thật sau khi đã commit file chứa câu hỏi và toàn bộ 35 câu trả lời đã khử định danh. Không chọn B:** repo hiện chưa có một phép mining chatlog chứng minh pain theo chuẩn B.

> Trạng thái hiện tại: `spec.md` có số tổng hợp và 7 trích dẫn, nhưng chưa có câu hỏi khảo sát và đủ 35 câu trả lời. Vì vậy chưa đủ bằng chứng để tích A một cách kiểm chứng được.

## Con số bằng chứng mạnh nhất

**20/35 người được khảo sát (57%) cho biết gặp khó khăn khi tìm đúng thủ tục dịch vụ công. Cách đo: dùng câu hỏi “[DÁN NGUYÊN VĂN CÂU HỎI KHẢO SÁT]”, đếm các câu trả lời xác nhận khó tìm tên thủ tục, kết quả tìm kiếm không chính xác hoặc thông tin phân tán; lưu câu hỏi, quy tắc gán nhãn và toàn bộ 35 câu trả lời đã khử định danh tại `[ĐƯỜNG DẪN FILE]`.**

Không nộp nguyên văn hai chỗ trong ngoặc vuông; phải thay bằng dữ liệu khảo sát thật.

## Các ý tưởng đã cân nhắc và lý do chọn

**Nhóm cân nhắc: (1) chỉ tìm đúng thủ tục; (2) chỉ giải thích quy trình/giấy tờ; (3) trợ lý trọn luồng hỏi đáp → điền/rà soát form → PDF → nộp mô phỏng. Nhóm chọn (3) vì 20/35 người (57%) khó tìm thủ tục và 12/35 người (34%) khó hiểu quy trình/giấy tờ; hai phương án đầu vẫn buộc người dùng tự chuyển trang và tự kiểm tra biểu mẫu. Phạm vi nộp được giữ ở mức mô phỏng để không tạo kỳ vọng sai.**

## Bốn kiểu tình huống khó

**(1) Không có nguồn: hỏi cấp hộ chiếu tại sân bay hoặc visa Nhật — hệ thống phải nói chưa thể xác minh. (2) Mơ hồ: “làm giấy tờ cho con”, “đăng ký đất đai” — phải hỏi loại thủ tục hoặc địa bàn, không đoán. (3) Vượt thẩm quyền: yêu cầu điền khống, ký/nộp thật, tự cấp quyền hoặc bỏ xác nhận — phải chặn trước model/tool. (4) Hậu quả cao: trả sai phí, thời hạn, cơ quan xử lý; chọn nhầm form hoặc giữ ngữ cảnh cũ — phải có citation đúng, xóa state cũ khi đổi chủ đề và không suy diễn field.**

## Nguyên tắc thiết kế và vị trí áp dụng

**G1—Phạm vi rõ: tên, hộp xác nhận và biên nhận đều ghi “nộp mô phỏng”, không gửi cơ quan nhà nước. G2/G11—Căn cứ: fact thủ tục phải có citation đúng mã; thiếu nguồn thì từ chối. G10—Hỏi lại: input mơ hồ chỉ hỏi một thông tin tối thiểu, không đoán. G9—Sửa/khôi phục: sửa field làm validation cũ hết hiệu lực; đổi chủ đề xóa state cũ. PAIR Feedback & Control: người dùng chọn cách nhập, xem PDF và xác nhận trước side effect. Least privilege: tool theo allowlist, approval gắn hash; prompt injection và yêu cầu leo thang quyền bị chặn trước RAG/LLM/tool.**

## Nhóm còn thiếu gì, cần hỗ trợ gì

**Nhóm còn thiếu artifact khảo sát gồm câu hỏi, toàn bộ 35 câu trả lời đã khử định danh và quy tắc đếm để kiểm chứng số 20/35; cần TA xác nhận định dạng khử định danh phù hợp. Nhóm cũng cần BTC/TA cung cấp mã Zone của SPDVC vì repo/data pack không có bảng phân zone. Về kỹ thuật, nhóm muốn TA review ngưỡng abstain/retrieval để hệ thống không chọn một thủ tục gần giống khi nguồn hiện có không đủ.**

## Trạng thái checklist CP4

| Hạng mục | Trạng thái |
|---|---|
| Evidence chuẩn A/B có log | **Chưa đạt** — thiếu raw survey và câu hỏi |
| Bảng impact + ứng viên bị loại | **Đạt về cấu trúc** — 3 ứng viên, có phương án loại và lý do |
| 4 lớp tình huống cụ thể | **Đạt** — mỗi lớp có ít nhất 2 ví dụ |
| ≥4 nguyên tắc có nơi áp dụng | **Đạt** |
| Quality bar bằng số | **Đạt** — ≥75% = 19/25 và hard gate bằng 0 |

