# AI SPEC — In-Action Learning Buddy · Nhóm [IllumiMATE] · Zone [D304]
Hướng: [x] B — Trợ lý Học viên
Loại: [x] Tính năng mới

---

## §1. User & Job

**Job executor + workflow**:

```
┌───────────────────────────────┐
│ Phase 1: Knowledge Preparation│
├───────────────────────────────┤
│ Upload Slides + Transcript    │
│           ↓                   │
│ Classify Transcript           │
│           ↓                   │
│ Extract Outline               │
│           ↓                   │
│ Generate Initial Quiz         │
│           ↓                   │
│ Knowledge Package             │
└───────────────┬───────────────┘
                ↓
┌───────────────────────────────┐
│ Phase 2: Learning Diagnosis   │
├───────────────────────────────┤
│ User Takes Quiz               │
│           ↓                   │
│ Rule-based Quiz Grading       │
│           ↓                   │
│ AI Learning Diagnosis         │
│           ↓                   │
│ Need Personalized             │
│ Re-teaching?                  │
└───────────┬─────────┬─────────┘
            │ No      │ Yes
            │         ↓
            │    Select Learning
            │    Style + Study Time
            │         ↓
            │ ┌───────────────────────┐
            │ │ Phase 3: Adaptive     │
            │ │ Re-teaching           │
            │ ├───────────────────────┤
            │ │ Align Weak Sections   │
            │ │ with Transcript       │
            │ │         ↓             │
            │ │ Learning Roadmap      │
            │ │         ↓             │
            │ │ Summary / Examples /  │
            │ │ Practice Questions    │
            │ │         ↓             │
            │ │ User Finishes Learning│
            │ └───────────┬───────────┘
            │             │
            └─────────────┘
                          ↓
┌──────────────────────────────────┐
│ Phase 4: Learning Validation      │
├──────────────────────────────────┤
│ AI Generate Retest                │
│           ↓                       │
│ Rule-based Retest Grading         │
│           ↓                       │
│ Mastery Achieved?                 │
└──────────────┬───────────┬───────┘
               │ Yes       │ No
               ↓           ↓
      Before / After    Wrong Answers
          Report        + Source References
```

Người đang theo một khóa học có cấu trúc (bootcamp, khóa online, lớp offline có slide + ghi âm). Đã tham dự buổi học chính thức (có slide + transcript), không phải người học từ zero. Sau buổi học, họ tự học lại một mình, với quỹ thời gian giới hạn, để đảm bảo thực sự hiểu bài trước khi qua bài tiếp theo hoặc trước kỳ thi.


**Core JTBD** :
> "Khi vừa học xong một buổi có nội dung mới, tôi muốn biết chính xác mình còn hổng ở đâu và được ôn lại đúng đúng phần đó theo cách giảng viên đã dạy, để tôi không mang lỗ hổng sang bài tiếp theo hoặc buổi kiểm tra."

**Problem statement** :
> Sau khi nghe giảng, người học không biết mình thực sự hiểu bài đến đâu. Nếu cần học lại, họ không biết nên tập trung vào phần nào — trong khi bài giảng gốc quá dài để đọc lại toàn bộ, còn tra cứu chung chung thì mất công diễn giải lại ngữ cảnh và không chắc câu trả lời có khớp với đúng nội dung giảng viên đã dạy.

**Evidence** —  *"≥20 người ngoài nhóm · ≥50% xác nhận · log đầy đủ"*
Log: [`evidence/Hackathon Idea Survey_Submissions_2026-07-31(1).csv`](<evidence/Hackathon%20Idea%20Survey_Submissions_2026-07-31%281%29.csv>) (n=35 ≥ 20 ✓, log đầy đủ từng câu hỏi + từng câu trả lời có trong file ✓ — đã đối chiếu lại toàn bộ 35 dòng, mọi % trong bảng dưới khớp chính xác với dữ liệu thô)

- **Số liệu khảo sát (n=35, % xác nhận)**:
  | Câu hỏi | Kết quả |
  |---|---|
  | Trải nghiệm tồi tệ nhất khi tự học bằng slide (chọn nhiều) | **51%** "Slide nhiều chữ, không biết ý nào cốt lõi"; **49%** "gạch đầu dòng, không hiểu mindset giảng viên truyền đạt" — cả hai ≥50%, đạt chuẩn xác nhận; 43% "hiểu từ ngữ nhưng không biết áp dụng thực tế"; 14% "không chắc tìm đúng vị trí slide khi ôn lại" |
  | Khi mắc ở khái niệm khó, mong muốn điều gì nhất | **37%** "có ai đó chỉ ngay đúng đoạn giảng viên đã giải thích trên lớp" (cao nhất) — validate trực tiếp bước alignment; 23% muốn bóc tách thành công thức/sơ đồ; 20% muốn ví dụ ẩn dụ; 20% muốn bài tập tình huống test nhanh |
  | Cách tương tác hào hứng nhất nếu có phần mềm hỗ trợ | **49%** "chủ động gợi mở, đặt câu hỏi ngược lại" (gần khớp thiết kế weakness-detection qua quiz + câu hỏi mở); 40% "đọc tới đâu hỏi tới đó" (validate highlight-to-ask); 11% hỏi đáp giọng nói |
  | Điều nản nhất khi dùng ChatGPT/Claude để học | 40% "mất công nghĩ prompt sao cho đúng"; **29%** "AI giải thích chung chung, không bám sát tinh thần/ngữ cảnh bài giảng của lớp" (validate đúng problem statement); 14% "AI tự tin nhưng bịa sai kiến thức" (validate rủi ro hallucination nêu ở §5/§4b) |
  | Ưu tiên kiểu ôn bài khi có thời gian trống | **51%** "10-30 phút đảo ý chính + quiz ngắn chốt kiến thức" (validate quỹ thời gian giới hạn + thiết kế quiz 8 câu ngắn) — đạt chuẩn ≥50%; 31% muốn đọc sâu >1 giờ; 17% chỉ tra cứu khi làm bài |

---

## §2. Impact & quyết định chọn

**Bảng impact ≥3 ứng viên** *(bao nhiêu người · tần suất · tốn gì mỗi lần · khả thi)* — n=35 khảo sát:

| Ứng viên | Bao nhiêu người gặp (n=35) | Tần suất | Tốn gì mỗi lần | Khả thi (1 ngày) |
|---|---|---|---|---|
| Đọc lại toàn bộ slide sau mỗi buổi | 51% gặp khó vì "nhiều chữ, không biết ý cốt lõi"; 49% "không hiểu mindset giảng viên" | Mỗi buổi học | ~30-60 phút, không chắc đọc đúng chỗ yếu | Không cần build — là baseline |
| Tự làm flashcard (Anki/Quizlet) | Suy luận từ problem-definition.md | Không đều, tốn công setup | ~20-30 phút làm thủ công/buổi | Thấp — không adaptive |
| Hỏi chatbot chung chung, tự diễn giải lại ngữ cảnh | 40% nản vì "mất công nghĩ prompt"; 29% nản vì "AI giải thích chung chung không bám ngữ cảnh bài giảng"; 14% gặp "AI bịa sai kiến thức tự tin" | Khi bí | Mất công gõ lại ngữ cảnh, rủi ro lệch nội dung giảng viên | Trung bình — nhưng thiếu "biết mình yếu đâu" |
| **[CHỌN] Chẩn đoán lỗ hổng → dạy lại đúng chỗ, bám sát bài giảng gốc → kiểm tra lại** | 37% muốn được "chỉ ngay đúng đoạn giảng viên đã giải thích" (lựa chọn cao nhất trong câu hỏi mong muốn); 51% ưu tiên ôn 10-30 phút kiểu quiz ngắn — khớp thiết kế MVP | Sau mỗi buổi học có cấu trúc | Thay thế toàn bộ 3 cách trên trong 1 vòng | Cao — pipeline rõ, transcript 1 buổi fit context window |

**Ứng viên ĐÃ LOẠI + vì sao**:
- *Đọc lại toàn bộ slide*: không cá nhân hóa, không kiểm chứng được mức hiểu, tốn thời gian nhất trong khi đây là persona "quỹ thời gian giới hạn" (51% chỉ muốn ôn 10-30 phút).
- *Flashcard thủ công*: không adaptive theo lỗ hổng thực tế, effort bỏ ra không tương xứng giá trị nhận lại. 
- *Quiz cuối chương có sẵn (nếu khóa học có)*: dừng ở bước kiểm tra, không đóng vòng lặp dạy lại — đây chính là khoảng trống hướng B nhắm tới.
- *Hỏi chatbot chung chung*: 29% xác nhận "không bám sát ngữ cảnh bài giảng", 14% xác nhận rủi ro bịa sai — persona nói rõ "họ đã có ChatGPT cho việc đó", không cần build lại việc này.

**Ứng viên CHỌN + vì sao (bằng số)**: Chọn "chẩn đoán → dạy lại → kiểm tra" vì đây là candidate duy nhất giải quyết đồng thời 3 con số lớn nhất trong khảo sát: (1) **37%** — nhu cầu cao nhất là được chỉ đúng đoạn giảng viên đã giảng (→ alignment + grounded rewrite); (2) **29%+14%=43%** tổng số người nản với chatbot vì lệch ngữ cảnh hoặc bịa sai (→ grounding bắt buộc trích nguồn); (3) **51%** ưu tiên ôn nhanh 10-30 phút bằng quiz (→ thiết kế quiz ngắn làm cổng vào chẩn đoán, không phải đọc lại toàn bộ).

---

## §3. Giải pháp tương tự đã nghiên cứu

4 thành viên mỗi người tự dùng thử 15 phút để có nhiều góc nhìn:

| Người | Sản phẩm thử | ① Flow giải job | ② Đáng học (quan sát cụ thể) | ③ Đáng né | ④ Mình khác gì |
|---|---|---|---|---|---|
| Đạt | Quizlet AI / Duolingo (cơ chế đo mức hiểu qua câu hỏi) | Upload tài liệu ➔ Auto gen flashcard ➔ Làm test trắc nghiệm ➔ Xem điểm. | Thanh tiến trình (progress bar) trực quan, có hiệu ứng ăn mừng nhỏ giúp giữ động lực học. | Chỉ test được trí nhớ (thuộc lòng), câu hỏi AI gen ra đôi khi bị ngô nghê. | Điểm số dừng lại ở "bao nhiêu câu đúng" — không nói được vì sao sai/sai ở đâu trong bài giảng. Sản phẩm mình không chốt ở điểm số: câu sai trỏ thẳng về section trong outline và đoạn transcript gốc, biến kết quả quiz thành đầu vào cho bước dạy lại, không phải điểm cuối cùng để "ăn mừng" rồi thôi. |
| Linh | NotebookLM (Q&A có trích dẫn nguồn tài liệu) | Upload PDF ➔ Đọc tóm tắt ➔ Gõ prompt hỏi ➔ Đọc câu trả lời kèm trích dẫn. | Click vào trích dẫn (citation) số nhỏ ➔ Highlight thẳng đoạn văn bản tương ứng ở file gốc bên trái. Rất uy tín. | UI quá nhiều chữ (wall of text). User không biết hỏi gì thì ứng dụng "nằm im" thụ động. | Giữ đúng cơ chế trích dẫn nhảy-về-nguồn này cho Study Note (đã cam kết ở §4b G11/PAIR Explainability) — nhưng không chờ user tự gõ câu hỏi vào ô chat trống: hệ thống chủ động chạy quiz chẩn đoán trước, biết sẵn user yếu section nào rồi mới chủ động sinh nội dung, thay vì để user tự đoán "mình nên hỏi gì". |
| Anh Tuấn | Khanmigo (giao diện trợ lý học tập chủ động hỏi ngược) | Bật chat ➔ Chọn môn ➔ Trợ lý đặt câu hỏi mớm lời ➔ User trả lời từng bước. | Không đưa đáp án ngay mà mớm (hint) từng chút một. Icon avatar nhấp nháy khi đang gen text tạo cảm giác thân thiện. | Flow setup ban đầu rườm rà, phải chọn nhiều thông tin cá nhân/cấp học. | Không đi theo lối Socratic hỏi-đáp kéo dài từng bước — quỹ thời gian của user là 10-30 phút sau giờ học (51% khảo sát), không phải một buổi kèm riêng. Mình bỏ hẳn bước setup cấp học/môn học vì context đã có sẵn 100% từ slide+transcript đúng buổi học vừa upload, không cần hỏi lại user là ai. |
| Mai Anh | ChatGPT Study Mode / Claude (baseline "hỏi AI chung chung") | Mở app ➔ Chọn voice mode / gõ prompt ➔ Nhận giải thích ➔ Trò chuyện tiếp. | Tốc độ phản hồi giọng nói (Voice Mode) cực mượt, ngắt lời được AI mọi lúc. | Phải tự viết prompt mồi rất dài để AI đóng vai "người khảo bài" chuẩn ý. | Vai "người khảo bài" ở đây không cần user tự mồi prompt — quiz chẩn đoán + weakness detection làm sẵn việc đó tự động. Và câu trả lời luôn bám 100% transcript của đúng buổi học thật, không phải kiến thức chung của AI (voice mode mượt là điểm hay nhưng nằm ngoài phạm vi MVP — xem §4 non-goal #2, dùng dropdown thay hội thoại tự do). |

**Điểm khác biệt đã xác nhận sau khi dùng thử thật**: cả 4 sản phẩm đều rơi vào một trong hai cực — hoặc đo/hỏi xong rồi dừng lại ở kết quả (Quizlet/Duolingo: điểm số; ChatGPT: user phải tự mồi prompt), hoặc chủ động dẫn dắt nhưng tốn thời gian/setup (Khanmigo: hỏi-đáp Socratic từng bước, phải chọn cấp học/môn trước), hoặc có trích dẫn đáng tin nhưng bị động chờ user hỏi (NotebookLM). Khảo sát (n=35) cho thấy 49% hào hứng nhất với "chủ động gợi mở, đặt câu hỏi ngược lại" và 51% ưu tiên ôn 10-30 phút — sản phẩm này đứng ở giữa: chủ động như Khanmigo (tự chẩn đoán, không chờ user hỏi) nhưng nhanh gọn như đọc tóm tắt (không hỏi-đáp từng bước), và giữ cơ chế trích dẫn uy tín của NotebookLM để mọi khẳng định đều trace được về đúng buổi học thật.

---

## §4. Thiết kế

**Lát cắt MỘT CÂU** *(1 user · 1 việc · 1 quyết định AI · 1 kết quả)*:
> Học viên tự học sau một buổi giảng có cấu trúc làm một bài quiz chẩn đoán ngắn, hệ thống xác định 2-3 phần trong outline mà học viên còn yếu (quyết định AI: weakness detection từ pattern trả lời sai + câu trả lời mở), và trả lại một "Personalized Study Note" viết lại đúng phần đó theo level/style của học viên, bám sát 100% nội dung slide + transcript buổi học gốc kèm trích dẫn nguồn.

**Non-goals (≥3 thứ KHÔNG build)**:
1. Chứng nhận/certify hoàn thành lecture — overclaim rủi ro, không cần cho demo.
2. Mô tả trình độ bản thân hoặc chọn style/thời gian học dạng hội thoại tự do — dùng dropdown, không AI parse.
3. Vector DB / semantic search / RAG hạ tầng phức tạp cho alignment — transcript 1 buổi fit gọn trong context window, feed toàn bộ.
4. Dạy học xuyên nhiều buổi/toàn khóa, hoặc trả lời câu hỏi ngoài phạm vi nội dung buổi học đã upload (xem §6 — case ③).
5. Tự động chấm "đã hiểu bài" mà không cho user xem lại nguồn để tự đối chiếu.

**Mức prototype nhắm tới**: [ ] Sketch · [ ] Mock · [x] Working
- **Thật (Working)**: classify transcript → outline extraction → quiz gen → weakness analysis → alignment → grounded rewrite → hiển thị Study Note có citation → quiz retest. Đây là core loop, phải chạy end-to-end thật, không mock.
- **Có thể Mock nếu hết giờ**: highlight-to-ask trong chat (giữ lại text input Q&A đơn giản là đủ, bỏ phần bôi đen UI nếu cần cắt), UI polish của split-screen.

**Automation**: [x] augment · [ ] conditional · [ ] automate
- Lý do theo cost-of-error: rewrite sai lệch với bài giảng gốc (hallucination) có cost-of-error cao trong bối cảnh học tập — học sai kiến thức từ nội dung tưởng là "dạy lại đúng bài giảng" nguy hiểm hơn không có công cụ. Khảo sát (n=35) xác nhận đây không phải rủi ro lý thuyết: **14%** người dùng từng gặp "AI tự tin nhưng bịa sai kiến thức" khi tự học bằng ChatGPT/Claude — đây chính là điều sản phẩm phải tránh lặp lại. Vì vậy giữ user-in-loop toàn bộ: mọi câu trong Study Note phải trace được về nguồn, retest cho user tự đối chiếu thay vì hệ thống tự phán "bạn đã hiểu/chưa hiểu". Không tự động hoá quyết định "học viên đã sẵn sàng qua bài tiếp theo".

**§4b. Nguyên tắc đã áp dụng** :

| Mã | Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|---|
| **G1** *(khởi đầu)* | Làm rõ hệ thống làm được gì | Trước khi bắt đầu quiz, hệ thống nói rõ 1 câu phạm vi: "Mình chỉ trả lời dựa trên slide + transcript buổi học bạn vừa tải lên — không phải kiến thức chung." Không mở đầu bằng đoạn văn dài (guide chỉ trích đúng lỗi này: "tutor chào bằng cả đoạn văn — có ai đọc?") |
| **G2** *(khởi đầu)* | Làm rõ nó làm tốt đến đâu | Mỗi section trong Study Note có "mức độ tự tin" (confidence indicator) thay vì khẳng định chắc nịch — user biết khi nào nên tin, khi nào nên tự kiểm lại với giảng viên/TA |
| **G10** *(bắt buộc)* | Thu hẹp phạm vi khi nghi ngờ | Weakness analysis không chắc chắn (câu hỏi mở mơ hồ/bỏ trống) → không khẳng định "bạn yếu phần X", chỉ dựa vào pattern sai của quiz và gắn nhãn confidence thấp; alignment không tìm được đoạn nguồn khớp → báo "không tìm thấy căn cứ trong bài giảng này" thay vì bịa (xem §5, §6①) |
| **G11** | Giải thích vì sao, gắn với hành động tiếp theo | Quiz retest: câu sai kèm ngay đoạn transcript/slide chứa đáp án đúng — không chỉ báo đúng/sai, mà chỉ thẳng "vì đoạn [T-xxx] nói X" để user tự đối chiếu và đọc lại đúng chỗ |
| **G9** | Sửa dễ dàng | User đọc Study Note thấy đoạn không khớp bài giảng thật → có nút flag ngay tại đoạn đó (xem §6 — Correction), không phải báo lỗi qua kênh khác rồi chờ |
| **G8** *(cân nhắc thêm nếu kịp)* | Gạt bỏ dễ dàng | User có thể bỏ qua gợi ý "nên đọc lại section này", tự chuyển sang section khác hoặc thoát quiz retest bất kỳ lúc nào — không bị ép theo đúng thứ tự hệ thống đưa ra |

**PAIR áp dụng thêm**:
- **Explainability + Trust**: mục tiêu là *tin đúng mức*, không phải *tin tối đa* — mọi câu trong Study Note hiển thị căn cứ cạnh câu, không giấu ở link riêng, để user tự kiểm được ngay tại chỗ.
- **Errors + Graceful Failure**: phân biệt lỗi-do-giới-hạn (không đủ dữ liệu để chấm section này) với lỗi-do-hiểu-nhầm-ngữ-cảnh (classify nhầm CLASSROOM_ACTIVITY thành TEACHING_CONTENT) — mỗi loại có một đường lui khác nhau (xem §5, cột "hành vi mong muốn").

---

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)

*(4 lớp theo guide §2.5: ① nguồn sự thật — chỗ AI bịa được · ② mơ hồ/thiếu thông tin · ③ ngoài phạm vi/thẩm quyền · ④ đặc thù domain — sai gì thì học sai kiến thức/mất điểm/mất niềm tin ngay. Mỗi lớp ≥2 case, tổng ≥8.)*

| # | Lớp | Tình huống cụ thể | Hành vi mong muốn (nói gì / hiện gì / cho làm gì tiếp) | Nguyên tắc áp |
|---|---|---|---|---|
| 1 | ① Nguồn sự thật | Grounded rewrite chèn thông tin không có trong slide/transcript (hallucination), dù vẫn kèm citation — nhưng citation không thực sự khớp nội dung | Nếu không tìm được đoạn nguồn khớp: hiển thị "không tìm thấy căn cứ trong bài giảng này", không tự bịa; gợi ý user hỏi lại giảng viên/TA thay vì suy diễn | G10, G11 |
| 2 | ① Nguồn sự thật | Alignment map nhầm đoạn transcript của section A sang rewrite của section B (do ngữ nghĩa gần nhau) — trích dẫn "có nguồn" nhưng sai chỗ | Hiển thị đoạn trích [T-xxx] cụ thể ngay cạnh câu, để user tự đối chiếu thấy ngay nếu lệch, không chỉ ghi chung chung "nguồn: buổi học" | G11, PAIR Explainability |
| 3 | ② Mơ hồ/thiếu thông tin | Câu hỏi mở "phần nào khó nhất" bị bỏ trống hoặc trả lời không liên quan | Weakness analysis chỉ dựa vào pattern sai của quiz trắc nghiệm cho case này, gắn nhãn confidence thấp, không khẳng định chắc nịch dựa trên dữ liệu thiếu | G10, G2 |
| 4 | ② Mơ hồ/thiếu thông tin | Transcript thiếu ID đoạn [T-xxx] hoặc format lộn xộn → alignment không đủ dữ liệu để map chắc chắn | Validate ngay lúc upload, báo lỗi rõ và chặn trước khi vào pipeline — không chạy tiếp với dữ liệu thiếu rồi để rewrite tự "đoán" | G10 |
| 5 | ③ Ngoài phạm vi | User hỏi (qua chat/highlight) về nội dung KHÔNG có trong slide/transcript đã upload (hỏi bài khác, hỏi kiến thức chung không liên quan buổi học) | Từ chối rõ ràng: "câu hỏi này ngoài phạm vi buổi học đã tải lên", không trả lời chung chung kiểu ChatGPT — đây chính là ranh giới khác biệt sản phẩm (§3) | G1, G10 |
| 6 | ③ Ngoài phạm vi | User yêu cầu hệ thống "chấm em đã sẵn sàng thi chưa" / "chứng nhận em đã hiểu bài" — vượt phạm vi đã cam kết ở Non-goals (§4) | Từ chối, nhắc lại phạm vi: đây là công cụ ôn tập cá nhân, không phải đánh giá/chứng nhận chính thức | G1 |
| 7 | ④ Đặc thù domain | Weakness detection **false positive**: user trả lời đúng do đoán may nhưng hệ thống coi là "đã vững" → không dạy lại phần đó → user mang lỗ hổng thật sang bài thi | Dùng ngưỡng bảo thủ (không chỉ 1 câu đúng là đủ để coi "vững" — cần nhất quán giữa quiz + câu hỏi mở), thà đề xuất ôn thêm nhầm còn hơn bỏ sót lỗ hổng thật | G2 |
| 8 | ④ Đặc thù domain | Classify transcript nhầm CLASSROOM_ACTIVITY (đùa giỡn, chấm bài) thành TEACHING_CONTENT → rewrite dựa nhầm vào đoạn không phải nội dung giảng dạy thật → học viên học sai "tinh thần" bài giảng | Ngưỡng confidence khi classify: đoạn mơ hồ ưu tiên loại bỏ thay vì giữ nhầm (fail-safe theo hướng loại, không theo hướng giữ) | PAIR Errors + Graceful Failure |
| 9 | ④ Đặc thù domain | Latency toàn luồng >30s không có loading state rõ ràng → user tưởng lỗi, bấm lại nhiều lần → chạy trùng pipeline, tốn quota AI, có thể trả về 2 bản Study Note khác nhau cho cùng 1 lần bấm | Progress indicator theo từng bước pipeline (đang classify → đang align → đang viết...), disable nút trong lúc chờ | G2 |

---

## §6. Bốn đường đi của trải nghiệm

- **Happy path**: Upload slide + transcript hợp lệ → làm quiz 8 câu + 1 câu mở → hệ thống xác định đúng 2-3 section yếu → chọn style/thời gian → nhận Study Note có trích dẫn đầy đủ → đọc, hỏi thêm qua chat → quiz retest điểm cải thiện rõ rệt.
- **Low-confidence (②)**: Weakness analysis không chắc chắn (câu hỏi mở mơ hồ, pattern trả lời không rõ ràng) → hiển thị "mức độ tự tin thấp" cho section đó, gợi ý user tự xác nhận thêm thay vì khẳng định chắc nịch.
- **Failure/không căn cứ (①)**: Grounded rewrite hoặc chat trả lời không tìm được đoạn nguồn tương ứng → hệ thống PHẢI báo "không tìm thấy căn cứ trong bài giảng này" thay vì tự bịa, kể cả khi điều đó làm câu trả lời trông kém "mượt" hơn.
- **Correction (user sửa)**: User đọc Study Note, thấy đoạn không khớp với những gì giảng viên thực sự nói (do alignment sai) → cần cơ chế feedback nhanh (flag) ngay tại đoạn đó 
- **Khi bị đòi ngoài phạm vi (③)**: User hỏi về nội dung không có trong slide/transcript của buổi học này (vd hỏi bài khác, hỏi kiến thức chung không liên quan) → từ chối rõ ràng, không trả lời chung chung kiểu ChatGPT (đây chính là ranh giới khác biệt của sản phẩm, nêu ở §3).
- **Case đặc thù domain (④)**: User bỏ trống câu hỏi mở "phần nào khó nhất" hoặc trả lời không liên quan → weakness analysis chỉ dựa vào pattern sai của quiz, không dựa vào câu trả lời mở; cần test riêng case này.

---

## §7. Kiểm thử

**Chiều chất lượng + định nghĩa kiểm chứng được**:
| Chiều | Định nghĩa kiểm chứng |
|---|---|
| Grounding rate | % câu trong Study Note truy ngược được về đoạn slide/transcript cụ thể — đo thủ công qua review ≥20 Study Note mẫu |
| Weakness detection precision | Đối chiếu thủ công: AI có xác định đúng section mà người test CỐ TÌNH trả lời sai không |
| Latency | Thời gian từ bấm "sinh Study Note" đến hiển thị — đo qua log |
| Retest improvement | So sánh điểm quiz đầu vs. retest trên cùng kịch bản demo |

**Quy trình xây (theo guide §2.6 — làm đúng thứ tự, đừng nhảy thẳng vào viết tiêu chí)**:
1. Chạy tay 10-20 input qua bản build sớm (hoặc qua Claude/ChatGPT với prompt nháp nếu chưa có code), đọc từng output, ghi thô: dùng được / sửa được / không chấp nhận được.
2. Gom output tệ thành nhóm lỗi có tên, đối chiếu 4 lớp ở §5 để không sót lớp nào.
3. Hai thành viên chấm độc lập cùng 5 output → so kết quả. Lệch nhau = định nghĩa "đạt" còn mơ hồ → viết lại định nghĩa trước khi chấm tiếp cả bộ.

**Golden set (≥20 case, file trong `eval/`)** — cơ cấu theo guide §2.6:
- ≥2 case cho **mỗi lớp** trong §5 (4 lớp × ≥2 = ≥8 case) — map trực tiếp từ 9 kịch bản đã liệt kê ở §5.
- 8-10 case thường (happy path, weakness rõ ràng, dữ liệu sạch).
- 2-4 case hiếm (combo nhiều lỗi cùng lúc, ví dụ transcript thiếu ID VÀ user hỏi ngoài phạm vi trong cùng phiên).

**Quality bar** (chốt từ 23:59 N1, giữ nguyên sau đó — không được sửa khi thấy kết quả thấp, chỉ được phân tích nguyên nhân):
> "Đạt khi ≥ 90% Study Note có grounding truy ngược được về nguồn thật (đo trên toàn bộ golden set, không chỉ case dễ), VÀ weakness detection đúng ≥ 2/3 case cố tình sai trong golden set (lớp ④), VÀ với case ngoài phạm vi (lớp ③) hệ thống từ chối đúng 100% — không được trả lời bừa dù chỉ 1 case, VÀ latency < 30s cho pipeline chính."
---

## §8. Phân công & kế hoạch

**Phân công có tên**:

| Người | Task sở hữu |
|---|---|
| Hà Anh Tuấn - 2A202601582 | (1) Extract Outline · (3) Knowledge Package |
| Nguyễn Minh Đạt -  2A202601142 | (2) Initial Quiz · (9) Retest Quiz |
| Nguyễn Thị Hương Trà - 2A202601416 | (4) Quiz UI + Rule-based Grading · (6) UI style/time (độc lập, chèn bất cứ lúc nào) · (10) Retest Grading + Result screen |
| Đoàn Ngọc Linh - 2A202601762 | (5) Learning Diagnosis (weak_sections + quyết định reteach/retest) · (7) Align weak sections ↔ transcript |
| Trần Hoàng Mai Anh - 2A202601324 | (8) Roadmap + grounded content (Summary Card / ví dụ / Mini Practice Question, có source reference) |


**Willing users (≥3 tên) + kế hoạch vòng validation CP5**:
# Phỏng vấn người dùng – Study Note

| Người thử                                                           | Câu 1 – Study Note có đúng chỗ khó/hổng nhất?                                                                                                                             | Câu 2 – Có nội dung không khớp giảng viên?                                                                                                             | Câu 3 – Tiết kiệm thời gian & có dùng lại?                                                                                                                |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phạm Thành Đạt**                | Đúng phần **LEFT JOIN với INNER JOIN**, hai câu đó em làm sai trong quiz thật. Tuy nhiên, phần **WHERE với ON đặt sau JOIN** cũng hay bị lẫn mà Study Note chưa nhắc tới. | Có. Câu **"LEFT JOIN luôn trả về toàn bộ dòng bảng trái kể cả không khớp"** thiếu ý thầy nói thêm là **"trừ khi WHERE lọc mất"**, nên hơi dễ hiểu lầm. | **Nhanh hơn hẳn**: đọc lại cả buổi mất khoảng 40 phút, Study Note khoảng 10 phút. Tin dùng lại, nhưng muốn **bấm xem đoạn transcript gốc** để kiểm chứng. |
| **Nguyễn Hải Yến** | Không hẳn. Study Note cho rằng em yếu **GROUP BY + HAVING**, nhưng thực ra em sai vì đọc đề ẩu. Phần thực sự chưa hiểu là **subquery**, nhưng lại không được nhắc tới.    | Có. Ví dụ SQL dùng `A.a_id` trong khi slide của thầy dùng tên cột **`aId`** — có vẻ lấy nhầm quy ước đặt tên.                                          | Có tiết kiệm thời gian, nhưng lỗi tên cột khiến em **nghi ngờ và phải mở slide gốc kiểm tra lại**.                                                        |
| **Cao Hương Giang**              | Đúng phần em yếu, nhưng đọc xong vẫn thấy **hơi ngắn**, chưa chắc đã "ngấm".                                                                                              | Không thấy sai gì rõ, nhưng cũng **không để ý kỹ từng câu**.                                                                                           | **Nhanh hơn thật**, nhưng em quen mở lại slide hơn nên **chưa chắc lần sau dùng**, có lẽ vì chưa quen giao diện mới.                                      |

---

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| 22:12 [30/7]| Bản đầu tiên, chưa có evidence thật |
| 7:00 [31/7] | Bổ sung evidence từ khảo sát n=35 vào §1, §2 | Có file CSV khảo sát thật |
| 12:00 [31/7] | Chỉnh §3, §4b, §5, §7 khớp đúng thuật ngữ/cấu trúc guide (G-code HAX, 4 lớp chuẩn, cơ cấu golden set) | Nhận được file guide chính thức |

---
