# BÁO CÁO ĐỀ XUẤT BÀI TOÁN — VLEARN AI TUTOR

**Hướng:** A — Tối ưu AI Tutor hiện có  
**Nguồn dữ liệu:** `chat_history_anonymized_for_hackathon.csv`  
**Phạm vi dữ liệu:** 22–29/07/2026  
**Đơn vị phân tích:** một `turn_id` gồm đúng một câu hỏi của học viên và một câu
trả lời của Tutor.

> Trạng thái: bằng chứng mining đã đạt cấu trúc yêu cầu B và đã xác nhận ba willing
> users ngoài nhóm. Nhóm vẫn phải điền tên thành viên/phân công và nên khảo sát
> thêm để lượng hóa hậu quả theo phút/mức độ mất niềm tin trước CP1/CP4.

## 1. Tóm tắt quyết định

### Pain được đề xuất

Khi **học viên đang đọc tài liệu trên VLearn và hỏi Tutor để hiểu một khái niệm**,
nhiều câu trả lời **không cho biết căn cứ nằm ở trang nào**, khiến học viên khó
kiểm tra lại nội dung và không biết nên tin câu trả lời đến mức nào.

Problem statement trên không dùng AI như một giải pháp; “Tutor” chỉ mô tả công cụ
hiện tại trong workflow của người dùng.

### Bằng chứng chính

- Dataset có **1.261 lượt hỏi–đáp**, từ **369 học viên** và **585 hội thoại**.
- Xác định được **740/1.261 lượt có intent học thuật** bằng một quy tắc từ khóa có
  thể chạy lại.
- Trong đó, **258/740 lượt học thuật không có citation — 34,9%**.
- Pain này xuất hiện ở **170 học viên** và **201 hội thoại**.
- Trong nhóm câu hỏi học thuật có rating:
  - Không citation: **16/21 lượt bị downvote — 76,2%**.
  - Có citation: **4/19 lượt bị downvote — 21,1%**.

Rating chỉ bao phủ một phần rất nhỏ dữ liệu và do học viên tự chọn có đánh giá hay
không. Vì vậy, chênh lệch trên là **tín hiệu về niềm tin**, không được diễn giải
thành quan hệ nhân quả.

### Lát cắt prototype — một câu

> Một học viên đang đọc tài liệu và hỏi về một khái niệm được Tutor quyết định chỉ
> trả lời khi tìm được đoạn nguồn phù hợp, đồng thời đặt citation cạnh từng ý chính,
> để học viên kiểm tra lại câu trả lời ngay trong tài liệu.

### Mức automation đề xuất

**Conditional:** Tutor tự trả lời khi tìm được căn cứ đủ mạnh; nếu không có căn cứ
thì nói rõ giới hạn và yêu cầu học viên chọn lại đoạn hoặc chuyển sang câu hỏi cụ
thể hơn.

Lý do theo cost-of-error: kiến thức sai hoặc citation không hỗ trợ nội dung có thể
làm học viên học sai và mất niềm tin. Chi phí yêu cầu thêm ngữ cảnh thấp hơn chi
phí trả lời chắc chắn nhưng không có căn cứ.

## 2. Phương pháp mining có thể kiểm tra lại

### 2.1 Làm sạch và ghép dữ liệu

1. Đọc CSV bằng `pandas`.
2. Kiểm tra không trùng `message_id`, không thiếu `content`.
3. Nhóm theo `turn_id` và xác minh mỗi turn có đúng:
   - một dòng `role = student`;
   - một dòng `role = tutor`.
4. Ghép hai dòng thành một bản ghi để tránh đếm một turn hai lần.

Kết quả: **1.261/1.261 turn** đều ghép được một-một.

### 2.2 Quy tắc xác định câu hỏi học thuật

Một turn được xếp vào nhóm `academic_intent` khi câu hỏi học viên chứa ít nhất một
trong các cụm, không phân biệt hoa thường:

```text
giải thích | tóm tắt | tóm gọn | nội dung | là gì | tại sao | vì sao |
ý nghĩa | phân tích | ví dụ | kiến thức | nắm vững | khái niệm |
so sánh | phân biệt
```

Quy tắc trên tìm được **740 turn**. Đây là heuristic có chủ đích minh bạch, không
phải bộ phân loại intent hoàn hảo. Trước khi đưa vào `spec.md`, nhóm nên đọc tay
20 turn được gắn nhãn và 10 turn không được gắn nhãn để ước lượng false
positive/false negative.

### 2.3 Quy tắc xác định thiếu citation

Một câu trả lời được tính là không citation khi trường cấu trúc `citations` của
message Tutor bằng danh sách rỗng `[]`. Không suy luận citation chỉ từ việc câu trả
lời có hoặc không chứa chữ “trang”.

Mẫu số chính là toàn bộ **740 turn học thuật**, không phải toàn bộ message:

```text
258 turn học thuật không citation / 740 turn học thuật = 34,9%
```

Notebook tái lập toàn bộ phép đếm:
`eda/vlearn_ai_tutor_eda.ipynb`.

## 3. Ví dụ nguyên văn từ dữ liệu

Chỉ trích đoạn ngắn, giữ ID ẩn danh và không ghi danh tính người dùng.

| Turn | Câu hỏi của học viên | Phản hồi Tutor liên quan đến pain |
|---|---|---|
| `T0649` | “tóm tắt nội dung chính trong slide này” | “tôi không tìm thấy nội dung cụ thể cho slide 37…” |
| `T0905` | “tóm gọn những nội dung quan trọng nhất trong day 04 này” | “không tìm thấy tài liệu tổng hợp đầy đủ…” |
| `T0154` | “tại sao có lưu ý như trang 25” | “không thấy trang 25 đề cập đến lưu ý nào như bạn mô tả…” |
| `T0811` | “Designt Pattern ReAct là gì có lưu ý gì về nó?” | “không tìm thấy định nghĩa chi tiết về ‘ReAct’ trong các slide…” |
| `T0122` | “tóm tắt hết slice trong vài câu đi” | “hệ thống chưa trả về kết quả cụ thể để mình có thể tóm tắt…” |
| `T0769` | “giải thích nghĩa chi tiết của trang 4” | “hệ thống tìm kiếm không tìm thấy nội dung cụ thể cho trang 4…” |

Các ví dụ này chứng minh có failure về truy xuất/grounding trong nhóm intent học
thuật. Chúng **không tự chứng minh** mọi câu không citation đều sai. Muốn đánh giá
faithfulness, nhóm phải đối chiếu câu trả lời với slide/transcript nguồn.

## 4. So sánh ba pain candidate

Các số dưới đây dùng cùng đơn vị `turn_id`. “Tổn thất mỗi lần” hiện được biểu diễn
bằng proxy quan sát được; cần khảo sát người dùng để bổ sung số phút hoặc mức độ
mất niềm tin.

| Ứng viên | Quy mô quan sát | Tần suất | Proxy hậu quả/lần | Khả thi trong hackathon | Quyết định |
|---|---:|---:|---|---|---|
| Câu hỏi học thuật không citation | 258 turn, 170 user, 201 hội thoại | 1,52 turn/user bị ảnh hưởng | 16/21 lượt có rating bị downvote | Cao: sửa retrieval threshold, output và fallback | **Chọn** |
| Tutor báo không tìm thấy/không đủ nguồn | 291/1.261 turn theo heuristic ban đầu; 170 user | 1,71 turn/user bị ảnh hưởng | User không hoàn thành job và phải hỏi lại/tự tìm | Trung bình: cần phân biệt lỗi retrieval với câu ngoài phạm vi | Giữ làm failure mode của pain chính |
| Câu trả lời quá dài so với câu hỏi | 316/1.261 turn theo ngưỡng notebook; 150 user | 2,11 turn/user bị ảnh hưởng | Tăng công đọc; chưa có số phút trực tiếp | Cao nhưng “quá dài” phụ thuộc intent và sở thích | Loại ở vòng này |

### Vì sao chọn ứng viên 1

1. Khớp chức năng cốt lõi hiện tại của VLearn: trả lời dựa trên tài liệu và kèm
   citation.
2. Có field cấu trúc `citations`, nên phép đếm rõ ràng và dễ tái lập hơn đánh giá
   “dài” hoặc “đúng giọng”.
3. Có tín hiệu rating nhất quán với hậu quả về niềm tin, dù cỡ mẫu nhỏ.
4. Lát cắt đủ nhỏ để build và demo trong 5 phút: một câu hỏi chuẩn và một trường
   hợp không đủ căn cứ.

### Vì sao chưa chọn ứng viên 2 và 3

- “Không tìm thấy nguồn” đang được phát hiện bằng regex, có thể bắt nhầm các câu
  Tutor giải thích giới hạn hợp lệ hoặc câu hỏi ngoài phạm vi. Nhóm giữ nó làm
  failure mode cho thiết kế conditional.
- “Quá dài” phụ thuộc loại câu hỏi. Chưa có khảo sát chứng minh học viên coi đây là
  pain và chưa đo được thời gian đọc dư thừa.

## 5. Thiết kế lát cắt đủ nhỏ

### Flow prototype

1. Học viên chọn một đoạn/trang và đặt câu hỏi học thuật.
2. Hệ thống truy xuất các đoạn liên quan và tính mức đủ căn cứ.
3. Nếu đủ căn cứ:
   - trả lời ngắn theo từng ý;
   - mỗi ý có citation về trang/đoạn nguồn;
   - học viên có thể mở nguồn để kiểm tra.
4. Nếu không đủ căn cứ:
   - không tự bổ sung kiến thức ngoài nguồn;
   - nói rõ chưa tìm được căn cứ;
   - hỏi lại một câu cụ thể hoặc đề nghị học viên chọn đoạn khác.
5. Học viên có thể báo “citation không hỗ trợ ý này” và hỏi lại.

### Non-goals

- Không xây lại toàn bộ Tutor hoặc VLearn.
- Không hỗ trợ câu hỏi logistics của Discord.
- Không tự động chấm điểm học viên.
- Không đảm bảo trả lời mọi kiến thức ngoài tài liệu khóa học.
- Không làm hệ thống phát hiện toàn bộ misconception trong hackathon.

### Bốn đường đi cần demo

| Đường đi | Hành vi mong muốn |
|---|---|
| Happy path | Có nguồn phù hợp → trả lời và citation cạnh từng ý |
| Low confidence | Nguồn gần đúng nhưng chưa đủ → nói rõ giới hạn và hỏi lại |
| Failure | Không có nguồn → không đoán, đưa bước tiếp theo |
| Correction | User báo citation sai → cho chọn nguồn/đặt lại câu hỏi và sinh lại |

## 6. Điều kiện chấp nhận bài toán

### Tiêu chí 1 — Pain cụ thể

**Đạt ở mức bản thảo.** Đã xác định:

- Ai: học viên đang đọc tài liệu trên VLearn.
- Việc: hỏi để hiểu/tóm tắt/so sánh khái niệm học thuật.
- Vướng: câu trả lời không chỉ ra căn cứ hoặc không tìm được nguồn.
- Hậu quả: khó kiểm chứng và không biết nên tin câu trả lời đến mức nào.

Nhóm nên khảo sát để bổ sung hậu quả định lượng: mất bao nhiêu phút để tìm lại
slide, có bỏ cuộc/hỏi công cụ khác không, mức độ tin giảm bao nhiêu.

### Tiêu chí 2 — Bằng chứng

**Đạt đường B về cấu trúc mining**, với điều kiện nhóm thực hiện và ghi lại bước
đọc tay:

- Có số đếm và mẫu số.
- Có phương pháp đếm chạy lại được.
- Có ít nhất 5 ví dụ nguyên văn kèm `turn_id`.
- Có notebook tái lập.

Để tăng độ chắc, thêm một file review gồm tối thiểu 20 turn flagged và cột
`manual_valid`, `manual_note`.

### Tiêu chí 3 — Impact

**Đạt phần so sánh ứng viên, còn thiếu số tổn thất trực tiếp.**

- Đã so sánh ba pain bằng số user, số turn, số hội thoại và tần suất.
- Đã giữ ứng viên bị loại và lý do.
- Có rating làm proxy cho trust.
- Cần khảo sát để bổ sung “mỗi lần tốn gì” bằng phút, hành vi hỏi lại hoặc mức tin.

### Tiêu chí 4 — Lát cắt prototype

**Đạt.** Lát cắt có một user, một job, một quyết định trung tâm và một kết quả;
flow có thể demo bằng một case có nguồn và một case thiếu nguồn trong 5 phút.

### Tiêu chí 5 — Có người sẵn sàng thử

**Đạt yêu cầu CP1:** đã có ba người thật ngoài nhóm đồng ý thử prototype.

| Người thử | Vai trò | Đã đồng ý? | Thời gian dự kiến |
|---|---|---|---|
| Lâm Vũ | Học viên lớp D303 | Có | 14:00 ngày 2 |
| Lê Văn Tuấn | Học viên lớp D303 | Có | 14:00 ngày 2 |
| Cao Hương Giang | Học viên lớp D303 | Có | 14:00 ngày 2 |

Trước CP5 cần validation với ít nhất 5 người ngoài nhóm, trong đó có ít nhất 2
người thuộc danh sách willing users trên.

## 7. Khảo sát tối thiểu cần làm tiếp

Mining đã đủ cho đường bằng chứng B, nhưng khảo sát sẽ giúp chứng minh hậu quả và
hoàn thiện impact. Không hỏi “Bạn có muốn tính năng citation không?”. Hỏi về lần
gần nhất:

1. Lần gần nhất Tutor trả lời nhưng bạn không chắc câu trả lời đúng, bạn đã làm gì?
2. Bạn mất khoảng bao nhiêu phút để kiểm tra lại?
3. Bạn mở lại slide, hỏi bạn/TA, dùng ChatGPT khác hay bỏ qua?
4. Citation hiện tại có giúp bạn tìm đúng đoạn nguồn không? Hãy mô tả một lần cụ thể.
5. Nếu Tutor không tìm được nguồn, phản hồi nào giúp bạn tiếp tục công việc?

Nếu dùng đường khảo sát A: cần ít nhất 20 người ngoài nhóm, ít nhất 50% xác nhận
pain và lưu **toàn bộ câu hỏi cùng từng câu trả lời nguyên văn**.

## 8. Đề xuất quality metrics cho prototype

Các ngưỡng dưới đây là đề xuất, nhóm phải chốt trong `spec.md` trước hạn:

- **Citation coverage:** 100% câu trả lời có claim học thuật phải có ít nhất một
  citation.
- **Citation faithfulness:** citation thực sự hỗ trợ claim, chấm tay theo rubric.
- **Abstention correctness:** không đủ nguồn thì không đưa claim ngoài nguồn.
- **Answer relevance:** trả lời đúng câu hỏi, không chỉ lặp lại tài liệu.
- **Correction success:** user báo citation sai thì có thể sửa/hỏi lại trong flow.

Golden set cần tối thiểu 20 case và phủ bốn lớp chỗ khó; ít nhất 10 case phát triển
từ chatlog thật. Không sử dụng chính các case test để chỉnh output thủ công trong
demo.

## 9. Kết luận

Data mining cho thấy pain “câu hỏi học thuật không có citation đáng kiểm tra” có
quy mô đủ lớn, xuất hiện trên nhiều người dùng và có tín hiệu liên quan đến
downvote. Đây là lựa chọn phù hợp cho hướng A vì:

- có bằng chứng tái lập được;
- bám đúng chức năng cốt lõi của Tutor;
- có failure mode rõ;
- có thể tạo golden set;
- build và demo được trong thời gian cuộc thi.

**Quyết định cuối chỉ nên chốt sau khi** review tay để xác nhận độ chính xác của
heuristic. Yêu cầu ba willing users thật đã hoàn thành.
