# AI SPEC — Learning Trace: Note & Mindmap cá nhân hóa trên VLearn

Hướng: **A — VLearn**  
Loại: **Tính năng AI mới**

> Bản hiện tại chỉ ghi nhận các nội dung nhóm đã chốt. Các phần chưa có bằng chứng hoặc chưa thực hiện sẽ được bổ sung sau.

## §1. User & Job

### Job executor

Học viên vừa kết thúc một buổi học trên VLearn và đã có một hoặc nhiều lượt trao đổi với AI Tutor trong buổi đó.

### Workflow hiện tại

1. Học viên đọc slide/tài liệu và đặt câu hỏi cho AI Tutor tại những chỗ cần tìm hiểu thêm.
2. Các câu hỏi và câu trả lời được lưu thành từng lượt hội thoại.
3. Cuối buổi, học viên chưa có một bản tổng hợp riêng cho mình về:
   - những chủ đề đã tìm hiểu;
   - phần nào còn có dấu hiệu chưa hiểu rõ;
   - kiến thức liên quan giữa các chủ đề;
   - nội dung nào nên xem lại trong tài liệu chính thức.
4. Muốn ôn lại, học viên phải tự đọc lại lịch sử chat, slide và các ghi chú rời rạc.

### Core JTBD

**Nhận ra phần kiến thức mình đã tìm hiểu và phần có thể còn chưa vững sau một buổi học, rồi hệ thống hóa chúng thành tài liệu dễ ôn lại.**

### Problem statement

Sau mỗi buổi học, các dấu vết học tập của học viên đang nằm rời rạc trong lịch sử hỏi–đáp. Học viên không có một bản tổng hợp cá nhân để biết mình đã tìm hiểu gì, nội dung nào cần xem lại và các khái niệm liên hệ với nhau ra sao, vì vậy khó quyết định nên ưu tiên ôn phần nào.

### Quan sát ban đầu từ dữ liệu hiện có

- Data pack có **1.261 lượt hỏi–đáp** giữa học viên và AI Tutor của **369 học viên**.
- Trường `misconceptions` và `follow_ups` chưa từng có dữ liệu; hệ thống hiện chưa lưu kết quả phân tích lỗ hổng kiến thức ở dạng có cấu trúc.
- Chỉ có **3 lượt** Tutor đặt câu hỏi kiểm tra lại mức độ hiểu bài (`asked_check_question=True`).
- **46,2%** phản hồi Tutor không có citation. Vì vậy, câu trả lời của Tutor không được mặc định là nguồn sự thật khi tạo note hoặc mindmap; nội dung sinh ra phải được đối chiếu với slide/transcript chính thức.

Các quan sát trên chứng minh hệ thống chưa có learning trace có cấu trúc. Mức độ đau và hậu quả đối với học viên cần tiếp tục được kiểm chứng bằng mining chi tiết và khảo sát người dùng.

## §2. Impact & quyết định chọn

### Hướng giải pháp đã chọn

Tạo một trải nghiệm cuối buổi dùng lịch sử tương tác của **chính học viên đó trong buổi học hiện tại** để sinh ra hai cách nhìn của cùng một learning trace:

1. **Personalized Note:** tổng hợp các chủ đề đã tìm hiểu, giải thích lại bằng nguồn chính thức và gợi ý phần nên xem lại.
2. **Personalized Mindmap:** trực quan hóa các khái niệm trong note và mối liên hệ giữa chúng.

Note và mindmap không phải hai tính năng độc lập. Cả hai phải được sinh từ cùng một kết quả phân tích, dùng chung nguồn và cập nhật đồng bộ khi học viên sửa hoặc xác nhận lại thông tin.

### Lý do chưa phát triển quiz

Quiz là một cơ chế đánh giá riêng, cần thêm thiết kế câu hỏi, chấm đáp án và tiêu chí đo năng lực. Trong lát cắt hiện tại, nhóm tập trung vào việc giúp học viên nhìn lại learning trace và chủ động xác nhận phần chưa vững. Quiz chưa nằm trong phạm vi prototype.

## §4. Thiết kế

### Lát cắt MỘT CÂU

**Khi một học viên vừa kết thúc buổi học muốn biết mình nên ôn lại gì, hệ thống phân tích lịch sử hỏi–đáp của học viên để quyết định các chủ đề đã tìm hiểu và các điểm có khả năng chưa vững, rồi tạo note cùng mindmap có căn cứ để học viên xem lại, xác nhận và chỉnh sửa.**

### Nguyên tắc diễn giải signal

Hệ thống phải phân biệt ba loại kết quả:

1. **Đã tìm hiểu:** học viên có câu hỏi học thuật liên quan đến chủ đề; chưa kết luận học viên yếu ở chủ đề đó.
2. **Có khả năng chưa vững:** có bằng chứng từ hành vi của học viên như nói rõ “chưa hiểu”, hỏi lại cùng nội dung sau khi đã được giải thích, hoặc chủ động sửa/phản biện nhưng vấn đề chưa được giải quyết.
3. **Chưa đủ dữ liệu để kết luận:** Tutor từ chối, trả lời không có căn cứ, log bị thiếu, câu hỏi quá ngắn hoặc chỉ là chào hỏi.

Các signal sau **không được dùng độc lập** để kết luận học viên hổng kiến thức:

- Học viên đặt một câu hỏi nâng cao.
- Tutor không trả lời được hoặc không có citation.
- Học viên đánh giá `down`, vì đây có thể là đánh giá chất lượng câu trả lời chứ không phải năng lực của học viên.
- Một khái niệm xuất hiện một lần trong hội thoại.

### Dữ liệu đầu vào

- `user_id`, `conversation_id`, `turn_id`, `day_code`.
- Câu hỏi của học viên và câu trả lời của Tutor trong buổi học.
- Trang/đoạn được học viên chọn khi đặt câu hỏi.
- Citation và rating của từng lượt nếu có.
- Slide và transcript chính thức tương ứng với `day_code`.

Hệ thống chỉ sử dụng dữ liệu của học viên đang xem kết quả, trong phạm vi buổi học được chọn.

### Kết quả phân tích trung gian

Mỗi lần sinh note/mindmap cần tạo được cấu trúc dữ liệu gồm:

- `topics_explored`: các chủ đề học viên đã tìm hiểu;
- `possible_gaps`: các điểm có khả năng chưa vững;
- `unassessable_items`: các lượt không đủ dữ liệu để kết luận;
- `evidence_turn_ids`: các lượt chat làm căn cứ cho từng nhận định;
- `source_citations`: trang slide hoặc mã transcript hỗ trợ phần giải thích;
- `confidence`: mức tin cậy và lý do;
- `relationships`: quan hệ giữa các khái niệm dùng để dựng mindmap.

### Output cho học viên

#### Personalized Note

- Tóm tắt ngắn các chủ đề đã tìm hiểu trong buổi.
- Giải thích lại từng chủ đề bằng slide/transcript chính thức.
- Tách rõ “đã tìm hiểu” và “có khả năng chưa vững”.
- Mỗi nhận định về learning trace trỏ được về lượt chat liên quan.
- Mỗi nội dung kiến thức trỏ được về trang slide hoặc mã transcript.
- Cho phép học viên xác nhận “Đúng, mình chưa vững”, “Mình đã hiểu” hoặc sửa nội dung.

#### Personalized Mindmap

- Node gốc là buổi học hiện tại.
- Node cấp một là các chủ đề đã tìm hiểu.
- Node con là khái niệm, giải thích ngắn và phần có khả năng cần ôn lại.
- Node hoặc quan hệ chỉ được hiển thị khi có căn cứ từ tài liệu chính thức.
- Trạng thái “cần xem lại” phải được thể hiện như một gợi ý có độ tin cậy, không phải kết luận hay điểm số.
- Khi học viên sửa/xác nhận note, mindmap phải cập nhật theo cùng dữ liệu.

### Luồng trải nghiệm chính

1. Học viên kết thúc buổi và chọn **“Xem learning trace của tôi”**.
2. Hệ thống hiển thị phạm vi đang phân tích: tên buổi, số lượt chat và nguồn tài liệu có sẵn.
3. Hệ thống phân tích log và đối chiếu nội dung với nguồn chính thức.
4. Học viên nhận note và mindmap, trong đó các nhận định đều có evidence/citation và mức tin cậy.
5. Học viên xác nhận, gạt bỏ hoặc chỉnh sửa một điểm được gợi ý.
6. Note và mindmap được cập nhật đồng bộ theo phản hồi đó.

### Non-goals

- Không sinh quiz hoặc chấm đáp án trong prototype hiện tại.
- Không chấm điểm, xếp loại năng lực hay khẳng định học viên “yếu” một chủ đề.
- Không so sánh học viên với bạn học hoặc tạo bảng xếp hạng.
- Không tạo bản đồ lỗ hổng cấp lớp cho giảng viên trong lát cắt hiện tại.
- Không trả lời câu hỏi mới như một chatbot tổng quát trong màn hình note/mindmap.
- Không dùng kiến thức ngoài slide/transcript chính thức để bổ sung nội dung khóa học.

### Mức tự động hóa

**Conditional automation.**

- Khi đủ log và nguồn chính thức: hệ thống tự sinh note/mindmap.
- Khi signal yếu: chỉ ghi nhận “đã tìm hiểu” hoặc “chưa đủ dữ liệu”, không suy luận thành lỗ hổng.
- Khi thiếu nguồn hoặc citation không kiểm chứng được: bỏ nội dung đó khỏi phần giải thích, thông báo giới hạn và cho học viên mở lại lượt chat gốc.
- Học viên luôn có quyền xác nhận, sửa hoặc gạt bỏ nhận định.

Lý do theo cost-of-error: kết luận sai rằng học viên chưa hiểu một chủ đề có thể làm họ ôn sai trọng tâm và giảm niềm tin vào VLearn. Chi phí cho một lần suy luận sai cao hơn lợi ích của việc tự động điền đầy đủ mindmap, vì vậy hệ thống phải ưu tiên thiếu có báo hơn là đoán.

### §4b. Nguyên tắc HAX/PAIR đã áp dụng

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| G1 — Làm rõ hệ thống làm được gì | Trước khi phân tích, màn hình nói rõ hệ thống chỉ tổng hợp từ log của buổi hiện tại và nguồn học liệu chính thức. |
| G2 — Làm rõ nó làm tốt đến đâu | Mỗi possible gap có mức tin cậy, lý do và nhãn “gợi ý cần xác nhận”, không trình bày như kết luận chắc chắn. |
| G9 — Sửa dễ dàng | Học viên có thể chọn “Mình đã hiểu”, “Đúng, cần xem lại” hoặc sửa tên/chủ đề; note và mindmap cập nhật đồng bộ. |
| G10 — Thu hẹp phạm vi khi nghi ngờ | Signal không đủ thì chuyển sang “chưa đủ dữ liệu”, không suy luận lỗ hổng. Thiếu tài liệu thì không sinh giải thích. |
| G11 — Giải thích vì sao | Mỗi nhận định trỏ về `turn_id`; mỗi kiến thức trong note/mindmap trỏ về trang slide hoặc mã transcript. |
| G15 — Mời feedback chi tiết | Học viên có thể phản hồi lý do một gợi ý chưa đúng để hệ thống cập nhật learning trace hiện tại. |

## §5. Kiểu lỗi — 4 lớp chỗ khó và kịch bản

| # | Tình huống cụ thể | Lớp | Hành vi mong muốn | Nguyên tắc |
|---|---|---|---|---|
| 1 | Tutor từng trả lời một nội dung không có citation hoặc có khả năng bịa | ① Nguồn sự thật | Không dùng câu trả lời Tutor làm kiến thức chuẩn; đối chiếu slide/transcript. Không đối chiếu được thì đưa vào `unassessable_items`. | G10, G11 |
| 2 | Log có câu hỏi nhưng tài liệu tương ứng với `day_code` bị thiếu | ① Nguồn sự thật | Chỉ hiển thị chủ đề đã hỏi, không sinh phần giải thích hoặc quan hệ kiến thức; thông báo rõ nguồn còn thiếu. | G1, G10 |
| 3 | Học viên chỉ hỏi “là gì?”, “hả?” hoặc chào hỏi | ② Mơ hồ/thiếu thông tin | Không kết luận là lỗ hổng; gắn nhãn chưa đủ signal hoặc loại khỏi learning trace nếu không phải câu hỏi học thuật. | G2, G10 |
| 4 | Học viên hỏi một câu rất nâng cao về chủ đề | ② Mơ hồ/thiếu thông tin | Ghi nhận là chủ đề đã tìm hiểu; không suy luận học viên yếu nếu không có thêm hành vi thể hiện chưa hiểu. | G2, G11 |
| 5 | Log chứa câu hỏi deadline, link nộp bài hoặc logistics | ③ Ngoài phạm vi/thẩm quyền | Loại khỏi knowledge note/mindmap; không dùng để đánh giá hiểu biết. Có thể dẫn về nguồn logistics chính thức nếu sản phẩm hỗ trợ. | G1, G10 |
| 6 | Học viên yêu cầu hệ thống chấm điểm hoặc xếp hạng năng lực | ③ Ngoài phạm vi/thẩm quyền | Từ chối chấm điểm; giải thích đây chỉ là learning trace định tính và cho phép học viên tự xác nhận. | G1, G2 |
| 7 | Một thuật ngữ xuất hiện ở nhiều buổi với ý nghĩa/ngữ cảnh khác nhau | ④ Đặc thù domain | Giữ ranh giới theo `day_code`, trang và transcript; không tự gộp node nếu chưa có nguồn chứng minh quan hệ. | G10, G11 |
| 8 | Mindmap tạo quan hệ hợp lý về ngôn ngữ nhưng sai kiến thức khóa học | ④ Đặc thù domain | Chỉ giữ edge có citation hỗ trợ; cho học viên gạt bỏ/sửa và tái sinh hai view đồng bộ. | G9, G11 |

## §6. Bốn đường đi của trải nghiệm

### Happy path

Log đủ, nguồn chính thức đầy đủ và có signal rõ. Hệ thống sinh note/mindmap, phân biệt topic với possible gap, kèm evidence, citation và mức tin cậy. Học viên xác nhận hoặc chỉnh sửa.

### Low-confidence

Hệ thống thấy học viên đã hỏi về một chủ đề nhưng không có bằng chứng cho thấy chưa hiểu. Chủ đề chỉ xuất hiện ở “Đã tìm hiểu”; phần “Có khả năng chưa vững” ghi chưa đủ dữ liệu thay vì suy đoán.

### Failure/không có căn cứ

Không tìm được slide/transcript tương ứng hoặc Tutor đã trả lời nhưng không thể kiểm chứng. Hệ thống không sinh phần giải thích kiến thức, ghi rõ lượt nào chưa đánh giá được và cho học viên mở lại chat gốc.

### Correction

Học viên đánh dấu một possible gap là “Mình đã hiểu”, sửa tên chủ đề hoặc gạt bỏ một quan hệ trong mindmap. Hệ thống lưu phản hồi cho learning trace hiện tại và cập nhật đồng bộ note/mindmap.

### Khi bị đòi ngoài phạm vi

Yêu cầu chấm điểm, xếp hạng, so sánh với người khác hoặc xử lý logistics không được đưa vào phân tích kiến thức. Hệ thống giải thích phạm vi và chỉ giữ các nội dung học thuật của buổi.

### Case đặc thù domain

Mọi giải thích kiến thức và quan hệ trong mindmap phải truy về nguồn học liệu chính thức. Signal hành vi chỉ dùng để quyết định phần nào cần gợi ý xem lại, không được dùng làm nguồn xác nhận kiến thức.

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| 2026-07-30 | Khởi tạo spec cho tính năng Learning Trace gồm note và mindmap cá nhân hóa từ AI Tutor log | Chốt hướng A — tính năng mới trên VLearn; chưa phát triển quiz |
