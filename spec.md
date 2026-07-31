<<<<<<< HEAD
# AI SPEC — Khắc phục lỗi "nhớ lệch" và đứt mạch hội thoại của AI Tutor · Nhóm 5 (CVRLearn) · Zone 4
=======
# AI SPEC — Khắc phục lỗi "nhớ lệch" và đứt mạch hội thoại của AI Tutor · Nhóm  CRVLearn(CVRLearn)
>>>>>>> 830e8b532a1aa0d5ca6a5b4c1bd37244b3b2a9fc
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [x] Tối ưu tính năng có sẵn  [ ] Tính năng mới

---

## §1. User & Job
- **Job executor + workflow:** Học viên tự học trên nền tảng VLearn. Quy trình học:
  $$\text{Xem slide/transcript} \rightarrow \text{Bôi đen thuật ngữ/trang slide} \rightarrow \text{Đặt câu hỏi lần 1} \rightarrow \text{Nhận câu trả lời từ AI Tutor}$$
  $$\rightarrow \text{Đặt câu hỏi tiếp theo (follow-up) để đào sâu hoặc làm rõ khái niệm (lượt 2, lượt 3...)} \rightarrow \text{Nhận phản hồi liền mạch từ AI Tutor.}$$
- **Core JTBD:** Hiểu sâu và giải quyết triệt để các thắc mắc về khái niệm học thuật trong bài giảng một cách nhanh chóng và tự nhiên nhất.
- **Problem statement:** Học viên gặp khó khăn khi thảo luận hoặc hỏi sâu về bài học vì đối tác đối thoại (AI Tutor) không thể ghi nhớ hoặc liên kết các câu hỏi trước đó của học viên trong mạch hội thoại. Điều này buộc học viên phải liên tục mô tả lại bối cảnh và câu hỏi cũ, hoặc nhận các phản hồi lạc đề, ngắt quãng mạch suy nghĩ.
- **Evidence:**
  - **Số liệu mining:** Qua phân tích file `chat_history_anonymized_for_hackathon.csv`, trong số **585 hội thoại** thì có tới **276 hội thoại (chiếm 47.2%)** là đa lượt (multi-turn). Trong đó, rất nhiều lượt chat tiếp theo của học viên chứa các từ khóa tham chiếu như *"như thế nào"*, *"tại sao"*, *"ý trên"*, *"câu hỏi trước"*. Hệ thống hiện tại có tỷ lệ citation trống lên tới **46.2%**, một phần lớn do AI Tutor không xác định được ngữ cảnh câu hỏi tiếp theo của học viên để truy xuất RAG đúng.
  - **≥5 ví dụ nguyên văn từ chatlog minh chứng cho lỗi mất mạch ngữ cảnh:**
    1.  **Conversation C0231 (Lượt T0588 - T0451):** Học viên bôi đen khái niệm prompt và hỏi *"cái gì đây"*. AI giải thích. Ngay sau đó học viên hỏi follow-up: *"tại sao khoanh mà ocr ra text rồi lại không trả lời được"*. AI Tutor trả lời chung chung về cách viết prompt và RAG mà hoàn toàn không nhớ câu hỏi trước đó là về khái niệm interface. Học viên nản chí gõ *"hi"*, *"ádlkajdka"*, và kết luận *"chả hiểu gì"*.
    2.  **Conversation C0113 (Lượt T0229):** Học viên hỏi follow-up *"tóm tắt trang 4 trang 5"*. AI Tutor phản hồi: *"Rất xin lỗi... nội dung chỉ kéo dài từ trang 2 đến trang 3 (như bạn đã cung cấp ở các lượt trước)... tôi không tìm thấy thông tin trang 4 và trang 5..."* mặc dù tài liệu đầy đủ có đến 39 trang. AI đã mất dấu mạch tài liệu đang hiển thị ở câu trước.
    3.  **Conversation C0265 (Lượt T1247):** Học viên hỏi *"Học viên gặp khó khăn ở công đoạn nào?..."*. AI đưa ra các câu hỏi gợi mở chung chung. Học viên hỏi tiếp câu follow-up: *"hãy trả lời câu hỏi đó đi"*. AI Tutor lập tức quên mất câu hỏi gốc là gì và chỉ hướng dẫn học viên cách tự đi khảo sát thay vì trả lời trực tiếp nội dung đã bàn luận.
    4.  **Conversation C0148 (Lượt T0264):** Học viên cố gắng hướng dẫn bot tìm tài liệu: *"bạn có tool read file..."* -> AI xác nhận -> Học viên yêu cầu: *"bạn có thể giúp tôi..."* -> AI báo không thấy file -> Học viên bảo tiếp: *"thử đi. tôi thấy có file gì kia kìa"* -> AI quên mất ngữ cảnh thư mục đang bàn và lặp lại câu từ chối.
    5.  **Test thực tế của nhóm (Chụp màn hình minh chứng):** Khi học viên trực tiếp hỏi thử bằng câu *"câu ở trên tôi hỏi là gì"*, AI Tutor thừa nhận: *"Tôi không thể lưu trữ hoặc theo dõi câu hỏi gần nhất của bạn"*, dù nó vẫn trích xuất được nội dung câu trả lời cũ của chính nó. Điều này xác nhận hệ thống truyền thiếu lịch sử prompt của user vào ngữ cảnh của LLM.

---

## §2. Impact & quyết định chọn
- **Bảng impact ≥3 ứng viên:**

| Phương án ứng viên | Quy mô ảnh hưởng | Tần suất | Nỗ lực / Chi phí mỗi lần | Khả thi kỹ thuật |
| :--- | :--- | :--- | :--- | :--- |
| **1. Tự động lồng ghép lịch sử hội thoại (6-8 lượt) vào Context** | ~100% học viên chat đa lượt (369 học viên) | Rất cao (~47.2% số hội thoại) | Input tokens tăng thêm ~500-1500 tokens mỗi lượt chat. | **Rất cao** (Chỉ cần chỉnh sửa prompt và cấu trúc API payload). |
| **2. Tích hợp module Query Rewriting (Viết lại câu hỏi)** | Học viên hỏi follow-up chứa từ tham chiếu ngầm (*"nó"*, *"ý trên"*, *"tại sao"*) | Trung bình-Cao (~20% số lượt chat) | Thêm 1 API call siêu nhỏ (~100 tokens) để rewrite câu hỏi trước khi gọi RAG. | **Cao** (Viết prompt chuyên biệt cho Query Rewriter). |
| **3. Tự động tóm tắt toàn bộ bài học dựa trên transcript** | Học viên muốn ôn tập cuối buổi | Thấp (1 lần/buổi học) | Rất lớn (~30k-50k tokens input transcript), latency cao (~10-20s). | **Thấp-Trung bình** (Dễ bị tràn token limit và chi phí rất đắt). |

- **Ứng viên ĐÃ LOẠI + vì sao:** Ứng viên 3 (Tự động tóm tắt bài học từ transcript) bị loại vì chi phí token quá lớn, độ trễ phản hồi quá cao gây ảnh hưởng nghiêm trọng đến trải nghiệm thời gian thực, và không giải quyết được điểm đau cốt lõi của học viên là sự đứt gãy mạch hội thoại khi hỏi-đáp.
- **Ứng viên CHỌN + vì sao (bằng số):** Chọn kết hợp **Phương án 1 và Phương án 2**. Sự kết hợp này mang lại **Quick Win** lớn nhất: giải quyết triệt để lỗi "nhớ lệch" cho **47.2% hội thoại đa lượt**, nâng cao tính liền mạch của câu trả lời mà chỉ làm tăng chi phí token ở mức tối thiểu (~15% chi phí API tăng thêm) và giữ độ trễ dưới **2.5s** (so với 10-20s của phương án 3).

---

## §3. Giải pháp tương tự đã nghiên cứu
- **ChatGPT Study Mode:**
  - *Flow:* Nhập câu hỏi -> Chatbot phản hồi -> Chat tiếp tục giữ ngữ cảnh vô hạn.
  - *Đáng học:* Khả năng bám sát mạch suy nghĩ rất tốt, có nút "Reset thread" rõ ràng.
  - *Đáng né:* Context window quá dài khiến mô hình dễ bị loãng thông tin và chi phí token tích lũy cao. Không tích hợp RAG tài liệu chuyên biệt.
  - *Mình khác gì:* CVRLearn giới hạn cửa sổ lịch sử (6-8 lượt) để tiết kiệm token và kết hợp Query Rewriting để câu lệnh gửi tới RAG luôn đầy đủ chủ ngữ/ngữ cảnh cục bộ.
- **NotebookLM (Google):**
  - *Flow:* Người dùng tải tài liệu -> Hỏi đáp -> AI hiển thị trích dẫn (citations) sát bên câu trả lời.
  - *Đáng học:* Trích dẫn trực quan giúp tăng độ tin cậy.
  - *Đáng né:* Khi hội thoại quá dài, AI đôi khi bỏ qua các prompt trước đó của người dùng để ưu tiên token cho tài liệu dài.
  - *Mình khác gì:* CVRLearn ưu tiên bảo vệ lịch sử prompt của người dùng trong ngân sách token của context window.

---

## §4. Thiết kế
- **Lát cắt MỘT CÂU:** Một học viên đang hỏi nối tiếp câu hỏi thứ 2 để đào sâu một đơn vị kiến thức (1 người dùng) -> gõ câu hỏi follow-up nối tiếp thắc mắc từ câu hỏi 1 (1 công việc) -> AI Tutor truy xuất lịch sử chat chứa đầy đủ cả prompt trước đó của học viên lẫn câu trả lời của AI (1 quyết định AI) -> trả về câu trả lời liền mạch, bám sát đúng thắc mắc ban đầu của người dùng thay vì trả lời chệch hướng (1 kết quả).
- **Non-goals:**
  1. Không hỗ trợ lưu trữ lịch sử trò chuyện vĩnh viễn qua nhiều ngày học (chỉ lưu trong session học hiện tại).
  2. Không hỗ trợ viết lại các câu hỏi ngoài phạm vi kiến thức khóa học (chỉ tối ưu cho các thắc mắc về slide/transcript bài học).
  3. Không tự động gọi các tool ngoài (như web search) khi thực hiện Query Rewriting.
- **Mức prototype nhắm tới:** [x] Working — phần lõi AI gọi API thật để rewrite và duy trì history; phần DB lưu trữ lịch sử được giả lập chạy trực tiếp trong session/memory của ứng dụng client.
- **Automation:** [x] Conditional — AI tự động lồng ghép lịch sử và viết lại câu hỏi; nếu phát hiện từ ngữ tham chiếu quá mơ hồ mà LLM không thể viết lại một cách tự tin, AI sẽ hỏi lại học viên để làm rõ (*"Ý bạn 'nó' ở đây là..."*) chứ không đoán bừa.
  - *Lý do theo cost-of-error:* Việc AI trả lời sai kiến thức do đoán bừa chủ ngữ có cost-of-error rất cao (làm học viên hiểu sai kiến thức môn học, dẫn đến mất điểm hoặc mất niềm tin vào AI Tutor). Việc chuyển sang hỏi lại học viên (human-in-the-loop) có cost-of-error rất thấp, chỉ tốn thêm 1 lượt chat nhưng đảm bảo tính chính xác 100%.

### §4b. Nguyên tắc đã áp dụng (HAX/PAIR)
| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| **G12 — Nhớ các tương tác gần** (HAX) | Module bộ nhớ đệm tự động lưu 6–8 lượt hội thoại gần nhất (bao gồm cả prompt của user và response của AI) và đưa vào context window của API call tiếp theo. |
| **G10 — Thu hẹp phạm vi khi nghi ngờ** (HAX) | Nếu Query Rewriter có độ tự tin thấp (<0.7 score), AI sẽ đưa ra câu hỏi làm rõ: *"Có phải bạn đang muốn hỏi thêm về [Khái niệm A] ở câu trước không?"* thay vì tự bịa câu trả lời. |
| **G2 — Làm rõ nó làm tốt đến đâu** (HAX) | Giao diện hiển thị một dòng thông báo nhỏ dưới khung chat: *"AI Tutor ghi nhớ mạch hội thoại tối đa 8 câu hỏi gần nhất để hỗ trợ bạn đào sâu bài học."* |
| **G9 — Sửa dễ dàng** (HAX) | Cung cấp nút "Reset hội thoại" (Reset Thread) ngay cạnh khung chat để học viên làm sạch ngữ cảnh khi muốn chuyển sang chủ đề học tập hoàn toàn mới. |

---

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)
| Tình huống cụ thể | Lớp chỗ khó | Hành vi mong muốn (Nói gì / Hiện gì / Cho user làm gì) | Nguyên tắc áp dụng |
| :--- | :--- | :--- | :--- |
| **1. Hỏi về câu hỏi trước khi lịch sử trống** | Nguồn sự thật | AI báo: *"Hiện tại chúng ta chưa có lịch sử trò chuyện trong phiên này. Bạn hãy đặt câu hỏi đầu tiên nhé!"* | G12 (Nhớ tương tác) |
| **2. Hỏi kiến thức nằm ngoài tài liệu khóa học** | Nguồn sự thật | AI từ chối: *"Khái niệm này nằm ngoài tài liệu bài giảng Day 1-2. Tôi có thể giúp bạn giải đáp các vấn đề trong bài học không?"* | G2 (Phạm vi hệ thống) |
| **3. Học viên hỏi follow-up quá ngắn ("Tại sao?")** | Mơ hồ | AI Query Rewriter không tự tin -> AI hỏi lại: *"Bạn muốn hỏi tại sao [Chủ ngữ câu trước] lại hoạt động như vậy hay có ý nào khác?"* | G10 (Hỏi khi nghi ngờ) |
| **4. Dùng từ tham chiếu mơ hồ ("nó là cái nào")** | Mơ hồ | AI Query Rewriter phân tích lịch sử thấy có 3 danh từ -> AI hiển thị: *"Ý bạn 'nó' là [Khái niệm A] hay [Khái niệm B]?"* kèm 2 nút bấm chọn nhanh. | G10 / PAIR (Feedback) |
| **5. Học viên yêu cầu viết hộ code đồ án tốt nghiệp** | Ngoài phạm vi | AI từ chối khéo léo và hướng dẫn học viên quay lại giải thích code trong slide Lab 1. | G2 (Giới hạn hệ thống) |
| **6. Học viên hỏi chuyện riêng tư của giảng viên** | Ngoài phạm vi | AI trả lời: *"Tôi là trợ lý học tập và chỉ có thể thảo luận về nội dung bài giảng. Chúng ta quay lại bài học nhé!"* | G5 (Hợp chuẩn mực) |
| **7. Hỏi tính toán API cost dựa trên slide cũ** | Đặc thù domain | AI trích xuất công thức từ slide, thực hiện tính toán chi tiết và trích dẫn số trang slide công thức đó để học viên tự kiểm chứng. | PAIR (Explainability) |
| **8. Mạch hội thoại bị nhiễu do hỏi nhiều chủ đề** | Đặc thù domain | AI bắt đầu trả lời lệch hướng -> Giao diện nhấp nháy nhẹ nút "Reset hội thoại" gợi ý học viên làm sạch context khi đổi chủ đề. | G9 (Sửa dễ dàng) |

---

## §6. Bốn đường đi của trải nghiệm
- **Happy path:** Học viên hỏi *"RTCF prompt là gì?"* -> AI giải thích trang 17 -> Học viên hỏi tiếp *"Cho tôi ví dụ cụ thể về nó"* -> AI Query Rewriter tự động viết lại thành *"Cho tôi ví dụ cụ thể về RTCF prompt"* -> AI RAG truy xuất slide trang 17 và trả về ví dụ chi tiết, chính xác.
- **Low-confidence (②):** Học viên hỏi follow-up mơ hồ *"tại sao lại thế?"* sau khi AI giải thích cả RAG và Vector DB -> AI Query Rewriter có score thấp -> AI hiển thị: *"Tôi đoán bạn đang hỏi tại sao RAG cần Vector DB. Nếu đúng, câu trả lời là... Nếu không, bạn vui lòng làm rõ câu hỏi giúp tôi nhé."*
- **Failure/không căn cứ (①):** AI không tìm thấy tài liệu liên quan trong transcript để giải thích câu hỏi tiếp theo -> AI thừa nhận: *"Tôi nhớ bạn đang hỏi về [Chủ đề], nhưng tài liệu bài giảng không có thông tin chi tiết để giải thích sâu hơn. Bạn có muốn thảo luận về [Chủ đề liên quan] có trong slide không?"*
- **Correction (user sửa):** Học viên phát hiện AI hiểu sai ý ở câu follow-up -> Học viên bấm nút "Sửa câu hỏi trước" hoặc nút "Reset" để xóa bớt lịch sử nhiễu và đặt lại câu hỏi rõ ràng hơn.
- **Khi bị đòi ngoài phạm vi (③):** Học viên yêu cầu AI giải bài tập hộ để nộp -> AI từ chối cung cấp code trực tiếp, thay vào đó cung cấp các gợi ý từng bước (giving hints) để học viên tự hoàn thành.
- **Case đặc thù domain (④):** Học viên hỏi follow-up sâu về kỹ thuật lập trình Agent (ReAct) -> AI trích dẫn đúng mã đoạn `[Txx-NNN]` từ transcript bài giảng để làm căn cứ giải thích, tránh tối đa việc bịa đặt kiến thức chuyên môn.

---

## §7. Kiểm thử
- **Chiều chất lượng + định nghĩa kiểm chứng được:**
  1.  **Tính bảo toàn ngữ cảnh (Context Preservation):** AI trả lời đúng trọng tâm câu hỏi follow-up mà không bị mất dấu chủ ngữ của câu hỏi đầu tiên. (Đo bằng Pass/Fail trên từng test case).
  2.  **Độ chính xác của Query Rewriting (Rewriting Accuracy):** Câu hỏi được viết lại phản ánh đúng 100% ý định thực tế dựa trên lịch sử hội thoại. (Đo bằng Pass/Fail).
- **Golden set:** Lưu trữ tại file [golden_set.json](file:///c:/Users/User/Desktop/Lab5_307/K4-hackathon-CRVLearn-E403/eval/golden_set.json) gồm **22 cases** (12 cases lấy từ chatlog thật của các học viên gặp lỗi đứt mạch ngữ cảnh, 6 cases kịch bản rủi ro/mơ hồ, 4 cases đặc thù tính toán/domain).
- **Quality bar:** "Đạt khi **≥ 85% (19/22 case)** vượt qua bộ kiểm thử, và không có trường hợp nào AI Tutor trả lời 'Tôi không thể lưu trữ hoặc theo dõi câu hỏi gần nhất của bạn' khi lịch sử hội thoại dưới 6 lượt."
- **Kết quả các lượt chạy:**

| Lần chạy | Thời điểm | Tỷ lệ Pass (%) | Ghi chú / Nguyên nhân lỗi chính |
| :--- | :--- | :--- | :--- |
| Lần 1 (Nháp) | 30/07/2026 16:30 | *Đang cập nhật* | *Sẽ chạy sau khi code xong API và prompt nháp* |
| Lần 2 | 30/07/2026 21:00 | *Đang cập nhật* | *Tinh chỉnh Prompt Query Rewriter* |

---

## §8. Phân công & kế hoạch
- **Phân công có tên:**
  - **Trần Tiến Dũng:** Đào dữ liệu (Tìm thêm các conversation_id trong chatlog bị đứt mạch do mất user prompt).
  - **Hoàng Thị Hà Huyền:** Kỹ sư AI (Thiết kế prompt hệ thống và prompt ép LLM tham chiếu lịch sử).
  - **Dương Văn Kiên:** Kỹ sư AI 2 (Xây dựng bộ Golden Set 22 cases trong thư mục `eval/`).
  - **Nguyễn Đình Hoàng:** Xây dựng Prototype (Code logic lưu trữ mảng History 6-8 lượt, tích hợp Query Rewriter API).
  - **Lương Hoàng Minh:** Viết tài liệu `spec.md` & Liên hệ khảo sát User thật (Validation).
- **Willing users:** 3 học viên thật cùng lớp học: **Phạm Minh Đức, Vũ Khánh Linh, Đỗ Anh Tuấn**. Kế hoạch validation (CP5) gồm 3 câu hỏi:
  1.  *Bạn thấy AI Tutor trả lời câu hỏi nối tiếp có trôi chảy và đúng mạch suy nghĩ của bạn không?*
  2.  *Có thời điểm nào AI bị quên những gì bạn vừa nói ở 2-3 câu trước không?*
  3.  *Nút Reset mạch hội thoại và cách hiển thị thông tin giới hạn ghi nhớ có giúp bạn chủ động hơn khi chat không?*
  (Lương Hoàng Minh ghi log phản hồi vào thư mục `validation/`).
- **Multi-prototype:**
  - **Phương án A:** Truyền toàn bộ mảng lịch sử (prompts + responses) trực tiếp vào API call của RAG.
  - **Phương án B (Chọn):** Dùng một LLM siêu nhỏ chạy trước để viết lại câu hỏi follow-up (Query Rewriter) thành một câu độc lập đầy đủ ngữ nghĩa, sau đó mới gửi câu hỏi độc lập này qua hệ thống RAG và LLM chính.
  - *Lý do chọn:* Phương án B giúp tối ưu hóa hiệu suất tìm kiếm của RAG (Vector Search hoạt động tốt hơn nhiều với câu hỏi độc lập đầy đủ chủ từ hơn là chuỗi hội thoại dài dòng bị nhiễu).

---

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
| :--- | :--- | :--- |
| 30/07/2026 15:55 | Khởi tạo Spec v1.0 | Khớp thông tin CP1 thống nhất của nhóm CRVLearn. |
