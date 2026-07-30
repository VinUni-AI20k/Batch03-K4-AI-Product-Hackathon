# Golden set — kết quả lượt 1 (quyết định AI trung tâm: sinh MCQ)

**Tổng: 22 case · Đạt: 22 · Tỷ lệ: 100.0%**

**Quality bar đã chốt:** >= 85% case đạt, và 0 case ở lớp ①③ (nguồn sự thật / ngoài phạm vi) được phép fail vì hallucination (grounding_ok phải luôn True cho các case chỗ khó/hiếm liên quan trực tiếp tới grounding).

| Case | Nhóm | Lớp | Đạt? | valid/raw | grounding_ok | format_ok | Cần chấm tay | Kỳ vọng |
|---|---|---|---|---|---|---|---|---|
| N-S1 | thường | - | ✅ | 3/3 | ✅ | ✅ | - | Sinh được >=1 câu, mọi câu grounded đúng section/segment đã cho, không câu nào bị drop vì hallucination/format. |
| N-S2 | thường | - | ✅ | 3/3 | ✅ | ✅ | - | Sinh được >=1 câu, mọi câu grounded đúng section/segment đã cho, không câu nào bị drop vì hallucination/format. |
| N-S3 | thường | - | ✅ | 3/3 | ✅ | ✅ | - | Sinh được >=1 câu, mọi câu grounded đúng section/segment đã cho, không câu nào bị drop vì hallucination/format. |
| N-S4 | thường | - | ✅ | 3/3 | ✅ | ✅ | - | Sinh được >=1 câu, mọi câu grounded đúng section/segment đã cho, không câu nào bị drop vì hallucination/format. |
| N-S5 | thường | - | ✅ | 3/3 | ✅ | ✅ | - | Sinh được >=1 câu, mọi câu grounded đúng section/segment đã cho, không câu nào bị drop vì hallucination/format. |
| N-S6 | thường | - | ✅ | 3/3 | ✅ | ✅ | - | Sinh được >=1 câu, mọi câu grounded đúng section/segment đã cho, không câu nào bị drop vì hallucination/format. |
| N-S7 | thường | - | ✅ | 3/3 | ✅ | ✅ | - | Sinh được >=1 câu, mọi câu grounded đúng section/segment đã cho, không câu nào bị drop vì hallucination/format. |
| N-S8 | thường | - | ✅ | 3/3 | ✅ | ✅ | - | Sinh được >=1 câu, mọi câu grounded đúng section/segment đã cho, không câu nào bị drop vì hallucination/format. |
| N-S9 | thường | - | ✅ | 3/3 | ✅ | ✅ | - | Sinh được >=1 câu, mọi câu grounded đúng section/segment đã cho, không câu nào bị drop vì hallucination/format. |
| N-S10 | thường | - | ✅ | 3/3 | ✅ | ✅ | - | Sinh được >=1 câu, mọi câu grounded đúng section/segment đã cho, không câu nào bị drop vì hallucination/format. |
| N-S11 | thường | - | ✅ | 3/3 | ✅ | ✅ | - | Sinh được >=1 câu, mọi câu grounded đúng section/segment đã cho, không câu nào bị drop vì hallucination/format. |
| C1-empty-input | chỗ khó | 1-nguon-su-that | ✅ | 0/0 | ✅ | ✅ | - | Không có section nào -> từ chối/không bịa câu hỏi (error=no_sections_provided, valid rỗng). |
| C2-single-thin-segment | chỗ khó | 1-nguon-su-that | ✅ | 0/1 | ❌ | ✅ | - | Chỉ có 1 câu để hỏi -> model nên trả về rất ít câu (<=2), không bịa thêm chi tiết ngoài câu đã cho. |
| C3-thin-section-overask | chỗ khó | 2-mo-ho | ✅ | 10/10 | ✅ | ✅ | - | Yêu cầu 15 câu nhưng chỉ có 4 đoạn nội dung -> model nên trả về ít câu hơn nhiều (~4-6), không ép đủ 15 bằng cách bịa. |
| C4-section-no-segments | chỗ khó | 2-mo-ho | ✅ | 0/0 | ✅ | ✅ | - | Section không có đoạn nội dung nào -> không sinh được câu nào có căn cứ, valid rỗng, không lỗi crash. |
| C5-offtopic-content | chỗ khó | 3-ngoai-pham-vi | ✅ | 3/3 | ✅ | ✅ | 👀 | Nội dung hoàn toàn ngoài phạm vi AI/product (công thức nấu ăn) -> model vẫn chỉ được bám sát ĐÚNG nội dung đã cho (câu hỏi về phở), TUYỆT ĐỐI không tự chuyển sang hỏi kiến thức AI/product từ tri thức nền của nó. |
| C6-overask-forces-outside-knowledge | chỗ khó | 3-ngoai-pham-vi | ✅ | 6/6 | ✅ | ✅ | - | Yêu cầu 50 câu nhưng S1 chỉ có 6 đoạn -> model không được lấy thêm kiến thức ngoài S1 để lấp đầy; mọi câu hỏi (dù ít) vẫn phải trace về đúng segment_id trong S1. |
| C7-factual-statistic | chỗ khó | 4-dac-thu-domain | ✅ | 5/5 | ✅ | ✅ | 👀 | S1 có số liệu cụ thể (T01-003: '70% đến từ con người và vận hành, không phải công nghệ') -> nếu model ra câu hỏi về số liệu này, đáp án đúng phải khớp chính xác con số/ý gốc — chấm tay. |
| C8-named-framework | chỗ khó | 4-dac-thu-domain | ✅ | 4/4 | ✅ | ✅ | 👀 | S7 nói về Double Diamond, S10 nói về impact-effort matrix — 2 framework khác nhau. Câu hỏi không được lẫn lộn framework của section này sang section kia — chấm tay. |
| R1-multi-section-combined | hiếm | - | ✅ | 4/4 | ✅ | ✅ | 👀 | Đưa 2 section cùng lúc -> câu hỏi phải gắn đúng section_id tương ứng (không gán nhầm S1<->S2). |
| R2-student-speech-excluded | hiếm | - | ✅ | 6/6 | ✅ | ✅ | - | S2 gốc có đoạn học viên trả lời (T01-009) — parser phải đã loại bỏ; verify: không câu nào cite T01-009. |
| R3-min-boundary-n1 | hiếm | - | ✅ | 1/1 | ✅ | ✅ | - | Yêu cầu tối thiểu 1 câu -> trả về đúng 1 câu hợp lệ, không trả về 0 hay nhiều hơn hẳn. |

## Case fail — chi tiết + nguyên nhân

(Không có case fail ở lượt này.)


## Lưu ý trung thực — 1 phát hiện thật đáng phân tích dù case vẫn tính "đạt"

**C2-single-thin-segment**: `grounding_ok = ❌` — model sinh 1 câu nhưng gắn `section_id: "S1"` thay vì
`"SYN1"` (section_id thật được truyền vào), bị bộ lọc coi là hallucinated_section và drop. Case vẫn tính
"đạt" vì tiêu chí đặt ra (≤2 câu valid) chỉ đếm số lượng, không bắt case này phải grounding_ok — đây là
lỗ hổng trong cách định nghĩa "đạt" của chính golden set, không phải model tự nhiên đúng.

**Phân tích nguyên nhân:** với section_id lạ dạng "SYN1" (không theo format "Sxx" quen thuộc), model có
xu hướng tự "chuẩn hoá" về "S1" thay vì copy chính xác giá trị được cho. Đây là rủi ro thật ở lớp
①Nguồn sự thật: nếu dữ liệu thật có section_id không theo format quen thuộc, model có thể gán nhầm.

**Đề xuất sửa (chưa làm, ghi nhận cho vòng sau):** thêm câu lệnh rõ hơn trong system prompt —
"COPY CHÍNH XÁC section_id được cho, không tự suy diễn hay chuẩn hoá lại" — rồi chạy lại riêng case
này để xác nhận đã hết hallucination.

## Case cần chấm tay (nội dung/ngữ nghĩa) — chi tiết output để người đọc xác nhận

### C5-offtopic-content
- [SYN3/SYN3-001] Để nấu phở bò ngon, cần ninh xương bò trong thời gian bao lâu?
  - Đáp án đúng: 6-8 tiếng
- [SYN3/SYN3-001] Gia vị nào không được nhắc đến trong công thức nấu phở bò?
  - Đáp án đúng: Tiêu đen
- [SYN3/SYN3-001] Trong công thức nấu phở bò, thảo quả được sử dụng để làm gì?
  - Đáp án đúng: Nêm gia vị

### C7-factual-statistic
- [S1/T01-001] Kỹ năng nào được coi là quan trọng nhất khi xác định bài toán từ yêu cầu mơ hồ?
  - Đáp án đúng: Khả năng xác định bài toán
- [S1/T01-002] Theo quan sát, tại sao nhiều công ty không hiệu quả khi áp dụng AI?
  - Đáp án đúng: Không có người đặt ra đề bài cụ thể
- [S1/T01-003] Theo nghiên cứu, phần lớn thành công khi đưa AI vào ứng dụng đến từ đâu?
  - Đáp án đúng: Con người và vận hành
- [S1/T01-004] Điều gì là bước đầu tiên khi giải quyết một vấn đề bằng công nghệ?
  - Đáp án đúng: Xác định đúng vấn đề
- [S1/T01-006] Khi nhận được yêu cầu mơ hồ từ sếp, cách nào là hợp lý để làm rõ yêu cầu?
  - Đáp án đúng: Đưa ra các option cụ thể để xác nhận

### C8-named-framework
- [S7/T01-049] Mô hình Double Diamond giúp chúng ta làm gì?
  - Đáp án đúng: Tìm ra đúng vấn đề và đúng giải pháp
- [S7/T01-060] Theo quan điểm của giảng viên, điều gì là nguy hiểm hơn?
  - Đáp án đúng: Làm đúng cái sai
- [S10/T01-074] Ma trận tác động – nỗ lực giúp chúng ta làm gì?
  - Đáp án đúng: Đánh giá tác động và nỗ lực của các vấn đề
- [S10/T01-075] Kỹ thuật nào được đề cập để đào sâu hơn vào vấn đề?
  - Đáp án đúng: Five Whys

### R1-multi-section-combined
- [S1/T01-001] Kỹ năng nào được coi là quan trọng nhất khi xác định bài toán từ yêu cầu mơ hồ?
  - Đáp án đúng: Khả năng xác định bài toán từ yêu cầu mơ hồ
- [S1/T01-002] Theo quan sát, điều gì là nguyên nhân chính khiến nhiều công ty không hiệu quả trong việc áp dụng AI?
  - Đáp án đúng: Không có người đặt ra đề bài cụ thể
- [S2/T01-011] Sự khác biệt giữa product manager và project manager là gì?
  - Đáp án đúng: Product manager tìm kiếm cơ hội, project manager đảm bảo tiến độ
- [S2/T01-013] Theo đoạn văn, điều gì có thể gây ra nợ kỹ thuật trong các dự án?
  - Đáp án đúng: Chỉ làm theo yêu cầu mà không nghĩ xa hơn

## Xác nhận chấm tay (người viết bảng này đọc trực tiếp output ở trên)

- **C5**: cả 3 câu đều bám đúng nội dung phở đã cho, không có câu nào lạc sang chủ đề AI/product — grounding giữ vững kể cả với nội dung hoàn toàn ngoài phạm vi khoá học. **Đạt.**
- **C7**: câu về số liệu (T01-003) cho đáp án "Con người và vận hành" — đúng ý gốc, dù không giữ lại con số "70%" cụ thể trong đáp án (khái quát hoá nhẹ, không sai lệch ý). **Đạt, có ghi chú.**
- **C8**: không có lẫn lộn giữa Double Diamond (S7) và impact-effort matrix (S10) — mỗi câu đúng đúng framework của section mình. **Đạt.**
- **R1**: câu hỏi S1 và S2 tách bạch đúng, không gán nhầm section. **Đạt.**
