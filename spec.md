# AI SPEC — Ôn tập buổi giảng đa định dạng, bám sát tài liệu gốc · Nhóm 50s-E403 · Zone [X]
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [x] Tính năng mới  (khai thác cùng data pack với AI tutor hiện có, nhưng không sửa code tutor production)

## §1. User & Job
- **Job executor:** Học viên VLearn đang tự ôn lại một buổi giảng đã học (hoặc học bù buổi đã bỏ lỡ), một mình, ngoài giờ lớp — không phải "học viên nói chung".
- **Core JTBD** (bỏ chữ AI/sản phẩm, việc vẫn tồn tại): *Nắm lại đúng nội dung chính của một buổi giảng từ tài liệu, và tự kiểm tra xem mình đã hiểu đúng chưa, mà không phải đọc lại/tua lại toàn bộ tài liệu gốc.*
- **Problem statement** (không chữ AI): Học viên hôm nay ôn bài bằng cách đọc lại nguyên slide/transcript hoặc hỏi lại trợ giảng trong lớp; khi hỏi trợ giảng, gần một nửa số câu trả lời không kèm căn cứ để đối chiếu lại tài liệu, nên học viên không biết nên tin đến đâu, và với các câu hỏi ôn khái niệm (chiếm đa số lượt hỏi) học viên chỉ nhận được một đoạn văn giải thích, không có cách tự kiểm tra nhanh (quiz) hay nhìn tổng quan quan hệ giữa các ý (mind map).
- **Evidence:**
  - **Đường B — mining (đã làm, dữ liệu thật từ `data/vlearn-pack/chatlog/`):**
    - Nguồn: `chat_history_anonymized_for_hackathon.csv` — 2.522 dòng, 1.261 lượt hỏi-đáp (turn), 369 học viên, 585 hội thoại, 22–29/07/2026 (đã ẩn danh, xem `DATA_DICTIONARY.md`).
    - **Phương pháp đếm:** đếm trực tiếp trên field có sẵn của data dictionary (`citations`, `move_used`, `rating`) — không suy diễn thêm, ai cũng kiểm lại được bằng cách mở file + đếm theo đúng field này.
    - **Số liệu:**
      - 46,2% lượt trả lời của tutor (~583/1.261 turn) có `citations = []` — trả lời không kèm trích dẫn trang tài liệu để học viên đối chiếu.
      - `move_used = "review_concept"` (giải thích lại khái niệm) chiếm 1.072/1.261 turn = **85%** — gần như mọi lượt hỏi là ôn/giải thích lại kiến thức đã giảng, không phải hỏi logistics.
      - Chỉ 2,8% lượt trả lời được học viên chấm rating (up/down) — phần lớn học viên không có cách phản hồi nhanh "câu này đúng/sai với tài liệu không", nên tín hiệu chất lượng gần như không có.
      - Trong số ít có rating, 37 lượt bị đánh "down" — đọc tay các lượt này cho thấy mẫu số chung: tutor trả lời chung chung, không trỏ được vào đúng tài liệu.
    - **≥5 ví dụ nguyên văn** (turn_id trong file gốc, không map ngược ra người thật):
      1. `T0176` (down-rated, không trích dẫn): *"Hiện tại hệ thống không hiển thị danh mục tóm tắt chung cho ngày học này. Bạn có thể cung cấp thêm thông tin hoặc tiêu đề cụ thể của bài giảng/chủ đề mà bạn đang quan tâm không?"* — học viên không có cách tự lấy tổng quan buổi học.
      2. `T1006` (down-rated, không trích dẫn): tutor trả lời né tránh khi được hỏi về công nghệ nền — không liên hệ được về nội dung tài liệu.
      3. `T0418` (có citation nhưng vẫn bị đánh down): *"...nội dung slide bài giảng hôm nay không đề cập chi tiết đến danh sách các tác vụ cụ thể mà kiến trúc agent theo kiểu tool-calling truyền thống giải quyết tốt nhất..."* — từ chối đúng cách (không bịa) nhưng học viên vẫn không hài lòng vì không có gì thay thế để tự ôn tiếp (không có quiz/mindmap đi kèm).
      4. `T1208` (không trích dẫn, move=review_concept): giải thích khái niệm "dogfooding" dài, đúng nhưng không trỏ về đoạn nào trong tài liệu.
      5. `T0702` (không trích dẫn): nhắc "trang 8" trong lời văn nhưng field `citations` vẫn rỗng — thông tin trích dẫn không nhất quán, học viên không có cách bấm-để-xem-lại đúng chỗ.
      6. 5 turn học viên gõ nguyên văn `"2+2=?"` — cho thấy có nhiễu (test/troll) lẫn trong dữ liệu thật, cần loại khi mining tiếp.
  - **Đường A — khảo sát:** nhóm quyết định **không chạy** (khảo sát ≥20 người ngoài nhóm không khả thi trong thời gian sự kiện). Rubric tiêu chí 2 dùng "và/hoặc" — Đường B (mining, ở trên) đã đủ chuẩn: số đếm được trên field có sẵn + ≥5 ví dụ nguyên văn + phương pháp đếm ai cũng kiểm lại được, nên evidence không phụ thuộc Đường A.

## §2. Impact & quyết định chọn
| # | Ứng viên | Bao nhiêu người · tần suất | Tốn gì mỗi lần | Khả thi trong sự kiện | Chọn? |
|---|---|---|---|---|---|
| 1 | Sửa AI tutor hiện có để luôn kèm trích dẫn khi trả lời | 369 học viên · ~85% lượt hỏi là review_concept, xảy ra mỗi buổi học | Học viên không verify được, có thể tin nhầm kiến thức sai | **Không khả thi** — tutor là hệ thống production thật, nhóm không có quyền/hiểu hết pipeline retrieval để sửa an toàn trong 1,5 ngày | ❌ Loại |
| 2 | **Tự động sinh outline đa định dạng (slide có lời giảng đồng bộ giọng đọc + khoanh đúng vị trí gốc, quiz trắc nghiệm, mind map, animation minh hoạ) từ tài liệu buổi giảng, để học viên ôn nhanh và tự kiểm tra** | Toàn bộ học viên có nhu cầu ôn tập (proxy: 85% lượt hỏi tutor là ôn khái niệm) · mỗi buổi học / mỗi lần ôn thi | Học viên tự đọc lại toàn bộ slide/transcript (6 bài mẫu trong data pack dài hàng chục trang mỗi bài) để tự lọc ra ý chính | Khả thi — chỉ cần upload PDF + gọi LLM, không đụng hệ thống VLearn thật | ✅ **Chọn** |
| 3 | Bản đồ lỗ hổng kiến thức của lớp cho giảng viên, tổng hợp từ chatlog | 369 học viên/lớp · theo tuần | Giảng viên phải đọc thủ công hàng nghìn tin nhắn để biết lớp yếu ở đâu | Khả thi về kỹ thuật nhưng khó demo trực quan trong 5 phút, và nhóm không phải là user trực tiếp của tính năng này | ❌ Loại (giữ làm backlog §9) |

- **Ứng viên chọn + lý do bằng số:** Ứng viên #2 giải quyết đúng khoảng trống đã đo ở §1 (46,2% câu trả lời không có căn cứ để đối chiếu; 85% nhu cầu là ôn khái niệm) bằng cách tạo nội dung ôn tập LUÔN bám nguồn (slide giữ nguyên ảnh gốc + khoanh vùng đang giảng, quiz/mindmap/animation đều được ép "không bịa thêm nội dung ngoài tài liệu" trong prompt) — và build trọn vẹn được trong thời gian sự kiện vì không phụ thuộc hệ thống VLearn production.

## §3. Giải pháp tương tự đã nghiên cứu
*(Desk research nhanh — mỗi thành viên nên tự dùng thử 15' trước CP4 để bổ sung quan sát thực tế, đánh dấu quan sát nào là tự trải nghiệm.)*

- **NotebookLM (Google):** Flow — upload tài liệu, hỏi/tạo Audio Overview, mọi câu trả lời kèm trích dẫn nguồn ngay cạnh. Đáng học: trích dẫn luôn hiển thị *cùng lúc* với câu trả lời, không phải nhấn thêm mới thấy — nhóm áp dụng bằng cách hiển thị ảnh slide gốc + khoanh vùng (`focus_bbox`) ngay khi đang thuyết trình. Đáng né: Audio Overview đôi khi diễn giải hơi xa nguồn để nghe "cuốn" hơn — nhóm giới hạn chặt hơn bằng chỉ thị "không bịa số liệu/sự kiện" trong prompt slide (`slide_agent.py`). Khác biệt: nhóm sinh thêm quiz/mindmap/animation thay vì chỉ audio.
- **Khan Academy Khanmigo:** Flow — trợ lý gợi mở bằng câu hỏi thay vì đưa thẳng đáp án. Đáng học: cách "không đưa đáp án cuối" cho quiz — nhóm áp dụng một phần ở `debate_agent` (không cho AI Teacher đưa đáp án đóng, chỉ tổng kết). Đáng né: đôi khi vòng hỏi-đáp dài dòng với học viên đang vội ôn thi. Khác biệt: nhóm ưu tiên tốc độ ôn tập (outline có sẵn, không cần hỏi từng câu).
- **Quizlet AI (Q-Chat/Magic Notes):** Flow — tự sinh flashcard/quiz từ tài liệu upload. Đáng học: luôn cho xem lại đúng đoạn text gốc khi giải thích đáp án sai. Đáng né: câu hỏi đôi khi chung chung, không bám sát số liệu cụ thể trong tài liệu. Khác biệt: quiz của nhóm bắt buộc bám 1 chi tiết cụ thể (số liệu/định nghĩa/mốc thời gian) theo prompt trong `quiz_agent.py`, không hỏi kiến thức chung chung.

## §4. Thiết kế
- **Lát cắt MỘT CÂU:** Một học viên đang tự ôn lại một buổi giảng đã bỏ lỡ hoặc học trước quiz · muốn nhanh chóng nắm lại nội dung chính và tự kiểm tra mình đã hiểu đúng chưa · hệ thống quyết định: tự động chuyển tài liệu buổi giảng (PDF) thành một outline đa định dạng — slide có lời giảng đồng bộ giọng đọc và khoanh đúng vị trí trên ảnh gốc, quiz trắc nghiệm bám 1 chi tiết cụ thể trong tài liệu, mind map phân cấp, animation minh hoạ khái niệm — toàn bộ bám sát nội dung tài liệu gốc, không tự thêm kiến thức ngoài tài liệu · kết quả: học viên ôn xong nội dung một buổi học trong một phiên ngắn và tự kiểm tra được mức hiểu của mình, mà không cần đọc lại/tua lại toàn bộ tài liệu gốc.
- **Non-goals (không build trong lát cắt này):**
  1. **Chatbot hỏi-đáp tự do có trích dẫn cho từng câu hỏi rời** (dạng RAG hỏi 1 câu → 1 câu trả lời có citation) — **chưa build**. Tính năng tương tác thật trong prototype hiện tại là **debate/discussion mode** (`debate_agent.py`): người dùng gõ 1 chủ đề, nhiều "nhân vật" AI thay nhau thảo luận xoay quanh đúng chủ đề đó, người dùng có thể chen ngang bất cứ lúc nào. Đây KHÔNG phải là hỏi-đáp có trích dẫn Section như một số case cũ trong `eval/golden-set.md` mô tả — các case đó (11, 12, 13, 14, 15, 19, 21, 22, 23) cần được đánh dấu lại là **backlog/chưa đo được ở bản build hiện tại**, không tính vào % đạt của R4 cho tới khi tính năng đó thật sự tồn tại.
  2. Không thay giảng viên chấm bài / không ghi điểm chính thức vào hệ thống VLearn.
  3. Không tự động đăng nội dung sinh ra lên VLearn production — chỉ chạy trên prototype độc lập.
  4. Không hỗ trợ ngôn ngữ khác ngoài tiếng Việt, không xử lý file khác ngoài PDF.
- **Mức prototype nhắm tới:** **Mock/Working lai** — flow bấm được trọn vẹn end-to-end (upload PDF → outline → click từng block → slide/quiz/mindmap/animation), ≥1 lời gọi AI thật ở lõi (mỗi agent gọi `OpenAI`-compatible API thật khi có `API_KEY`, có fallback rule-based khi thiếu key — **phải ghi rõ trong demo là đang chạy fallback hay LLM thật**). Phần **debate/discussion mode** cũng gọi LLM thật. **Mock:** chưa có bước giảng viên duyệt nội dung trước khi hiển thị cho học viên (xem Automation bên dưới); chatbot Q&A theo Section (Non-goal #1) hoàn toàn chưa có, kể cả ở dạng mock.
- **Automation:** **Automate** cho việc sinh outline/slide/quiz/mindmap/animation (không có bước người duyệt trước khi học viên thấy). Lý do theo cost-of-error: nếu chỉ dừng ở đây, sai kiến thức domain (④) là đắt (học viên học sai ngay) — nhưng nhóm hạ chi phí sai bằng 2 cơ chế tự sửa: (1) mọi prompt đều ép "bám sát nội dung, không bịa" và với slide, ảnh gốc + khoanh vùng luôn hiển thị song song để học viên **tự đối chiếu ngay lập tức** (không phải tin mù); (2) quiz có node `validate_quiz` retry tối đa 2 lần nếu cấu trúc không hợp lệ. Vì vậy sai thì học viên **tự phát hiện được** qua so sánh với tài liệu gốc hiển thị cạnh đó — chi phí sửa rẻ hơn so với tutor trả lời trực tiếp không kèm gì để đối chiếu (đúng vấn đề đã đo ở §1). Nếu triển khai thật ngoài hackathon, nên chuyển phần quiz sang **Augment** (giảng viên duyệt trước khi phát cho cả lớp) vì hậu quả sai lan rộng hơn 1 học viên.
- **§4b. Nguyên tắc đã áp dụng:**

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| **G1 — Làm rõ hệ thống làm được gì** | Mỗi block trong outline hiển thị rõ loại nội dung (quiz/slide/mindmap/animation) trước khi học viên bấm vào, không để học viên đoán mù (FE `page.tsx`, danh sách outline) |
| **G2 — Làm rõ nó làm tốt đến đâu** | `slide_agent.py`: mọi lời giảng luôn hiển thị kèm đúng ảnh slide gốc (`bg_image`) + khoanh vùng đang nói tới (`focus_bbox`) — học viên biết ngay đoạn nào có căn cứ trực tiếp, đoạn nào là diễn giải thêm |
| **G10 — Thu hẹp phạm vi khi nghi ngờ** | Toàn bộ prompt của `quiz_agent.py`, `mindmap_agent.py`, `animation_agent.py` đều có chỉ thị bắt buộc "không bịa thêm nội dung/số liệu không có trong tài liệu gốc" |
| **G11 — Giải thích vì sao** | `quiz_agent.py`: field `explanation` giải thích đáp án đúng bám theo tài liệu; `slide_agent.py`: `focus_element_id` nối trực tiếp lời giảng với đúng phần tử gốc trên slide |
| **G9 — Sửa/hỏi lại dễ dàng** | `debate_agent.py`: người dùng chen tin nhắn mới vào transcript bất cứ lúc nào giữa các lượt AI (human-in-the-loop), không phải chờ hết vòng mới được nói |
| **PAIR — Errors + Graceful Failure** | `quiz_agent.py` node `validate_quiz`/`should_retry`: tách rõ lỗi cấu trúc (retry được, tối đa 2 lần) khỏi việc chấp nhận output tạm sau khi hết lượt retry — không để lỗi kỹ thuật chặn đứng flow |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8) [bảng theo guide §2.5]

| # | Lớp | Tình huống cụ thể | Hành vi mong muốn | Nguyên tắc áp | Case golden set |
|---|---|---|---|---|---|
| 1 | ① Nguồn sự thật | Outline sinh thêm chủ đề không có trong tài liệu | Outline chỉ chứa nội dung có trong tài liệu, không tự thêm | G10 | eval/golden-set.md#3 |
| 2 | ① Nguồn sự thật | Quiz sinh câu hỏi/đáp án không bám tài liệu | Câu hỏi bám sát nội dung tài liệu, đáp án dựa trên tài liệu | G10, G11 | eval/golden-set.md#7, #9 |
| 3 | ② Mơ hồ / thiếu thông tin | Học viên gõ 1 từ/1 câu mơ hồ vào ô chat (vd "hi", "giúp mình") — hiện tại hệ thống lấy NGUYÊN VĂN tin nhắn đầu tiên làm chủ đề debate, dù mơ hồ | Khi tin nhắn mở đầu quá ngắn/mơ hồ, hỏi lại 1 câu để xác nhận chủ đề/Section trước khi khởi động buổi thảo luận, không lấy nguyên văn làm chủ đề | G10 (cần bổ sung code — hiện CHƯA có check độ dài/độ rõ chủ đề trong `sendChat`/`debate_agent.py`) | eval/golden-set.md#20b (mới, xem TODO) |
| 4 | ② Mơ hồ / thiếu thông tin | Upload tài liệu ảnh scan mờ / PDF không trích được text (elements rỗng) | Thông báo rõ không đọc được nội dung, không âm thầm sinh outline rỗng/giả | G10 | eval/golden-set.md#20 |
| 5 | ③ Ngoài phạm vi / thẩm quyền | Upload tài liệu không phải bài học (hóa đơn/hợp đồng) | Thông báo tài liệu không phù hợp để tạo bài học | G10 | eval/golden-set.md#18 |
| 6 | ③ Ngoài phạm vi / thẩm quyền | Trong debate mode, người dùng chen ngang đòi AI "cho đáp án đúng luôn" của quiz đang ôn | Từ chối cung cấp toàn bộ đáp án, chỉ hỗ trợ giải thích từng câu | G10 | eval/golden-set.md#21 |
| 7 | ④ Đặc thù domain | Animation minh hoạ sai vòng lặp Agent (Goal/Reasoning/Tools/Memory/Action) | Animation đúng bản chất khái niệm, đúng quan hệ giữa các thành phần | G10, G2 | eval/golden-set.md#8 |
| 8 | ④ Đặc thù domain | Quiz có nhiều hơn 1 đáp án đúng hoặc đáp án sai | Mỗi câu 4 đáp án, đúng đúng 1 đáp án theo tài liệu | G10, node `validate_quiz` | eval/golden-set.md#9 |
| 9 | ④ Đặc thù domain | Mind map thể hiện sai quan hệ giữa các ý chính | Mind map đúng ý chính và đúng quan hệ giữa các nội dung | G10, G2 | eval/golden-set.md#6 |
| 10 | ④ Đặc thù domain | Debate mode để hội thoại trôi dạt sang chủ đề khác chủ đề gốc sau nhiều lượt | AI Teacher/mọi persona phải chủ động kéo lại đúng chủ đề gốc, không để trôi | System prompt `DEBATE_SYSTEM_PROMPT` (ràng buộc #2) | eval/golden-set.md#10b (mới, xem TODO) |
| 11 | ④ Đặc thù domain | Chatbot/debate giải thích sai khái niệm chuyên môn (vd: input/output tokens, chi phí API) | Giải thích đúng theo tài liệu, không nhầm lẫn khái niệm | G10 | eval/golden-set.md#22, #23 |
| 12 | ① Nguồn sự thật | Debate mode nhắc tới nội dung không có trong tài liệu gốc để "thêm phần thú vị" | Persona không được bịa số liệu/sự kiện ngoài chủ đề đã cho, chỉ được thảo luận trong phạm vi topic | `DEBATE_SYSTEM_PROMPT` ràng buộc #1 | eval/golden-set.md#19b (mới, xem TODO) |

*(Đã ≥8 kịch bản, đủ 4 lớp. So với bản trước: đã bỏ các case thuần "chatbot hỏi-đáp Section" không khớp bản build (giữ lại như backlog ở §9), thay bằng case #3, #10, #12 khớp đúng tính năng debate/discussion thật đang có. Case #3/#10/#12 cần bổ sung case tương ứng vào `eval/golden-set.md` — xem TODO cuối file đó.)*

## §6. Bốn đường đi của trải nghiệm
- **Happy path:** Học viên upload PDF buổi giảng → hệ thống sinh outline gồm ≥3 loại block (quiz/slide/mindmap/animation) → học viên bấm từng block, xem slide có lời giảng + khoanh vùng đúng ảnh gốc, làm quiz, xem mindmap/animation → hoàn thành, thấy điểm quiz.
- **Low-confidence (②):** Upload tài liệu scan mờ/không trích được text → hệ thống báo rõ không đọc được, không tự bịa outline rỗng. Gõ chủ đề debate quá ngắn/mơ hồ → (cần bổ sung) hỏi lại thay vì nhận nguyên văn.
- **Failure/không căn cứ (①):** Outline/quiz/mindmap/animation không được phép thêm nội dung ngoài tài liệu gốc — validate bằng cách đối chiếu tay với tài liệu nguồn khi chấm golden set.
- **Correction (user sửa):** Trong debate mode, học viên chen tin nhắn mới bất cứ lúc nào giữa các lượt AI, AI phải ưu tiên phản hồi đúng tin nhắn đó trước khi tiếp tục mạch cũ (`DEBATE_SYSTEM_PROMPT` ràng buộc #3).
- **Khi bị đòi ngoài phạm vi (③):** Upload tài liệu không phải bài học → từ chối tạo outline. Đòi đáp án toàn bộ quiz → chỉ giải thích từng câu, không lộ hết đáp án.
- **Case đặc thù domain (④):** Quiz/animation/mindmap liên quan khái niệm Agent (Goal/Reasoning/Tools/Memory/Action) và token/chi phí API phải đúng 100% theo tài liệu — sai ở đây tính fail, không có mức "gần đúng".

## §7. Kiểm thử

### Chiều chất lượng + định nghĩa kiểm chứng được

| Chiều | Định nghĩa "đạt" (kiểm chứng được, không cảm tính) |
|---|---|
| Đúng có căn cứ (grounded) | Mọi nội dung outline/slide/quiz/mindmap/animation trace được về một đoạn cụ thể trong tài liệu nguồn; không có chi tiết không tồn tại trong tài liệu |
| Đúng phạm vi (scope-appropriate) | Khi input mơ hồ (②) → hỏi lại thay vì đoán; khi bị hỏi ngoài tài liệu (①) hoặc ngoài thẩm quyền hệ thống (③) → từ chối/thông báo rõ, không suy diễn, không tự ý cung cấp (vd: đáp án quiz) |
| Chính xác domain (④) | Khái niệm chuyên môn (cấu trúc Agent, token, chi phí API, quan hệ trong mind map, đáp án quiz) đúng 100% theo tài liệu — sai ở đây tính là fail, không có mức "gần đúng" |
| Vận hành đúng (UI/functional) | Outline/slide/mindmap/quiz/animation/TTS hiển thị và đồng bộ đúng chức năng khai báo (case thường, xem golden set) |

*(Hai người trong nhóm chấm độc lập cùng 5 case rồi so — nếu lệch thì viết lại định nghĩa, ghi vào Changelog §9.)*

### Golden set

- File: [eval/golden-set.md](eval/golden-set.md) — hiện có 23 case (8 case thường, 2 case hiếm, 13 case theo 4 lớp: ①×5 ②×1 ③×2 ④×6).
- **Còn thiếu trước khi tính đủ điểm R4:**
  1. Bổ sung case #20b/#10b/#19b (debate mode — mơ hồ / trôi chủ đề / bịa ngoài topic) khớp §5 ở trên, thay cho các case "chatbot hỏi-đáp Section" (11-15, 19, 21-23 hiện tham chiếu 1 tính năng CHƯA build — giữ các case đó lại làm backlog, không chấm ở lượt đo đầu).
  2. Đánh dấu case nào lấy từ chatlog thật (rubric yêu cầu ≥10) — các case ①/④ ở trên có thể phát triển trực tiếp từ các turn thật đã trích ở §1 (`T0176`, `T1006`, `T0418`, `T1208`, `T0702`...).
  3. **Điền cột "Output thực tế"/"Đạt?" — bắt buộc chạy prototype thật (cần `API_KEY` thật) rồi điền, không được điền tay/đoán** — đây là dữ liệu quyết định điểm R4, sửa/bịa số liệu ở bước này sẽ bị coi là gian lận theo rubric.

### Quality bar

> **Đề xuất (chưa chạy đủ dữ liệu để chốt số cuối — xem phân tích nguyên nhân bên dưới):**
> "Đạt khi ≥75% case qua bộ golden set, VÀ 100% case lớp ① (nguồn sự thật) + lớp ④ (đặc thù domain) phải đạt — không có ngoại lệ 'gần đúng' cho hai lớp này."
> Lý do đề xuất mức này: lớp ①/④ sai là mất niềm tin/học sai kiến thức ngay lập tức (xem §1 — đúng vấn đề đang đo được ở tutor hiện tại), nên không thể có bar thấp cho 2 lớp đó dù tổng thể chấp nhận 75%.

### Kết quả các lượt chạy

| Lượt | Ngày | Tổng case | Đạt | % | Ghi chú |
|---|---|---|---|---|---|
| Smoke test | 2026-07-31 | 1 (không phải lượt đo chính thức) | — | — | Gọi `run_quiz_agent()` thật qua Google AI Studio (Gemini, OpenAI-compatible endpoint) với `API_KEY` thật — key hợp lệ (không phải lỗi 401), nhưng dính `429 RESOURCE_EXHAUSTED` ngay từ request đầu do free-tier chỉ 20 request/ngày. Quan sát được: cơ chế fallback rule-based trong `quiz_agent.py` (`_fallback_draft`) kích hoạt đúng như thiết kế khi LLM lỗi, không crash. |
| 1 | — | 20-27 (tuỳ số case sau khi bổ sung) | **Không chạy được** | **Không có** | **Chưa chạy được lượt đo chính thức nào tính đến hạn nộp.** |

**Phân tích nguyên nhân chưa chạy được (thay vì để trống hoặc điền số giả):**
- Nhóm không có API key riêng có billing/quota đủ lớn; key Google AI Studio free-tier duy nhất có được chỉ cho 20 request/ngày và đã hết quota ngay ở lượt smoke test đầu tiên (1 request).
- Golden set cần 20-27 request (mỗi case tối thiểu 1 lần gọi agent), vượt quá quota free-tier trong một ngày — không đủ để chạy trọn bộ trước hạn nộp.
- Không thử "chờ quota reset rồi chạy tiếp" được vì đã đến hạn nộp.
- Do đó bảng % ở trên **để trống có chủ đích, không phải bỏ sót** — theo đúng tinh thần rubric R4: *"Không đạt quality bar nhưng phân tích được nguyên nhân vẫn được tính đủ điểm; số liệu bị chỉnh sửa sẽ không được tính."* Quality bar 75%/100% ở trên vẫn là con số đề xuất có lý do rõ ràng (không phải chọn bừa), chỉ chưa có % thực tế để đối chiếu.
- **Việc cần làm ngay sau khi nộp** (không thuộc phạm vi buộc phải xong trước hạn, nhưng nên làm sớm nhất có thể): xin thêm key/billing hoặc đợi quota reset theo ngày, chạy trọn bộ golden set, điền lại bảng này và §9 Changelog.

*(Cập nhật đến trước CP6. Bảng phải đủ mọi case kể cả case chưa đạt.)*

## §8. Phân công & kế hoạch
- **Phân công có tên** *(chia đều 5 người theo guide §3.5 — mỗi người chịu trách nhiệm chính 1 mảng, nhưng phải hiểu và giải thích được phần của mình khi TA hỏi ngẫu nhiên tại CP5/CP6):*

| Người | Phụ trách chính | Việc cụ thể |
|---|---|---|
| **Đặng Nguyên Giáp** | Spec + điều phối | Chốt `spec.md` §1-§9, lịch checkpoint, chuẩn bị demo script + slide 6 trang, tổng hợp changelog |
| **Nguyễn Thị Thu Trang** | Evidence | Chạy khảo sát Đường A (≥20 người ngoài nhóm, log nguyên văn), mining sâu thêm chatlog (đối chiếu thêm ví dụ nguyên văn cho §1), tổng hợp bảng impact |
| **Phạm Minh Hiếu** | Code — backend | Bảo trì/mở rộng `app/agents/*.py` + `main.py` (outline pipeline, upload-slide), đảm bảo ≥1 lời gọi AI thật chạy được, log/trace lưu trong repo |
| **Nguyễn Thế Sơn** | Code — frontend/tích hợp | Luồng FE (`page.tsx`, `components/`) nối đúng các API `/api/generate/*`, `/api/debate/turn`, `/api/upload-slide`; đảm bảo flow bấm được trọn vẹn end-to-end |
| **Mai Tuấn Quang** | Prompt & Eval | Viết/tinh chỉnh prompt trong các agent, xây `eval/golden-set.md` đủ ≥20 case đúng taxonomy, chạy lượt đo đầu + ghi bảng kết quả |

- **Willing users / người đã thử & phản hồi** (log đầy đủ ở [validation/feedback-log.md](validation/feedback-log.md)):
  1. Hoàng Thị Thuyên
  2. Dương Tiến Dũng
  3. Đặng Quang Trung
  4. Phạm Thanh Hưng
  5. Trương Công Cường

  ⚠️ Đủ số lượng (≥3) và có quote nguyên văn, nhưng **còn thiếu** để tính đủ điểm R6: (a) xác nhận ai trong 5 người này từng khai là willing user tại CP1, (b) log task/quan sát cụ thể (không chỉ quote tổng hợp) — xem TODO trong `validation/feedback-log.md`.
- **Multi-prototype:** chưa triển khai — nếu kịp giữa CP2-CP3, cân nhắc thử 2 phương án cho automation của quiz: (a) hiện tại — sinh xong hiển thị luôn; (b) thêm bước "xem trước + xác nhận" trước khi tính điểm, để so sánh trục automate vs augment nêu ở §4.

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| 2026-07-31 | Hoàn thiện spec.md §1-§9 dựa trên đọc trực tiếp code (`app/agents/*.py`, `main.py`, `schemas.py`) + mining thật `data/vlearn-pack/chatlog/` cho evidence | Bản spec trước để trống §1-§3, §4, §7-§8; đồng thời phát hiện §5 golden-set cũ mô tả 1 tính năng "chatbot hỏi-đáp Section" KHÔNG khớp code thật (code thật là debate/discussion mode) — đã sửa lát cắt + case rủi ro cho khớp bản build, tránh bị trừ điểm R2/R5 vì "khai báo không khớp thực tế" |
| 2026-07-31 | Ghi nhận vòng feedback đầu tiên (5 người: Hoàng Thị Thuyên, Dương Tiến Dũng, Đặng Quang Trung, Phạm Thanh Hưng, Trương Công Cường — log tại `validation/feedback-log.md`) | Cả 5 phản hồi tích cực về đa dạng định dạng ôn tập (outline/mindmap/animation/quiz), khớp đúng pain đã đo ở §1 |
| 2026-07-31 | Quyết định bổ sung: (1) Mind Map + Animation hiển thị trực tiếp trong Outline, (2) Quiz sau mỗi bài học + Completion Screen hiển thị điểm/tiến độ, (3) chatbot trả lời theo từng Section thay vì toàn bộ tài liệu | Theo feedback Phạm Thanh Hưng/Hoàng Thị Thuyên (mục 1), nhu cầu tự kiểm tra ôn tập (mục 2), và Đặng Quang Trung (mục 3) — **mục (3) hiện CHƯA có trong code** (`app/agents/` chưa có endpoint Q&A theo Section, chỉ có `debate_agent.py` dạng thảo luận nhóm); giữ nguyên Non-goal #1 ở §4 cho tới khi agent/endpoint này thực sự được build và test — KHÔNG gỡ Non-goal trước khi code khớp, để tránh bị trừ điểm R5 vì khai báo sai thực tế |
| 2026-07-31 | Quyết định KHÔNG chạy khảo sát Đường A (không khả thi trong thời gian sự kiện), dùng riêng Đường B (mining) làm evidence chính | Rubric tiêu chí 2 chấp nhận "A và/hoặc B"; Đường B đã đủ chuẩn (số đếm được + ≥5 quote + phương pháp kiểm lại được) |
| *(TODO)* | Chạy golden set thật (cần API_KEY), điền %/Output thực tế ở §7; chốt chính thức quality bar | — |

## Backlog (không thuộc lát cắt hiện tại, giữ lại để tham khảo nếu còn dư sức)
- Chatbot hỏi-đáp tự do có trích dẫn theo Section (Non-goal #1 ở §4) — cần thiết kế lại thành 1 endpoint riêng dạng RAG nếu làm sau sự kiện.
- Bản đồ lỗ hổng kiến thức lớp cho giảng viên (ứng viên #3 bị loại ở §2).
