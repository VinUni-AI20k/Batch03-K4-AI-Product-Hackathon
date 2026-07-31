# Problem Statement — AI Learning Bridge Agent
## Pain Point: Bài giảng rời rạc, thiếu liên kết giữa các ngày

**Hướng:** A — VLearn · Tính năng AI mới  
**Nhóm:** BrainStormers

---

## §1. Bài toán cốt lõi (6 yếu tố — theo khung Day 02)

### 1.1 Bài toán (Problem — 1 câu, KHÔNG chữ AI)

> Học viên khoá AI Thực Chiến không nhận ra mối liên hệ giữa nội dung các buổi học, dẫn đến kiến thức bị phân mảnh, khó hình thành tư duy hệ thống, và giảm động lực tiếp tục học.

### 1.2 Đối tượng ảnh hưởng (Actor)

| Actor | Mô tả | Tần suất gặp pain |
|---|---|---|
| **Học viên đang trong buổi học** | ~1.000 học viên K3 & K4, học theo từng "day" trên VLearn | Mỗi buổi học (hàng ngày) |
| **Học viên bỏ lỡ buổi trước** | Học viên nghỉ 1 buổi, quay lại không có context | Ước tính 10–15% mỗi buổi |
| **Trợ giảng (TA)** | Phải trả lời câu hỏi lặp về "buổi trước dạy gì" | Hàng ngày, nhiều lần |

**Primary actor:** Học viên đang trong buổi học — chiếm số lượng lớn nhất và gặp pain thường xuyên nhất.

### 1.3 Quy trình hiện tại (Workflow — 5 bước)

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ ① Kết thúc  │───▶│ ② Bắt đầu   │───▶│ ③ Cố nhớ lại │───▶│ ④ Bối rối    │───▶│ ⑤ Hỏi hoặc  │
│ buổi học N  │    │ buổi N+1     │    │ buổi trước   │    │ không thấy   │    │ bỏ qua, học  │
│ (đóng tab)  │    │ (vào VLearn) │    │ dạy gì       │    │ liên kết     │    │ như mới 100%) │
└─────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

**Mô tả chi tiết:**

1. **Kết thúc buổi N**: Học viên hoàn thành buổi học, đóng tab — không có recap hay tóm tắt kiến thức.
2. **Bắt đầu buổi N+1**: Vào VLearn, bắt đầu buổi mới hoàn toàn — giao diện không nhắc gì về buổi cũ.
3. **Cố nhớ lại**: Tự tua lại slide/video buổi trước (nếu nhớ), hoặc hỏi bạn bè, hoặc hỏi AI tutor trên VLearn.
4. **Bối rối**: Không thấy kiến thức mới liên hệ thế nào với kiến thức cũ → học bị phân mảnh.
5. **Hỏi hoặc bỏ qua**: Một số hỏi TA trên Discord → TA trả lời lặp; đa số chấp nhận học rời rạc.

### 1.4 Nút thắt & Tác động (Bottleneck + Impact)

| Nút thắt | Vị trí | Tác động |
|---|---|---|
| **Không có recap sau mỗi buổi** | Bước ① → ② | Kiến thức "bay hơi" qua đêm; Ebbinghaus forgetting curve — quên 50–80% sau 24h nếu không ôn |
| **Không có bridge content giữa các ngày** | Bước ② → ③ | Học viên vào buổi mới như "trang giấy trắng", không biết hôm qua học gì liên quan đến hôm nay |
| **Không có checklist chuẩn bị** | Trước bước ② | Học thụ động, không pre-activate kiến thức cũ → khó tiếp thu kiến thức mới |
| **Câu hỏi lặp cho TA** | Bước ⑤ | TA mất thời gian trả lời "buổi trước học gì" — tải trọng không cần thiết |

**Tác động lượng hóa (ước tính — cần mining xác minh):**

| Chỉ số | Hiện trạng (Baseline) | Nguồn |
|---|---|---|
| Tỷ lệ chatlog hỏi lại kiến thức buổi cũ | Cần mining — ước tính 15–25% hội thoại liên quan đến "ôn lại" | `chat_history_anonymized_for_hackathon.csv` |
| Thời gian tự tìm lại nội dung cũ | Ước tính 10–20 phút/buổi/học viên | Khảo sát |
| Tỷ lệ học viên không hoàn thành khóa | Cần data thực | VLearn analytics |

### 1.5 Chỉ số đo thành công (Success Metric)

| Chỉ số | Baseline | Target | Cách đo |
|---|---|---|---|
| **Thời gian ôn lại** trước khi bắt đầu buổi mới | ~15 phút (ước tính) | ≤ 3 phút (đọc recap) | Log thời gian trên VLearn |
| **Tỷ lệ câu hỏi "buổi trước dạy gì"** gửi TA | Cần mining | Giảm ≥ 40% | So sánh chatlog trước/sau |
| **Điểm quiz liên kết** (kiểm tra hiểu liên hệ giữa các buổi) | Chưa có | ≥ 70% đúng trên quiz bridge | Quiz tự sinh, chấm tự động |
| **Cảm nhận liên kết** (khảo sát) | Cần khảo sát baseline | ≥ 60% xác nhận "thấy rõ liên kết" | Khảo sát Likert 5 mức |

### 1.6 Ranh giới (Boundary)

| AI ĐƯỢC làm | AI KHÔNG ĐƯỢC làm |
|---|---|
| ✅ Tóm tắt nội dung từ transcript/slide đã có | ❌ Bịa nội dung không có trong tài liệu gốc |
| ✅ Chỉ ra mối liên hệ giữa các buổi dựa trên nội dung thật | ❌ Đưa ra nhận định chuyên môn không có căn cứ |
| ✅ Sinh checklist chuẩn bị dựa trên nội dung buổi tiếp | ❌ Thay thế vai trò giảng viên trong việc giảng bài |
| ✅ Sinh quiz nhanh để ôn lại | ❌ Chấm điểm chính thức hoặc đánh giá năng lực |
| ✅ Hiển thị knowledge map dạng sơ đồ | ❌ Gợi ý bỏ qua nội dung hoặc tự quyết lộ trình |

---

## §2. Quyết định AI (3 yếu tố — theo PAIR)

### 2.1 PAIR Bước ① — Có thực sự cần AI?

**Câu hỏi**: Bài toán này nằm trong nhóm "AI probably better" không?

| Tiêu chí PAIR | Đánh giá |
|---|---|
| **Hiểu ngôn ngữ tự nhiên** | ✅ Cần đọc hiểu transcript/slide để tóm tắt và tìm liên kết |
| **Cá nhân hóa** | ✅ Mỗi học viên có tiến độ khác nhau, bỏ lỡ buổi khác nhau |
| **Tổng hợp đa nguồn** | ✅ Cần kết hợp slide + transcript + chatlog để tạo recap toàn diện |
| **Nội dung động thay giao diện tĩnh** | ✅ Recap và bridge content cần thay đổi theo từng cặp buổi |

**Kết luận**: ✅ **Có cần AI** — không thể viết rule tĩnh vì nội dung mỗi buổi khác nhau, mối liên hệ giữa các buổi đa dạng và cần khả năng tổng hợp ngôn ngữ tự nhiên.

**Giải pháp phi AI đã cân nhắc:**

| Giải pháp phi AI | Tại sao chưa đủ |
|---|---|
| TA viết recap thủ công | Không scale cho 6+ buổi × nhiều khóa; chất lượng không đồng nhất; tốn thời gian TA |
| Trang "mục lục" tĩnh giữa các buổi | Chỉ liệt kê chủ đề, không giải thích liên hệ; không cá nhân hóa theo ai bỏ lỡ buổi nào |
| Email tóm tắt sau mỗi buổi | Passive — không tích hợp vào trải nghiệm học; không tương tác; mọi người nhận giống nhau |

### 2.2 PAIR Bước ② — Automate hay Augment?

**Phân tích theo cost-of-error:**

| Tác vụ | Mức tự động | Lý do (cost-of-error) |
|---|---|---|
| **Sinh recap sau buổi học** | **Conditional** — AI tự sinh khi có căn cứ transcript/slide; chuyển TA review nếu nội dung mơ hồ | Recap sai kiến thức → học viên ôn sai → hậu quả trung bình. Có thể giảm rủi ro bằng trích dẫn nguồn |
| **Hiển thị bridge (liên kết giữa 2 buổi)** | **Augment** — AI gợi ý liên kết, hiển thị kèm trích dẫn, học viên tự đánh giá | Nếu liên kết sai → học viên hiểu sai logic xuyên suốt → hậu quả cao |
| **Sinh checklist chuẩn bị** | **Automate** — AI tự sinh, user tự thấy và bỏ qua được | Checklist sai → user bỏ qua, chi phí thấp |
| **Quiz nhanh ôn lại** | **Conditional** — AI sinh, nhưng đáp án phải trace về tài liệu | Quiz có đáp án sai → học viên học sai kiến thức → hậu quả cao |

### 2.3 PAIR Bước ③ — Reward Function & Success Criteria

**Bốn kết quả có thể xảy ra — Case: AI gợi ý mối liên hệ giữa buổi N-1 và buổi N**

| Kết quả | Mô tả | Hậu quả |
|---|---|---|
| **TP** (True Positive) | Buổi N dùng khái niệm từ buổi N-1 → AI chỉ ra đúng liên kết | ✅ Học viên thấy mạch kiến thức, học hiệu quả hơn |
| **TN** (True Negative) | Hai buổi ít liên quan → AI không ép tạo liên kết | ✅ Không gây nhiễu, đúng hành vi |
| **FP** (False Positive) | AI bịa ra liên kết không có thật giữa hai buổi | ❌ Học viên hiểu sai mạch kiến thức → **hậu quả nghiêm trọng** |
| **FN** (False Negative) | Có liên kết thật nhưng AI bỏ sót | ⚠️ Học viên không thấy liên kết → trải nghiệm giống cũ, không tệ hơn |

**Đánh đổi Precision ↔ Recall:**

> **Ưu tiên Precision cao** — Mỗi liên kết AI chỉ ra phải có căn cứ rõ ràng trong tài liệu (trích dẫn cụ thể đoạn/trang). Chấp nhận bỏ sót một vài liên kết (FN) hơn là đưa ra liên kết sai (FP), vì liên kết sai gây hiểu lầm kiến thức.

**Tiêu chí thành công (theo template PAIR):**

> *If* tỷ lệ recap có thông tin không trace được về tài liệu gốc *goes above* 15% trong 1 tuần, *we will* chuyển toàn bộ recap sang chế độ "TA duyệt trước khi publish" và review lại prompt.

---

## §3. Thiết kế giải pháp

### 3.1 Lát cắt MỘT CÂU

> **Một học viên** bắt đầu buổi học Day 02 trên VLearn · AI **tự động hiển thị recap Day 01 + bridge chỉ ra kiến thức Day 01 nào là nền tảng cho Day 02** · kèm trích dẫn cụ thể từ transcript/slide · giúp học viên **nắm được mạch kiến thức trong ≤3 phút** thay vì tự tìm lại trong 15 phút.

### 3.2 Cấp độ giải pháp: Workflow (Cấp 2)

**Tại sao không phải Rule (Cấp 1)?**
- Nội dung mỗi buổi khác nhau → không viết được rule tĩnh cho mối liên hệ.
- Cần hiểu ngữ cảnh và tổng hợp ngôn ngữ tự nhiên.

**Tại sao không phải Agent (Cấp 3)?**
- Không cần nhiều bước tự quyết, không cần dùng nhiều tool phức tạp.
- Input ổn định (transcript + slide), output có cấu trúc rõ (recap + bridge + checklist).
- Ưu tiên giải pháp đơn giản nhất đủ giải quyết bài toán.

**Workflow pattern — Prompt Chaining:**

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  LLM Call 1     │     │    Gate          │     │  LLM Call 2     │
│  Tóm tắt buổi  │────▶│  Kiểm tra recap │────▶│  Tìm liên kết   │
│  N-1 từ tài    │     │  có cite không?  │     │  N-1 → N,       │
│  liệu gốc     │     │  (có → tiếp,     │     │  sinh bridge +  │
│                │     │   không → retry)  │     │  checklist       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │  Output         │
                                                │  · Recap        │
                                                │  · Bridge map   │
                                                │  · Checklist    │
                                                │  · Quiz (opt.)  │
                                                └─────────────────┘
```

### 3.3 Bốn tính năng cốt lõi của AI Agent

| # | Tính năng | Mô tả | Nguồn dữ liệu |
|---|---|---|---|
| 1 | **Recap sau buổi học** | Tóm tắt 5–7 ý chính buổi vừa học, kèm trích dẫn [trang/đoạn] | Transcript + Slide |
| 2 | **Bridge Map** | Chỉ ra 2–4 khái niệm buổi trước là nền tảng cho buổi hôm nay, giải thích tại sao | Transcript + Slide cả 2 buổi |
| 3 | **Checklist chuẩn bị** | 3–5 mục cần ôn/chuẩn bị trước buổi tiếp theo | Slide buổi tiếp (nếu có) |
| 4 | **Quick Quiz** | 3–5 câu hỏi trắc nghiệm kiểm tra hiểu liên kết giữa 2 buổi | Nội dung cả 2 buổi |

### 3.4 Ví dụ minh hoạ cụ thể (Day 01 → Day 02)

**Recap Day 01** (tự động sinh từ transcript/slide):
> - LLM không phải chatbot — là bộ não ngôn ngữ nền [slide 10]
> - Token = mảnh chữ, mỗi token có giá — output đắt gấp 3–5× input [slide 13, 27]
> - Giới hạn bẩm sinh: hallucination, bong bóng thời gian, context hạn chế [slide 20]
> - 4 level agent: LLM trần → có tools → planning → multi-agent [slide 23–24]
> - Prompt 4 lớp: System instruction → User input → Context → Output format [slide 28]

**Bridge Day 01 → Day 02** (AI chỉ ra liên kết):
> 🔗 **Giới hạn bẩm sinh** (Day 01, slide 20) → Day 02 sẽ dùng chính những giới hạn này để giải thích **khi nào AI KHÔNG phù hợp** (PAIR "AI probably NOT better").
> 
> 🔗 **4 level Agent** (Day 01, slide 23–24) → Day 02 mở rộng thành **3 cấp giải pháp: Rule / Workflow / Agent** — cùng ý tưởng "bắt đầu đơn giản, chỉ nâng khi cần".
> 
> 🔗 **Token có giá** (Day 01, slide 27) → Day 02 dùng để **đánh giá feasibility kinh tế** khi viết Problem Statement.

**Checklist trước Day 02:**
> - [ ] Ôn lại: LLM có 3 giới hạn bẩm sinh nào? (slide 20)
> - [ ] Ôn lại: 4 level agent khác nhau thế nào? (slide 23–24)
> - [ ] Suy nghĩ: Trong công việc bạn, AI đang giúp gì? Có chỗ nào AI không phù hợp?

---

## §4. Bốn lớp chỗ khó (Taxonomy)

| Lớp | Câu hỏi | Rủi ro cụ thể | Hành vi mong muốn |
|---|---|---|---|
| ① **Nguồn sự thật** | Recap/bridge có thông tin AI bịa ra không? | AI hallucinate liên kết không tồn tại giữa hai buổi | Mọi thông tin phải trích dẫn [đoạn X, slide Y]. Không có căn cứ → không đưa ra |
| ② **Mơ hồ / thiếu thông tin** | Transcript quá ngắn hoặc nội dung mơ hồ? | Tóm tắt quá chung, không có giá trị | Báo rõ: "Nội dung buổi này chưa đủ dữ liệu để tóm tắt chi tiết — vui lòng xem lại slide gốc" |
| ③ **Ngoài phạm vi** | Học viên hỏi nội dung ngoài khóa học? | AI trả lời câu hỏi không liên quan đến tài liệu | Từ chối lịch sự: "Mình chỉ hỗ trợ nội dung khóa AI Thực Chiến. Câu hỏi này ngoài phạm vi mình nhé!" |
| ④ **Đặc thù domain** | Recap sai khái niệm kỹ thuật (VD: nhầm attention với transformer)? | Học viên ôn sai kiến thức → mất nền tảng cho buổi sau | Các khái niệm kỹ thuật phải khớp chính xác với định nghĩa trong transcript/slide gốc |

---

## §5. Go / Not Yet / No-Go

### Đánh giá theo khung ra quyết định Day 02:

| Tiêu chí | Đánh giá | Chi tiết |
|---|---|---|
| Bài toán rõ ràng? | ✅ | Pain cụ thể, actor xác định, workflow mô tả được |
| Chỉ số đo lường khả thi? | ✅ | Thời gian ôn lại, tỷ lệ câu hỏi lặp — đo được từ VLearn data |
| Điểm can thiệp AI phù hợp? | ✅ | Nằm trong nhóm "AI probably better" (tổng hợp đa nguồn, NLP, cá nhân hóa) |
| Kiểm soát được rủi ro? | ✅ | Precision-first + citation + HITL cho case mơ hồ |
| Dữ liệu sẵn có? | ✅ | 6 transcript sạch + 2 bộ slide + 1,261 turn chatlog |
| Build được trong thời gian hackathon? | ✅ | Workflow pattern đơn giản (Prompt Chaining), dữ liệu sẵn |

### ✅ **Quyết định: GO**

Bài toán rõ ràng, dữ liệu đầy đủ (6 transcript + 2 slide + chatlog), giải pháp ở cấp Workflow (không quá phức tạp), rủi ro kiểm soát được bằng citation + gate. Build prototype được trong thời gian hackathon.

---

## §6. Kế hoạch xác minh (Verification Plan)

### Mining cần làm
- [ ] Mining chatlog (`chat_history_anonymized_for_hackathon.csv`): đếm số hội thoại liên quan đến "ôn lại buổi cũ", "hôm qua học gì", "liên quan đến buổi trước"
- [ ] Phân tích field `day_code` để xem tần suất hỏi cross-day
- [ ] Khảo sát ≥20 học viên: "Lần gần nhất bạn bắt đầu buổi mới, bạn có nhớ buổi trước dạy gì? Mất bao lâu để ôn lại?"

### Golden Set (≥20 case)
- 8–10 case thường: recap/bridge cho các cặp buổi liên tiếp
- ≥2 case/lớp chỗ khó (①②③④): transcript thiếu, hỏi ngoài phạm vi, khái niệm dễ nhầm
- 2–4 case hiếm: buổi không liên quan, học viên bỏ 2 buổi liên tiếp

### Quality Bar (chốt trước 23:59 N1)
> "Đạt khi ≥ 80% recap có ít nhất 1 citation chính xác, VÀ 0% bridge chứa thông tin không trace được về tài liệu gốc, VÀ ≥ 70% học viên thử nghiệm xác nhận recap hữu ích."

---

## §7. Dữ liệu & Tài nguyên sẵn có

| Tài nguyên | Mô tả | Đường dẫn |
|---|---|---|
| Transcript bài giảng | 6 file transcript sạch, có mã đoạn để trích dẫn | `data/vlearn-pack/transcript/` |
| Slide bài giảng | 2 bộ slide (Day 1 & Day 2) | `data/vlearn-pack/slides/` |
| Chatlog VLearn | 1,261 turn, 369 user, 585 hội thoại | `data/vlearn-pack/chatlog/` |
| Data Dictionary | Mô tả chi tiết 22 field của chatlog | `data/vlearn-pack/chatlog/DATA_DICTIONARY.md` |

---

## §8. Tham chiếu lý thuyết

| Nguồn | Nội dung áp dụng |
|---|---|
| **Day 01 Slide** (slide 20) | Giới hạn bẩm sinh → cơ sở cho HITL và boundary |
| **Day 01 Slide** (slide 23–24) | 4 level agent → lý do chọn Workflow (Cấp 2) |
| **Day 02 Slide** (slide 13) | PAIR 3 bước → framework cho quyết định AI |
| **Day 02 Slide** (slide 18–19) | Rule / Workflow / Agent → chọn đúng cấp giải pháp |
| **Day 02 Slide** (slide 22–23) | Reward function, Precision ↔ Recall → thiết kế đánh đổi |
| **Day 02 Slide** (slide 27) | Problem Statement 9 trường → cấu trúc spec |
| **Google PAIR Guidebook** | Ch.1 User Needs + Defining Success |
| **Anthropic** | Building Effective Agents — Workflow Patterns |
