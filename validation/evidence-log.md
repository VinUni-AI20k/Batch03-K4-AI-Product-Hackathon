# Nhật Ký Bằng Chứng & Data Mining (Evidence Log)

**Người thực hiện**: Thảo Tiên (Evidence Lead)
**Mục tiêu**: Cung cấp bằng chứng cho `spec.md` §1 theo **cả hai** chuẩn của đề bài — Chuẩn B (mining data pack) và Chuẩn A (khảo sát người thật).

**Hai chuẩn bổ trợ nhau, không trùng nhau:**
- **Chuẩn B — mining** chứng minh pain **tồn tại**: học viên hỏi tutor cái gì, tutor hụt ở đâu.
- **Chuẩn A — khảo sát** chứng minh pain **xảy ra đúng trong bối cảnh Codelab**, thứ mà chatlog không phủ được (toàn bộ chatlog là `in_class` trên trang tài liệu, không có dòng nào phát sinh từ màn hình Codelab).

> **Kiểm chứng số Chuẩn B**: chạy `python validation/mine_chatlog.py` từ thư mục gốc repo — script chỉ đọc data pack và in ra đúng các số trong file này.

---

## 📊 1. Data Mining Log (Chuẩn B)

- **Dataset**: `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv` (data pack được cấp — không commit lên repo nộp bài, chỉ trích dẫn ngắn kèm mã đoạn)
- **Quy mô**: 2.522 dòng = **1.261 turn** (cặp hỏi–đáp) · **369 học viên** (`U0001`–`U0369`) · **585 hội thoại** · 100% `conversation_mode = in_class`

### 1.1 Phương pháp đếm

Ba quy tắc dưới đây viết ra để người ngoài nhóm chạy lại ra cùng kết quả:

1. **Đếm trên dòng `role = tutor`, không đếm cả 2 vai.** Cột `move_used` và `citations` chỉ được hệ thống gán cho lượt trả lời của tutor; dòng `student` luôn để trống. Lấy mẫu số 2.522 dòng thì mẫu số gấp đôi và mọi tỷ lệ sai một nửa. → **Mẫu số chuẩn: 1.261 dòng tutor.**
2. **Intent `review_concept`** = giá trị hệ thống gán sẵn ở cột `move_used` — lượt trả lời nhằm nhắc lại / giải thích lại lý thuyết đã có trong tài liệu (phân biệt với `give_direct_answer`, `give_example`, `give_hint`, `motivate`, `validate_understanding`).
3. **"Trả lời không có trích dẫn"** = cột `citations` đúng bằng chuỗi `[]` (mảng rỗng) — câu trả lời không gắn được về trang tài liệu nào.

### 1.2 Ba số đo được

| # | Chỉ số | Kết quả | Ý nghĩa |
|---|---|---|---|
| **B1** | Lượt tutor có intent `review_concept` | **1.074 / 1.261 = 85,2%** | Áp đảo mọi intent khác (kế tiếp `give_direct_answer` chỉ 11,6%). Việc học viên dùng tutor nhiều nhất là **tra lại lý thuyết**, không phải hỏi cái mới. |
| **B2** | Lượt tutor trả lời **không kèm trích dẫn** (`citations = []`) | **582 / 1.261 = 46,2%** | Gần một nửa câu trả lời không chỉ được về trang tài liệu → học viên không tự kiểm chứng hay quay lại đọc sâu được. Riêng nhóm `review_concept`: 448/1.074 = 41,7%. |
| **B3** | Lượt tutor báo **không tìm được nội dung** | **315 / 1.261 = 25,0%** | Khớp cụm `không tìm thấy / rất tiếc / xin lỗi / không thấy / không tồn tại / nằm ngoài phạm vi`. Cứ 4 câu thì 1 câu tutor bó tay → học viên buộc phải tự đi lật tài liệu. |

**Độ phủ (bao nhiêu người gặp — dùng cho bảng impact `spec.md` §2):**
- **326 / 369 học viên (88,3%)** có ít nhất 1 lượt `review_concept`
- **524 / 585 hội thoại (89,6%)** có ít nhất 1 lượt `review_concept`

**Tín hiệu phụ:** Rating **37 👎 so với 33 👍** (phản hồi tiêu cực nhiều hơn tích cực) · `asked_check_question = True` chỉ **3/2.522** lượt (tutor gần như không bao giờ hỏi lại để kiểm tra hiểu).

### 1.3 Bảy ví dụ nguyên văn từ chatlog

> Mọi quote copy nguyên văn cột `content`, kèm `user_id` và `conversation_id/turn_id` để mở đúng dòng trong CSV đối chiếu. Định dạng `(Trang N, đoạn được chọn: "...")` là cách VLearn ghi lại thao tác học viên bôi đen đoạn tài liệu rồi đặt câu hỏi.

**① `U0141` — `C0390 / T0764`** · `move_used = review_concept` · `citations = []`
> **Học viên:** *"(Trang 10, đoạn được chọn: "khai báo tool ở trang nào") khai báo tool ở trang nào"*
> **Tutor:** *"Việc khai báo tool bằng decorator `@tool` được hướng dẫn tại trang 10 của tài liệu bài học. Bạn có thể xem chi tiết cách triển khai tại đó nhé."*
>
> → Học viên hỏi **đúng câu "ở trang nào"** — đang cần định vị lý thuyết chứ không cần giảng lại. Đúng hành vi mà Q3 khảo sát đo được (95,2% quay lại tìm lý thuyết buổi sáng).

**② `U0015` — `C0451 / T0813`** · `move_used = give_direct_answer` · `citations = []`
> **Học viên:** *"(Trang 10, đoạn được chọn: "rtcf ở slide nào") rtcf ở slide nào"*
> **Tutor:** *"Rất xin lỗi bạn, trong tài liệu của bài học hôm nay không đề cập đến thuật ngữ "rtcf". Có thể bạn đã nhớ nhầm tên gọi hoặc viết tắt của một khái niệm khác?"*
>
> → Học viên **nhớ mang máng tên khái niệm**, gõ tắt/sai, tutor bó tay. Case điển hình của lớp chỗ khó ② (mơ hồ / thiếu thông tin).

**③ `U0065` — `C0578 / T1132`** · `move_used = review_concept` · `citations = [8, 24]`
> **Học viên:** *"(Trang 22, đoạn được chọn: "error matrix ở slide nào") error matrix ở slide nào"*
> **Tutor:** *"Trong bộ tài liệu bài giảng ngày hôm nay, không có nội dung nào đề cập cụ thể đến "error matrix". Có thể bạn đang nhầm lẫn với các khái niệm liên quan đến đánh giá mô hình (evaluation)... [trang 8]"*
>
> → Tutor **đoán ý người dùng và vẫn trích dẫn** dù đã tự nhận là không có nội dung — nguy cơ dẫn học viên tới nhầm chỗ (lớp chỗ khó ①).

**④ `U0067` — `C0001 / T0649`** · `move_used = review_concept` · `citations = []`
> **Học viên:** *"(Trang 37, đoạn được chọn: "tóm tắt nội dung chính trong slide này") tóm tắt nội dung chính trong slide này"*
> **Tutor:** *"Xin lỗi bạn, tôi không tìm thấy nội dung cụ thể cho slide 37 trong tài liệu hiện có. Bạn có thể cung cấp thêm thông tin hoặc tiêu đề của slide đó để tôi có thể hỗ trợ bạn chính xác hơn không?"*
>
> → Học viên đang **đứng ngay trên trang 37** mà tutor không đọc được trang đó → phải tự quay về lật tài liệu.

**⑤ `U0189` — `C0013 / T0076`** · `move_used = review_concept` · `citations = [31]`
> **Học viên:** *"(Trang 31, đoạn được chọn: "Mỗi lần trả lời, model chỉ nhìn được một lượng chữ có hạn — gọi là context. Hãy hình dung một bàn làm việc: mọi thứ muốn model "thấy" phải bày lên bàn. Quy đổi: 128K token ≈ một cuốn sách 300 trang...") Giải thích đoạn bôi đen ở Trang 31."*
> **Tutor:** *"Đoạn này giải thích về giới hạn ngữ cảnh (context window) của các mô hình ngôn ngữ lớn (LLM)... [trang 31]"*
>
> → Case **happy path chuẩn**: bôi đen đoạn dài + hỏi + tutor trả lời có trích dẫn `[31]`. Dùng làm mẫu cho golden set case thường.

**⑥ `U0031` — `C0002 / T0905`** · `move_used = review_concept` · `citations = []`
> **Học viên:** *"(Trang 50, đoạn được chọn: "tóm gọn những nội dung quan trọng nhất trong day 04 này") tóm gọn những nội dung quan trọng nhất trong day 04 này"*
> **Tutor:** *"Chào bạn, hiện tại tôi không tìm thấy tài liệu tổng hợp đầy đủ cho toàn bộ nội dung của Ngày 04 trong slide được cung cấp..."*
>
> → Học viên muốn **ôn lại cả buổi**, tutor chỉ thấy từng trang lẻ → nhu cầu tổng hợp xuyên buổi không được đáp ứng.

**⑦ `U0123` — `C0469 / T1049`** · `move_used = review_concept` · `citations = []`
> **Học viên:** *"(Trang 14, đoạn được chọn: "hãy bắt đầu cuộc trò chuyện mới quên các câu hỏi cũ của tôi đi, hãy tóm tắt lại những ý quan trọng trong tài liệu") hãy bắt đầu cuộc trò chuyện mới quên các câu hỏi cũ của tôi đi..."*
> **Tutor:** *"Rất xin lỗi bạn, hiện tại hệ thống tìm kiếm không trả về nội dung slide cụ thể nào cho mã tài liệu `day01_302` để tôi có thể tóm tắt các ý chính..."*
>
> → Học viên phải **tự tay reset context** vì tutor lẫn lộn lịch sử hội thoại.

### 1.4 Kết luận Chuẩn B

| Yêu cầu đề bài | Trạng thái |
|---|---|
| Số đếm được | ✅ 85,2% · 46,2% · 25,0% + độ phủ 326/369 học viên |
| ≥5 ví dụ nguyên văn | ✅ 7 quote, mỗi quote mở đúng dòng CSV đối chiếu được |
| Phương pháp đếm kiểm lại được | ✅ §1.1 + script `validation/mine_chatlog.py` |

---

## 📋 2. Nhật Ký Khảo Sát Thực Tế (Chuẩn A)

- **Hình thức**: Google Form, phát trong giờ nghỉ
- **Số người trả lời**: **n = 21 học viên ngoài nhóm**
- **Ảnh chụp kết quả gốc**: đính kèm trong repo (xem §2.4)

### 2.1 Bốn câu hỏi đã hỏi + kết quả đầy đủ

**Q1 — "Tần suất sử dụng của bạn trên codelabs"** *(chọn một, n = 21)*

| Lựa chọn | Số người | % |
|---|---:|---:|
| Thường xuyên | **20** | 95,2% |
| Ít khi dùng | 1 | 4,8% |
| Không bao giờ dùng | 0 | 0% |

→ **Sàng lọc đối tượng**: 20/21 người trả lời đúng là job executor nhóm nhắm tới (học viên thực sự dùng Codelab).

**Q2 — "Trung bình mỗi buổi Codelab 3–4 tiếng, bạn phải chuyển tab (từ Codelab sang web lý thuyết/slide/video) khoảng bao nhiêu lần?"** *(chọn một, n = 21)*

| Lựa chọn | Số người | % |
|---|---:|---:|
| Dưới 3 lần | **0** | 0% |
| 3 – 5 lần | 8 | 38,1% |
| 6 – 10 lần | **9** | 42,9% |
| Trên 10 lần (chuyển liên tục) | **4** | 19,0% |

→ **Số mạnh nhất của cả khảo sát**: **21/21 (100%)** chuyển tab ≥3 lần mỗi buổi — **không một ai** chọn "dưới 3 lần". Trong đó **13/21 (61,9%)** chuyển ≥6 lần, và 4 người chuyển **liên tục** (>10 lần). Đây là bằng chứng trực tiếp cho hành vi context-switching, đo đúng trong bối cảnh Codelab.

**Q3 — "Cách bạn tiếp cận bài LAB?"** *(chọn nhiều, n = 21, tổng 45 lượt chọn → trung bình 2,1 cách/người)*

| Lựa chọn | Số người | % |
|---|---:|---:|
| Tìm lại lý thuyết buổi sáng trên VLearn | **20** | 95,2% |
| Hỏi Agent trong IDE | **19** | 90,5% |
| Hỏi AI cách làm bài lab | 6 | 28,6% |

→ **Xác nhận đúng giải pháp hiện tại (alternatives) mà JTBD cần biết**: 95,2% đang **quay lại VLearn lật lý thuyết buổi sáng** — chính xác là hành vi lát cắt nhắm thay thế. Đáng chú ý: 90,5% đã có Agent trong IDE nhưng **vẫn phải rời đi tra lý thuyết** → Agent code hiện có **không giải được** job này, vì nó không nắm nội dung bài giảng. Đây là lý do lát cắt của nhóm không trùng với công cụ sẵn có.

**Q4 — "Bạn đã từng bị trễ deadline Checkpoint hoặc phải nộp bài sát giờ trên Codelab do kẹt ở 1 câu quá lâu mà không biết chưa?"** *(chọn một, n = 21)*

| Lựa chọn | Số người | % |
|---|---:|---:|
| Rất hay gặp (do bị cuốn vào sửa lỗi code mà quên xem đồng hồ) | **17** | 81,0% |
| Thi thoảng (1–2 lần) | 3 | 14,3% |
| Chưa bao giờ (luôn chủ động thời gian) | 1 | 4,8% |

→ **Hậu quả đo được**: **20/21 (95,2%)** từng trễ hoặc nộp sát giờ, trong đó **17/21 (81%) gặp thường xuyên**. Đây là phần "hậu quả gì" của pain statement — không phải bất tiện mơ hồ mà là **rủi ro mất điểm Checkpoint**.

### 2.2 Kết luận Chuẩn A

| Yêu cầu đề bài | Ngưỡng | Thực tế | Đạt? |
|---|---|---|---|
| Số người khảo sát ngoài nhóm | ≥20 | 21 | ✅ |
| Tỷ lệ xác nhận pain | ≥50% | 100% chuyển tab ≥3 lần (Q2) · 95,2% quay lại tra lý thuyết (Q3) · 95,2% từng trễ/sát giờ (Q4) | ✅ |
| Log đủ câu hỏi + từng câu trả lời | đủ | 4/4 câu có nguyên văn câu hỏi + phân bố đầy đủ mọi lựa chọn | ⚠️ xem §2.3 |

### 2.3 Hai việc phải bổ sung trước 23:59 N1

1. **Xuất file phản hồi chi tiết từ Google Form.** Rubric R1 yêu cầu *"log đủ câu hỏi + **từng câu trả lời**"*. Hiện mới có **biểu đồ tổng hợp**; cần export bảng phản hồi (Google Form → Responses → tải Google Sheets/CSV) và lưu vào `validation/` để người chấm xem được từng dòng trả lời. Với câu trắc nghiệm, "nguyên văn" chính là lựa chọn từng người đã chọn.
2. **Bổ sung tên ≥3 willing users.** Khảo sát hiện ẩn danh. Tiêu chí nghiệm thu 5 yêu cầu **≥3 người thật có tên cụ thể** đồng ý thử prototype trước demo → cần hỏi riêng và ghi tên vào `spec.md` §8.

*(Khuyến nghị thêm, không bắt buộc: khảo sát hiện toàn câu trắc nghiệm nên chưa có quote nguyên văn từ người thật. Guide §1.3 gợi ý hỏi thêm 1 câu mở dạng "lần gần nhất bạn phải quay lại tìm lý thuyết khi làm Codelab, bạn đã làm gì?" — chỉ cần 3-5 câu trả lời là có quote cho slide 1 và slide 5.)*

### 2.4 Ảnh chụp kết quả gốc

Lưu 2 ảnh screenshot Google Form vào `validation/survey-screenshots/` và link ở đây để người chấm đối chiếu:
- `survey-q1-q2.png` — Q1 tần suất dùng Codelab · Q2 số lần chuyển tab
- `survey-q3-q4.png` — Q3 cách tiếp cận bài LAB · Q4 trễ deadline Checkpoint

---

## 🔗 3. Chuỗi bằng chứng khép kín (dùng cho `spec.md` §1 và slide 1)

| Mắt xích pain statement | Bằng chứng | Nguồn |
|---|---|---|
| **Ai** — học viên đang làm Codelab | 20/21 dùng Codelab thường xuyên | Q1 |
| **Đang làm gì** — làm bài LAB, cần lý thuyết buổi sáng | 20/21 (95,2%) quay lại VLearn tìm lý thuyết buổi sáng | Q3 |
| **Vướng đâu** — phải rời màn hình code | 21/21 (100%) chuyển tab ≥3 lần/buổi; 13/21 chuyển ≥6 lần | Q2 |
| **Vì sao công cụ sẵn có không cứu được** | 19/21 đã có Agent trong IDE nhưng vẫn phải rời đi tra lý thuyết | Q3 |
| **Nội dung họ cần là gì** — nhắc lại lý thuyết, không phải code | 85,2% lượt hỏi tutor là `review_concept` | B1 |
| **Vì sao tra vẫn khổ** — tutor không chỉ được về nguồn | 46,2% câu trả lời không có trích dẫn; 25,0% tutor báo không tìm thấy | B2, B3 |
| **Hậu quả gì** — mất điểm Checkpoint | 17/21 (81%) rất hay trễ deadline / nộp sát giờ | Q4 |

---

## 📝 Changelog

| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| 2026-07-30 | Thay 5 quote "nguyên văn" cũ bằng **7 quote thật** trích từ CSV | Rà lại từng mã hội thoại thì **cả 5/5 quote cũ đều không tồn tại trong data pack** — sai cả `user_id` lẫn nội dung: `C0015` gán cho `U0042` nhưng thực tế thuộc `U0329` (hỏi về ReAct); `C0089` gán `U0108` nhưng thuộc `U0357`; `C0142`→`U0079`; `C0210`→`U0143`; `C0350`→`U0085`. Quote không đối chiếu được ≠ bằng chứng. |
| 2026-07-30 | Sửa 1.072 → **1.074** turn `review_concept` (85,0% → **85,2%**); 583 → **582** turn `citations = []` | Đếm lại bằng script, chuẩn hoá mẫu số về 1.261 dòng tutor |
| 2026-07-30 | Sửa *"20/21 chuyển tab >5 lần/buổi"* → **13/21 (61,9%) chuyển ≥6 lần**, và bổ sung số mạnh hơn: **21/21 (100%) chuyển ≥3 lần** | Số 20/21 cũ là kết quả của **Q1** (tần suất dùng Codelab), bị gán nhầm sang **Q2** (số lần chuyển tab) |
| 2026-07-30 | **Gỡ** *"trung bình 10-15 phút/lần mò mẫm lật slide"* | Không có câu hỏi nào trong khảo sát đo thời gian → số này không có nguồn. **Cần sửa cả `context.md` §3 và §4 đang dùng số này.** Nếu muốn giữ, phải thêm 1 câu hỏi đo thời lượng và khảo sát lại. |
| 2026-07-30 | Thêm số B3 (25,0% tutor báo không tìm được) + độ phủ 326/369 học viên | Bảng impact `spec.md` §2 cần con số "bao nhiêu người gặp" |
| 2026-07-30 | Thêm §2 đầy đủ 4 câu khảo sát + §3 chuỗi bằng chứng khép kín | Chuẩn A trước đây chỉ có số tổng hợp, không có câu hỏi gốc |
| 2026-07-30 | Thêm `validation/mine_chatlog.py` | Rubric R1 yêu cầu phương pháp đếm kiểm lại được |
