# PRODUCT CANVAS — VLEARN GROUNDED TUTOR

**Nhóm:** `Team Rau Má`
**Zone:** `Hà Nội`
**Ngày cập nhật:** `[07/08/2026]`
**Trạng thái:** Canvas CP1 — đã có willing users; cần điền phân công trước khi nộp

## A. Canvas 7 dòng để show tại CP1

1. **Hướng:** A — tối ưu AI Tutor hiện có trên VLearn.
2. **Job executor:** Học viên đang đọc slide/tài liệu trên VLearn và cần hiểu,
   tóm tắt hoặc phân biệt một khái niệm trong bài.
3. **Pain:** Khi học viên hỏi để hiểu nội dung đang học, nhiều câu trả lời không
   chỉ ra căn cứ nằm ở trang/đoạn nào, khiến học viên khó kiểm tra lại và không
   biết nên tin câu trả lời đến mức nào.
4. **Bằng chứng ban đầu:** Trong 740/1.261 turn được heuristic nhận diện là câu hỏi
   học thuật, có **258/740 turn không citation (34,9%)**, ảnh hưởng **170 học viên**
   và **201 hội thoại**. Trong mẫu học thuật có rating, **16/21** lượt không
   citation bị downvote, so với **4/19** lượt có citation.
5. **Lát cắt một câu:** Một học viên đang đọc tài liệu và hỏi về một khái niệm
   được Tutor quyết định trả lời kèm nguồn khi có đủ căn cứ, hoặc nói rõ chưa đủ
   căn cứ khi không tìm thấy nguồn, để học viên kiểm tra và tiếp tục học.
6. **Automation + willing users:** **Conditional** — tự trả lời khi có nguồn đủ
   mạnh, không đủ nguồn thì thu hẹp phạm vi và hỏi lại; willing users:
   **Lâm Vũ**, **Lê Văn Tuấn**, **Cao Hương Giang** — lớp D303, đã đồng ý thử lúc
   14:00 ngày 2.
7. **Phân công:** Evidence/mining — `[Tên]`; product/spec — `[Tên]`;
   retrieval/prompt — `[Tên]`; prototype/code — `[Tên]`; eval/demo —
   `[Tên]`.

> Ba willing users đã được xác nhận. Không nộp CP1 khi tên nhóm, zone và tên phân
> công còn để trống.

## B. User và Job-to-be-Done

### Job executor

Học viên đang học trực tiếp trên VLearn, đã mở một slide hoặc chọn một đoạn tài
liệu và cần hiểu nội dung ngay trong luồng học.

### Core JTBD

> Hiểu và kiểm tra lại một khái niệm trong tài liệu đang học để có thể tiếp tục
> bài học mà không phải chuyển sang nhiều nguồn khác.

### Job story

> Khi gặp một khái niệm chưa hiểu trong slide, tôi muốn nhận được lời giải thích
> có thể đối chiếu với đúng đoạn nguồn, để tôi biết câu trả lời đáng tin và tiếp
> tục học mà không phải tự tìm lại toàn bộ tài liệu.

### Workflow hiện tại

```text
Đọc tài liệu
    ↓
Gặp chỗ chưa hiểu
    ↓
Bôi đen đoạn hoặc hỏi Tutor
    ↓
Nhận câu trả lời
    ↓
Có citation? ── Có → mở trang nguồn và kiểm tra → tiếp tục học
       │
       Không → tự tìm slide / hỏi lại / dùng công cụ khác / bỏ qua
```

### Alternatives hiện tại

| Cách học viên đang dùng | Điểm tốt | Chỗ thất bại cần xác minh |
|---|---|---|
| Tự tìm lại trong slide | Dùng đúng nguồn chính thức | Tốn thời gian, khó tìm khi không nhớ trang |
| Hỏi lại Tutor | Không phải rời VLearn | Có thể nhận tiếp câu trả lời không căn cứ |
| Dùng ChatGPT/LLM khác | Linh hoạt | Không có đầy đủ tài liệu khóa học |
| Hỏi bạn hoặc TA | Có người kiểm tra | Phụ thuộc người khác và thời điểm trả lời |
| Bỏ qua | Nhanh trước mắt | Có thể tạo lỗ hổng kiến thức |

Những chỗ thất bại và thời gian tổn thất trong bảng là giả thuyết cần được xác
minh bằng khảo sát về **lần gần nhất**, không phải kết luận từ EDA.

## C. Problem–Evidence–Impact

### Problem statement

> Học viên đang tìm cách hiểu nội dung trong tài liệu nhưng không có đủ căn cứ để
> kiểm tra câu trả lời nhận được, dẫn đến mức tin không phù hợp và gián đoạn luồng
> học.

### Evidence mining

| Chỉ số | Kết quả | Cách kiểm lại |
|---|---:|---|
| Tổng turn hỏi–đáp | 1.261 | Ghép một-một student/tutor theo `turn_id` |
| Turn có intent học thuật | 740 | Quy tắc từ khóa công khai trong báo cáo |
| Turn học thuật không citation | 258/740 — 34,9% | `citations == []` trong nhóm intent |
| User bị ảnh hưởng | 170/369 — 46,1% tổng user | `nunique(user_id)` trên 258 turn |
| Hội thoại bị ảnh hưởng | 201/585 — 34,4% | `nunique(conversation_id)` |
| Downvote trong nhóm không citation có rating | 16/21 — 76,2% | Chỉ tính nhóm học thuật có rating |
| Downvote trong nhóm có citation có rating | 4/19 — 21,1% | Chỉ tính nhóm học thuật có rating |

**Giới hạn:** intent là heuristic; rating có cỡ mẫu nhỏ và selection bias; không
citation không đồng nghĩa câu trả lời sai; citation có mặt cũng không đảm bảo
citation hỗ trợ đúng claim.

### Impact candidates

| Ứng viên | Quy mô | Tần suất trên user bị ảnh hưởng | Hậu quả/proxy | Quyết định |
|---|---:|---:|---|---|
| Câu hỏi học thuật không citation | 258 turn, 170 user | 1,52 turn/user | Tỷ lệ downvote cao trong mẫu rating | **Chọn** |
| Tutor báo không tìm thấy/không đủ nguồn | 291 turn, 170 user theo heuristic rộng | 1,71 turn/user | Job không hoàn thành, phải hỏi lại | Giữ làm failure mode |
| Câu trả lời quá dài | 316 turn, 150 user | 2,11 turn/user | Tăng công đọc, chưa đo số phút | Loại ở vòng này |

### Điều chưa biết cần đo

- Mỗi lần thiếu citation khiến học viên mất thêm bao nhiêu phút?
- Học viên có thực sự mở citation không, hay chỉ cần citation để tăng cảm giác tin?
- Citation hiện có đúng trang nhưng có hỗ trợ đúng claim không?
- Khi không có nguồn, học viên muốn hỏi lại, tự chọn đoạn hay chuyển TA?

## D. Value proposition và thiết kế giải pháp

### Value proposition

**Cho học viên:** hiểu nội dung mà vẫn kiểm tra được nguồn ngay trong luồng học.  
**Cho đội vận hành khóa:** giảm câu trả lời “có vẻ đúng” nhưng không truy vết được,
đồng thời nhìn thấy các vùng tài liệu Tutor thường không tìm được.

### Quyết định AI trung tâm

> Với câu hỏi và các đoạn được truy xuất, hệ thống có đủ căn cứ để trả lời hay
> phải thu hẹp phạm vi?

### Flow trong phạm vi prototype

1. Nhận câu hỏi, trang/đoạn đang chọn và các đoạn nguồn được truy xuất.
2. Phân loại: `SUPPORTED`, `LOW_CONFIDENCE` hoặc `NO_EVIDENCE`.
3. `SUPPORTED`: trả lời ngắn; đặt citation cạnh từng claim.
4. `LOW_CONFIDENCE`: nêu phần biết/chưa biết và hỏi một câu làm rõ.
5. `NO_EVIDENCE`: không đưa claim học thuật; đề nghị chọn đoạn hoặc đổi câu hỏi.
6. Cho phép user báo “citation không hỗ trợ ý này” và sinh lại.

### Mức automation

**Conditional.**

- Sai thì học viên có thể học sai hoặc tin sai nguồn.
- Chi phí hỏi lại/chọn thêm đoạn tương đối thấp.
- Vì vậy hệ thống chỉ tự trả lời khi có căn cứ; case không chắc được thu hẹp thay
  vì đoán.

### Non-goals

1. Không xây lại toàn bộ Tutor hoặc VLearn.
2. Không trả lời logistics của Discord.
3. Không trả lời kiến thức ngoài tài liệu khóa học bằng trí nhớ mô hình.
4. Không tự động chấm điểm học viên.
5. Không xây bản đồ lỗ hổng kiến thức toàn lớp trong lát cắt này.

## E. Bốn lớp chỗ khó

| Lớp | Rủi ro cụ thể | Hành vi mong muốn |
|---|---|---|
| ① Nguồn sự thật | Retrieval trả về đoạn không hỗ trợ claim hoặc sai trang | Không trả lời claim đó; hiển thị nguồn để user kiểm tra |
| ② Mơ hồ/thiếu thông tin | “Giải thích cái này” nhưng không có đoạn được chọn | Hỏi lại đúng một câu hoặc yêu cầu chọn đoạn |
| ③ Ngoài phạm vi/thẩm quyền | Hỏi ngoại hình, xin file tải xuống, hỏi ngoài khóa | Từ chối ngắn và chỉ đường hữu ích trong phạm vi |
| ④ Đặc thù domain | Giải thích sai khái niệm hoặc citation đúng trang nhưng sai ý | Chỉ dùng nguồn khóa học; cho report và correction ngay trên output |

## F. Bốn đường đi trải nghiệm

### 1. Happy path

User hỏi một khái niệm có trong đoạn được chọn → tìm được nguồn → trả lời từng ý
kèm citation → user mở nguồn kiểm tra.

### 2. Low-confidence

Có nguồn liên quan nhưng không đủ trả lời toàn bộ → trả lời phần có căn cứ, đánh
dấu phần còn thiếu và hỏi lại một câu.

### 3. Failure/không có căn cứ

Không tìm được nguồn → nói rõ “chưa tìm thấy căn cứ trong tài liệu hiện có” →
đề nghị user chọn đoạn, nhập trang hoặc thu hẹp câu hỏi.

### 4. Correction

User chọn “citation không hỗ trợ ý này” → hệ thống giữ câu hỏi, cho xem/chọn đoạn
nguồn khác → trả lời lại và ghi nhận feedback.

## G. Nguyên tắc HAX/PAIR áp dụng

| Nguyên tắc | Áp cụ thể vào prototype |
|---|---|
| G1 — Làm rõ hệ thống làm được gì | Màn hình đầu nói rõ chỉ trả lời dựa trên tài liệu khóa học |
| G2 — Làm rõ nó làm tốt đến đâu | Phân biệt có căn cứ, chưa đủ căn cứ và không có căn cứ |
| G10 — Thu hẹp khi nghi ngờ | Low-confidence hỏi lại hoặc chỉ trả lời phần được nguồn hỗ trợ |
| G11 — Giải thích vì sao | Citation đặt cạnh claim và mở được đúng đoạn nguồn |
| G9 — Sửa dễ dàng | Nút báo citation sai và flow hỏi/sinh lại |
| G15 — Feedback chi tiết | Feedback có lý do “sai nguồn/sai ý/quá dài/khác” |

## H. Giả thuyết và thước đo

### Giả thuyết sản phẩm

Nếu mỗi claim học thuật có nguồn hỗ trợ dễ kiểm tra và Tutor biết dừng khi không
đủ nguồn, học viên sẽ tin đúng mức hơn và ít phải rời VLearn để kiểm tra lại.

### Chỉ số prototype đề xuất

| Chiều chất lượng | Định nghĩa kiểm chứng được | Bar đề xuất |
|---|---|---:|
| Citation coverage | Mọi claim học thuật trong output có citation | 100% |
| Citation faithfulness | Người chấm xác nhận nguồn hỗ trợ claim | ≥90% |
| Answer correctness | Không có claim mâu thuẫn nguồn | 100% case thường |
| Abstention correctness | Không đủ nguồn thì không bịa claim học thuật | 100% case không nguồn |
| Relevance | Trả lời đúng intent, không chỉ lặp tài liệu | ≥85% |
| Correction success | User báo citation sai có thể hoàn thành flow sửa | 100% case correction |

Các bar chỉ là đề xuất; nhóm phải thống nhất và chốt trong `spec.md` trước 23:59
ngày 1, sau đó không đổi theo kết quả đo.

### Golden set dự kiến

- 8–10 case thường có nguồn rõ.
- Ít nhất 2 case nguồn sai/không hỗ trợ.
- Ít nhất 2 case input mơ hồ.
- Ít nhất 2 case ngoài phạm vi.
- Ít nhất 2 case domain dễ gây hiểu sai.
- 2–4 case hiếm, gồm citation đúng trang nhưng sai claim và nguồn mâu thuẫn.
- Ít nhất 10 case phát triển từ chatlog thật, chỉ lưu ID và trích đoạn tối thiểu.

## I. Kế hoạch xác minh người dùng

### Willing users CP1

| Người thật ngoài nhóm | Vai trò | Đã đồng ý thử? | Liên hệ/thời gian |
|---|---|---|---|
| Lâm Vũ | Học viên lớp D303 | Có | 14:00 ngày 2 |
| Lê Văn Tuấn | Học viên lớp D303 | Có | 14:00 ngày 2 |
| Cao Hương Giang | Học viên lớp D303 | Có | 14:00 ngày 2 |

### Câu hỏi khảo sát pain

1. Lần gần nhất Tutor trả lời nhưng bạn không chắc đúng, bạn đã làm gì tiếp?
2. Bạn mất khoảng bao nhiêu phút để kiểm tra lại?
3. Bạn có mở citation không? Lần gần nhất citation giúp hoặc không giúp thế nào?
4. Khi Tutor không tìm được nguồn, phản hồi nào giúp bạn tiếp tục học?

### Task validation prototype

> “Hãy dùng prototype để hiểu khái niệm trong đoạn tài liệu này và quyết định xem
> bạn có đủ tin tưởng để tiếp tục làm bài hay không.”

Sau task, hỏi:

1. Điều gì khó hiểu hoặc khó chịu nhất?
2. Bạn có tin kết quả này không — vì sao?
3. Bạn có dùng thật không — vì sao hoặc vì sao chưa?

## J. Phân công và việc cần chốt

| Workstream | Người phụ trách | Output |
|---|---|---|
| Evidence + manual review | `[Tên]` | Log review, phương pháp đếm, ≥5 ví dụ |
| Survey + willing users | `[Tên]` | Log ≥20 nếu đi đường A; ≥3 willing users |
| Product + spec | `[Tên]` | `spec.md`, Canvas, HAX/PAIR |
| Retrieval/prompt | `[Tên]` | Quyết định supported/low/no-evidence |
| Prototype/code | `[Tên]` | Flow bấm được và AI call thật |
| Golden set/eval | `[Tên]` | ≥20 case và bảng kết quả |
| Validation/demo | `[Tên]` | Feedback ≥5 người, slide và demo script |

### Checklist trước CP1

- [ ] Điền tên nhóm và zone.
- [x] Có ba willing users thật ngoài nhóm.
- [ ] Điền tên người phụ trách từng phần.
- [ ] Đọc tay ít nhất 20 case flagged và ghi tỷ lệ valid.
- [ ] Nhóm thống nhất câu lát cắt và mức Conditional.
- [ ] Chuẩn bị link repo/commit chứa Canvas.

## K. Nguồn truy vết

- EDA notebook: `eda/vlearn_ai_tutor_eda.ipynb`
- Báo cáo mining: `eda/bao-cao-de-xuat-bai-toan.md`
- Data dictionary: `data/vlearn-pack/chatlog/DATA_DICTIONARY.md`
- CSV nguồn: chỉ sử dụng nội bộ hackathon; không sao chép vào repo công khai.
