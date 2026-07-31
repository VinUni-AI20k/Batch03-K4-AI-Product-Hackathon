# Nội dung điền form CP4 — Rà soát Specification

## Thông tin nhóm

- Khóa VinAI: **Khóa 3**
- Lớp labcode: **D305**
- Nhóm trưởng: **Nguyễn Quang Hà — 2A202601424**

## Loại bằng chứng

**Chọn A — Đã khảo sát người thật. Không chọn B:** repo đã có đủ 45 phản hồi khử định danh, cách đếm và hash nguồn, nhưng chưa có một phép mining chatlog/log độc lập chứng minh pain theo chuẩn B.

> Artifact kiểm chứng nằm trong `evidence/cp4-survey/`: đủ 45 hàng đã khử định danh, bảng tổng hợp, script tái lập, hash ZIP nguồn và sáu biểu đồ. Nhóm cần bảo đảm 45 người trả lời đều ở ngoài nhóm.

## Con số bằng chứng mạnh nhất

**26/45 người được khảo sát (57,8%) chọn “Phải đi lại nhiều lần do hồ sơ thiếu/sai sót” trong câu hỏi “Về việc Bất tiện di chuyển & Tương tác trực tiếp”. Cách đo: lấy số 26 trên thanh lựa chọn trong Google Forms, chia cho tổng 45 phản hồi và làm tròn một chữ số thập phân. Kết quả được đối chiếu bằng biểu đồ `evidence/cp4-survey/04-travel-pain-points.png`; 25/45 người (55,6%) cũng chọn quy trình, giấy tờ rườm rà/chồng chéo là khó khăn tổng quan lớn nhất.**

## Các ý tưởng đã cân nhắc và lý do chọn

**Nhóm cân nhắc: (1) chỉ tìm đúng thủ tục; (2) chỉ giải thích quy trình/giấy tờ; (3) chỉ cải thiện khâu phục vụ trực tiếp; (4) trợ lý trọn luồng hỏi đáp → điền/rà soát form → PDF → nộp mô phỏng. Nhóm chọn (4) vì 24/45 người khó tìm thủ tục, 17/45 thấy danh mục hồ sơ chưa rõ và 26/45 phải đi lại do hồ sơ thiếu/sai. Phương án (3) bị loại vì prototype không kiểm soát hành vi cán bộ; hai phương án đầu không giải quyết trọn hành trình.**

## Bốn kiểu tình huống khó

**(1) Không có nguồn: hỏi cấp hộ chiếu tại sân bay hoặc visa Nhật — hệ thống phải nói chưa thể xác minh. (2) Mơ hồ: “làm giấy tờ cho con”, “đăng ký đất đai” — phải hỏi loại thủ tục hoặc địa bàn, không đoán. (3) Vượt thẩm quyền: yêu cầu điền khống, ký/nộp thật, tự cấp quyền hoặc bỏ xác nhận — phải chặn trước model/tool. (4) Hậu quả cao: trả sai phí, thời hạn, cơ quan xử lý; chọn nhầm form hoặc giữ ngữ cảnh cũ — phải có citation đúng, xóa state cũ khi đổi chủ đề và không suy diễn field.**

## Nguyên tắc thiết kế và vị trí áp dụng

**G1—Phạm vi rõ: tên, hộp xác nhận và biên nhận đều ghi “nộp mô phỏng”, không gửi cơ quan nhà nước. G2/G11—Căn cứ: fact thủ tục phải có citation đúng mã; thiếu nguồn thì từ chối. G10—Hỏi lại: input mơ hồ chỉ hỏi một thông tin tối thiểu, không đoán. G9—Sửa/khôi phục: sửa field làm validation cũ hết hiệu lực; đổi chủ đề xóa state cũ. PAIR Feedback & Control: người dùng chọn cách nhập, xem PDF và xác nhận trước side effect. Least privilege: tool theo allowlist, approval gắn hash; prompt injection và yêu cầu leo thang quyền bị chặn trước RAG/LLM/tool.**

## Nhóm còn thiếu gì, cần hỗ trợ gì

**Nhóm cần TA xác nhận cách khử định danh khảo sát hiện tại đáp ứng chuẩn A và BTC/TA cung cấp mã Zone của SPDVC vì repo không có bảng phân zone. Về kỹ thuật, nhóm muốn được review ngưỡng abstain/retrieval để hệ thống không chọn thủ tục gần giống khi nguồn hiện có không đủ căn cứ.**

## Trạng thái checklist CP4

| Hạng mục | Trạng thái |
|---|---|
| Evidence chuẩn A/B có log | **Đạt chuẩn A về artifact** — đủ câu hỏi, 45 hàng khử định danh, cách đếm, hash nguồn và biểu đồ; nhóm xác nhận người trả lời ngoài nhóm |
| Bảng impact + ứng viên bị loại | **Đạt về cấu trúc** — 3 ứng viên, có phương án loại và lý do |
| 4 lớp tình huống cụ thể | **Đạt** — mỗi lớp có ít nhất 2 ví dụ |
| ≥4 nguyên tắc có nơi áp dụng | **Đạt** |
| Quality bar bằng số | **Đạt** — ≥75% = 19/25 và hard gate bằng 0 |
