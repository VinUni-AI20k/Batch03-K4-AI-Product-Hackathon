# AI SPEC — Kiểm tra hiểu thật cuối buổi · Nhóm [TACGIAM] · Zone [A2]
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

> Bản nháp — soạn từ mining chatlog thật (`data/vlearn-pack/chatlog/`). Các mục đánh `[TODO — nhóm điền]` cần làm tay (khảo sát 20 người, tên thành viên, phân công) — không thể tự suy ra.

## §1. User & Job
- **Job executor**: Học viên đang trong một buổi học VLearn (`conversation_mode = in_class`), vừa hỏi tutor ít nhất 1 câu về nội dung tài liệu buổi học.
- **Core JTBD** *(không tên sản phẩm/AI)*: Xác nhận mình đã thực sự hiểu đúng phần vừa học, trước khi rời buổi hoặc chuyển sang phần khác.
- **Job story**:
  - When em vừa được tutor giải thích một khái niệm mới xong, em muốn biết mình đã hiểu đúng hay chưa, để em có thể yên tâm chuyển sang phần tiếp theo mà không mang theo hiểu sai.
  - When em đọc xong một đoạn trả lời dài của tutor, em muốn được hỏi lại bằng một câu ngắn dễ trả lời, để em tự kiểm tra thay vì tự nhận là "đã hiểu" một cách chủ quan.
  - When buổi học sắp kết thúc, em muốn có một bước chốt lại xem mình còn hổng chỗ nào, để em biết cần ôn lại phần nào trước khi qua bài mới.
- **Problem statement** *(KHÔNG chữ AI)*: Học viên hỏi xong một câu trong buổi học là rời đi luôn, không có bước nào xác nhận lại họ hiểu đúng — trả lời đúng của tutor không đồng nghĩa với việc học viên tiếp thu đúng, và không ai phát hiện ra chỗ hiểu sai cho tới khi làm quiz/bài thi.
- **Evidence** (đường B — mining, log tại `data/vlearn-pack/chatlog/`):
  - Số liệu mining (n = 1.261 turn tutor, 585 hội thoại, 22/07–29/07/2026):
    - `asked_check_question = True`: **3/1.261 turn (0,24%)** — tutor gần như không bao giờ chủ động hỏi lại để kiểm tra hiểu.
    - `move_used = validate_understanding`: **1/1.261 turn tutor (0,08%)**.
    - **309/585 hội thoại (52,8%)** chỉ có đúng 1 turn (student hỏi → tutor trả lời) rồi kết thúc, không quay lại kiểm tra.
    - `misconceptions` (field để ghi hiểu lầm phát hiện được): **0/1.261 turn có giá trị** — chưa từng được dùng dù có sẵn chỗ ghi.
    - Phương pháp đếm: lọc toàn bộ 1.261 dòng `role=tutor` theo cột `asked_check_question` và `move_used`; nhóm 2.522 dòng theo `conversation_id` (585 hội thoại) để đếm số message/hội thoại.
  - Quote/ví dụ nguyên văn *(cần bổ sung thêm cho đủ ≥5, đây là điểm khởi đầu)*:
    1. Một trong 3 lần hiếm hoi tutor chủ động hỏi lại (C0063, T0849): *"...tôi đã soạn một câu hỏi ngắn dưới đây: Câu hỏi: Trong ngữ cảnh của bài học, sự khác biệt căn bản nhất về cách thức hoạt động giữa một Chatbot thông thường và một..."*
    2. [TODO — nhóm bổ sung ví dụ hội thoại 1-turn điển hình, đủ ≥5 quote]
  - **[TODO — nhóm bổ sung Đường A]**: khảo sát ≥20 người ngoài nhóm, ≥50% xác nhận, log câu hỏi + từng câu trả lời nguyên văn (gợi ý câu hỏi: *"Lần gần nhất bạn hỏi tutor VLearn xong, bạn có biết chắc mình hiểu đúng không, hay chỉ đọc xong là qua bài khác?"*).

## §2. Impact & quyết định chọn
- **Bảng impact (3 ứng viên)**:

| Ứng viên | Bao nhiêu người gặp | Tần suất | Mỗi lần tốn gì | Build nổi không |
|---|---|---|---|---|
| Kiểm tra hiểu thật cuối buổi | ≥52,8% hội thoại (309/585) kết thúc không kiểm tra | Mỗi buổi học có hỏi tutor | Hiểu sai mang qua bài sau, mất điểm quiz | Có — 1 AI call sinh câu hỏi + chấm câu trả lời |
| Trải nghiệm học online (điều hướng tài liệu) | Chưa đo được từ data pack hiện có | Không rõ | Không rõ | Khó định lượng trong thời gian sự kiện |
| Bản đồ lỗ hổng lớp cho giảng viên | Gián tiếp — cần tổng hợp nhiều học viên/buổi | Theo buổi | Giảng viên dạy sai trọng tâm | Cần nhiều dữ liệu hơn 1 lớp mới có ý nghĩa thống kê |

- **Ứng viên ĐÃ LOẠI + vì sao**:
  - Trải nghiệm học online: thiếu bằng chứng đếm được từ data pack hiện có — không tự tin sẽ tìm đủ evidence trong thời gian sự kiện.
  - Bản đồ lỗ hổng lớp: object là giảng viên chứ không phải học viên trực tiếp trong lát cắt "một người dùng"; cần aggregate nhiều buổi/nhiều học viên mới ra tín hiệu đáng tin, khó build và đo trong 1 sự kiện.
- **Ứng viên CHỌN + vì sao (bằng số)**: Kiểm tra hiểu thật cuối buổi — bằng chứng B mạnh nhất hiện có (0,24% / 0,08% / 52,8% từ 585 hội thoại thật) và ảnh hưởng >50% số hội thoại trong data pack, có thể build 1 AI call (sinh câu hỏi + chấm) trong thời gian sự kiện.

## §3. Giải pháp tương tự đã nghiên cứu
*(Nghiên cứu express — mỗi thành viên 15'/sản phẩm, trả lời 4 câu: flow / đáng học / đáng né / mình khác gì. [TODO — nhóm điền sau khi dùng thử])*
- [Sản phẩm 1 — ví dụ Khanmigo]: ...
- [Sản phẩm 2 — ví dụ NotebookLM]: ...

## §4. Thiết kế
- **Lát cắt MỘT CÂU**: Khi học viên vừa nhận câu trả lời từ tutor trong buổi học, AI sinh một câu hỏi kiểm tra ngắn bám sát đúng đoạn vừa trao đổi và chấm câu trả lời của học viên là hiểu-đúng / hiểu-lệch-chỗ-nào, để học viên biết ngay có cần đọc lại hay không.
- **Non-goals** *(≥3 thứ KHÔNG build)*:
  1. Không chấm điểm chính thức / không tính vào điểm số khoá học.
  2. Không tự tổng hợp báo cáo hiểu-lệch gửi giảng viên (đó là hướng "bản đồ lỗ hổng lớp" đã bị loại).
  3. Không kiểm tra toàn bộ buổi học — chỉ kiểm tra dựa trên đoạn tài liệu vừa trao đổi trong turn gần nhất.
- **Mức prototype nhắm tới**: [ ] Sketch [ ] Mock [ ] Working — [TODO — nhóm chọn theo sức]. Phần nào mock/phần nào thật: [TODO].
- **Automation**: [ ] augment [x] conditional [ ] automate.
  - Lý do (cost-of-error): AI tự sinh câu hỏi kiểm tra + tự chấm sơ bộ khi câu trả lời của học viên rõ ràng đối chiếu được với đoạn tài liệu gốc. Nhưng khi câu trả lời mơ hồ, AI **không tự kết luận "hiểu đúng"** — vì báo sai theo hướng này (nói hiểu đúng trong khi hiểu sai) khiến học viên mang kiến thức sai đi thi mà không tự phát hiện được, sửa đắt. Ngược lại báo "chưa chắc, đọc lại đoạn X" khi học viên thực ra đã hiểu đúng chỉ tốn thêm ít giây đọc lại — sai theo hướng này rẻ hơn nhiều, nên thiên về thận trọng khi không chắc.
- **§4b. Nguyên tắc đã áp dụng** *(≥4)*:

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| G2 — Làm rõ nó làm tốt đến đâu | Câu hỏi kiểm tra luôn kèm dòng "dựa trên đoạn bạn vừa đọc, trang N" — học viên biết phạm vi câu hỏi |
| G10 — Thu hẹp phạm vi khi nghi ngờ *(bắt buộc)* | Câu trả lời học viên mơ hồ → không chấm "đạt/chưa đạt", hỏi lại 1 câu hoặc trỏ về đoạn tài liệu |
| G9 — Sửa dễ dàng | Học viên trả lời sai → cho trả lời lại ngay trong cùng khung, không phải hỏi lại tutor từ đầu |
| G11 — Giải thích vì sao | Khi chấm "chưa đúng", nói rõ chỗ lệch so với đoạn tài liệu gốc, không chỉ báo "sai" |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)

| Tình huống cụ thể | Lớp | Hành vi mong muốn | Nguyên tắc áp |
|---|---|---|---|
| Turn có `citations=[]` (46,2% turn hiện tại không grounding) — không có đoạn tài liệu rõ ràng để dựa vào | ① Nguồn sự thật | Không sinh câu hỏi kiểm tra; báo "chưa đủ căn cứ để kiểm tra phần này" | G10 |
| AI bịa đáp án tham chiếu không khớp đoạn tài liệu thật | ① Nguồn sự thật | Đáp án tham chiếu phải trace được về đúng trang/đoạn của turn đó | G11 |
| Học viên trả lời nửa đúng nửa sai | ② Mơ hồ | Không chấm "đạt" — hỏi lại 1 câu cụ thể hơn hoặc yêu cầu giải thích thêm | G10 |
| Học viên trả lời cụt kiểu "ừ hiểu rồi" không giải thích gì | ② Mơ hồ | Không nhận acknowledgement suông là "đạt" — yêu cầu diễn giải lại bằng lời của học viên | G10 |
| Học viên dùng ô trả lời để hỏi tiếp câu khác (không trả lời câu kiểm tra) | ③ Ngoài phạm vi | Nhận diện đây không phải câu trả lời, dẫn học viên quay lại trả lời hoặc chuyển tutor xử lý câu hỏi mới | G1 |
| Học viên đòi AI "chấm điểm chính thức" / tính vào điểm khoá học | ③ Ngoài phạm vi | Từ chối, nhắc rõ đây là tự-kiểm-tra không tính điểm (khớp Non-goal §4) | G1 |
| Học viên trả lời đúng thuật ngữ nhưng sai bản chất (misconception thật) | ④ Đặc thù domain | Phải bắt được bằng đối chiếu ý nghĩa chứ không chỉ so khớp từ khoá — đây là failure nguy hiểm nhất nếu bỏ sót | G11 |
| Nội dung buổi học có nhiều khái niệm dễ nhầm lẫn với nhau (ví dụ 2 khái niệm gần giống) | ④ Đặc thù domain | Câu hỏi kiểm tra nên nhắm đúng điểm dễ nhầm, không hỏi chung chung | G2 |

*(≥2 case/lớp đã đủ theo yêu cầu tối thiểu — [TODO] mở rộng nếu nhóm tìm thêm case hiểm khi chạy HAX Playbook, và tự hỏi: kịch bản nào làm nhóm sợ nhất khi demo — hiện đang là lớp ④, dòng "trả lời đúng thuật ngữ nhưng sai bản chất".)*

## §6. Bốn đường đi của trải nghiệm
- **Happy path**: Học viên trả lời đúng, rõ ràng → AI xác nhận hiểu đúng, kèm 1 câu giải thích ngắn vì sao đúng (G11).
- **Low-confidence (②)**: Câu trả lời mơ hồ/nửa đúng → AI hỏi lại 1 câu làm rõ, không kết luận.
- **Failure/không căn cứ (①)**: Turn gốc không có đoạn tài liệu rõ ràng (`citations=[]`) → AI báo không đủ căn cứ để kiểm tra, không tự bịa câu hỏi/đáp án.
- **Correction (user sửa)**: Học viên trả lời sai → được trả lời lại ngay trong cùng khung (G9), không cần hỏi tutor lại từ đầu.
- **Khi bị đòi ngoài phạm vi (③)**: Học viên đòi chấm điểm chính thức hoặc hỏi lạc đề trong ô trả lời → từ chối phạm vi, dẫn về đúng luồng.
- **Case đặc thù domain (④)**: Học viên trả lời đúng từ khoá nhưng sai bản chất → AI phải phát hiện qua đối chiếu ý nghĩa, không chỉ khớp từ khoá.

## §7. Kiểm thử
- **Chiều chất lượng + định nghĩa kiểm chứng được** *(nháp — chưng cất tiếp sau khi chạy tay 10-20 input)*:
  - Đúng-có-căn-cứ: câu hỏi/đáp án tham chiếu trace được về đúng đoạn tài liệu của turn gốc (pass/fail).
  - Chấm đúng: kết quả chấm (đạt/chưa đạt/hỏi lại) khớp với đánh giá của người chấm tay đối chiếu transcript (pass/fail).
  - Không kết luận liều: khi input thuộc lớp ①/② mà AI vẫn chấm "đạt" dứt khoát → fail cứng.
- **Golden set** (≥20 case, ≥2/lớp + 8-10 case thường + 2-4 case hiếm, ≥10 case từ chatlog thật): [TODO — dựng trong `eval/`; nguồn: turn có `citations` không rỗng để sinh case thường, turn có `citations=[]` để test lớp ①].
- **Quality bar** (chốt từ 23:59, giữ nguyên sau đó): "Đạt khi ≥ ___% qua bộ, và [điều kiện cứng — ví dụ: 0 case lớp ① sinh câu hỏi khi không có căn cứ]" — [TODO — chốt sau lượt đo đầu tại CP3].
- **Kết quả các lượt chạy**: [TODO — cập nhật bảng % đến trước CP6].

## §8. Phân công & kế hoạch
- Phân công có tên: spec / evidence / prompt / code / demo — [TODO — nhóm điền tên].
- Willing users (≥3 tên) + kế hoạch vòng validation CP5: [TODO].
- Multi-prototype (nếu làm): [TODO — ví dụ trục khác biệt khả dĩ: AI hỏi lại ngay lập tức sau mỗi câu trả lời vs. gom lại hỏi 1 lần cuối buổi].

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| [ngày] | Bản nháp §1-§2 dựng từ mining chatlog thật | Khởi tạo spec theo `02-guide.md` §1-§2 |
