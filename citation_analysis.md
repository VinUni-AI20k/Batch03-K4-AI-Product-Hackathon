# 🔬 Phân tích: Bài toán Citation trong VLearn AI Tutor (v2.0)

> **Cập nhật**: Đã tinh chỉnh sau khi đào sâu trực tiếp vào file CSV và đánh giá lại độ tin cậy của dữ liệu transcript (theo README).

---

## 1. Dữ liệu thực tế: Lỗi không nằm ở Prompt, mà ở Kiến trúc RAG

Phân tích 2,522 dòng log, phát hiện chấn động nhất là: **100% dữ liệu** có `conversation_mode = in_class`. Toàn bộ tương tác đều đến từ luồng "Bôi đen tài liệu và hỏi".

Tin nhắn của học viên luôn được frontend tự động gắn anchor:
```
(Trang 37, đoạn được chọn: "tóm tắt nội dung chính trong slide này")
tóm tắt nội dung chính trong slide này
```

**Nghịch lý 46.2%**: Dù hệ thống **đã được mớm sẵn chính xác trang (anchor)**, Tutor vẫn fail trong 46.2% trường hợp (trả lời không có citation hoặc báo "Rất tiếc, tôi không tìm thấy nội dung cụ thể cho trang 33...").

**Nguyên nhân gốc rễ (Root Cause)**:
- Retrieval pipeline hiện tại đang **không tin tưởng/tận dụng anchor**.
- Nó coi `(Trang 37...)` chỉ là một phần của chuỗi văn bản để quăng vào **Semantic Search** (Vector RAG) thay vì dùng nó làm khóa để **Deterministic Lookup** (lấy chính xác nội dung trang 37).
- Hậu quả: Semantic search có thể trượt, hoặc nhầm lẫn (vd: matching số "33" với "mức điểm 33% ở trang 60").
- **Kết luận**: Đây là lỗi thiết kế kiến trúc truy xuất, không phải lỗi prompt của LLM.

**Bằng chứng định lượng về tầm quan trọng**:
- Có citation → 21 up / 8 down (~72% hài lòng).
- Không citation → 12 up / 29 down (~29% hài lòng).
→ Độ tin cậy (verifiability), chứ không phải văn phong, là biến quyết định sự hài lòng của học viên.

---

## 2. Rủi ro "Citation Theater" từ Transcript khóa trước

Dữ liệu được cấp có 6 file transcript. Ban đầu, ý tưởng là parse transcript thành các chunk `[Txx-NNN]` và dùng mã này làm citation hiển thị cho học viên. Tuy nhiên, soi kỹ README, đây là một cái bẫy UX chết người.

**Sự thật về Transcript**:
- Giữ lại ~54% nội dung thô (bị cắt gọt nhiều).
- Có nhiều đoạn `[không nghe rõ]`.
- 2/6 file không xác định được ngày.
- Trầm trọng nhất: **Đây là transcript của KHÓA TRƯỚC**. Slide khóa hiện tại có thể đã thay đổi (thêm/bớt/đảo thứ tự). Học viên không có quyền truy cập file transcript này để đối chiếu.

**Hệ lụy nếu cite `[T01-045]`**:
Việc vứt cho học viên một mã `[T01-045]` tạo ra **Citation Theater** (Vở kịch trích dẫn). Nó trông có vẻ khoa học, "đáng tin", nhưng thực chất học viên **không thể click vào để xác thực (verify)**.
> *Một citation không verify được còn nguy hiểm hơn không có citation, vì nó tạo cảm giác tin cậy giả và sẽ sụp đổ ngay khi học viên phát hiện ra.*

---

## 3. Kiến trúc mới: Tách bạch Grounding và Citation

Để giải quyết bài toán trên, ta cần thiết kế lại cách hệ thống sử dụng tài liệu. Không được nhầm lẫn giữa "nguồn để LLM đọc" và "nguồn để hiển thị cho user".

| Vai trò | Nguồn dữ liệu | Cách sử dụng | Hiển thị trên UI? |
|---|---|---|---|
| **1. Trích dẫn (Citation)** | **Slide hiện tại** (có số trang rõ ràng) | Là mỏ neo (anchor). Phải verifiable (kiểm chứng được) và click-to-jump (click để nhảy đến trang). | **CÓ**. Chỉ trỏ về trang slide: `[Trang 45]`. |
| **2. Bổ trợ ngữ cảnh (Grounding)** | **Transcript khóa trước** | Giúp LLM hiểu sâu hơn, lấy ví dụ, cách giảng viên giải thích để sinh câu trả lời hay hơn. | **KHÔNG**. Chỉ nằm ẩn trong system prompt/context của LLM. |

**Quy tắc sinh câu trả lời:**
1. LLM đọc cả Trang slide 37 và Transcript tương ứng.
2. LLM sinh câu trả lời dựa trên cả 2 nguồn để có chất lượng tốt nhất.
3. Khi gắn citation hiển thị, LLM **bắt buộc phải re-ground (neo lại)** vào Slide. Chỉ cite những gì có thể tìm thấy/suy ra từ Slide.
4. Nếu một ý hay chỉ có trong Transcript mà không có trong Slide: Không được cite trang slide cho ý đó, mà dùng ngôn ngữ phân tầng rủi ro: *"Giảng viên có mở rộng thêm ở khóa trước (chưa xác thực với tài liệu hiện tại) rằng..."*

---

## 4. Thiết kế UX / Giải pháp Citation cho Hackathon

Hệ thống cần phân rã chiến lược xử lý theo luồng:

### A. Chế độ Bôi đen (Anchored - Trọng tâm Hackathon)

Khi có anchor `(Trang N)`:
1. **Bỏ qua RAG Semantic Search**.
2. **Deterministic Fetch**: Query trực tiếp database/JSON lấy chính xác nội dung `Slide_Page_N`.
3. (Tùy chọn nâng cao): Fetch thêm đoạn `Transcript_Chunk` tương ứng với trang đó để làm giàu ngữ cảnh.
4. Sinh câu trả lời với độ chính xác retrieval 100%.

*Lưu ý UX đặc thù*: 85.2% tương tác là `review_concept` (Socratic, gợi mở). Do đó, citation không nên cứng nhắc kiểu phụ lục, mà nên hòa vào luồng gợi mở:
> *"Gợi ý này nằm ở **Trang 24**, bạn thử đọc lại đoạn đó xem sao?"*

### B. Xử lý trạng thái "Không tìm thấy" (Handling Failures)

Lỗi lớn nhất khiến downvote cao ở nhóm "không citation" là lời xin lỗi vô dụng: *"Rất tiếc tôi không tìm thấy..."*.
- **Cách sửa**: Phải biến ngõ cụt thành hành động (actionable).
- *"Tôi không thấy thông tin này ở trang 37 bạn vừa bôi đen. Tuy nhiên, nó được nhắc đến ở **Trang 12** và **Trang 45**. Bạn có muốn tôi tóm tắt từ các trang đó không?"*

### C. Giao diện 2 mức tín hiệu tin cậy (Trust Signals)

Trên UI frontend, cần hiển thị rõ 2 trạng thái của câu trả lời để quản trị kỳ vọng (expectation management):
1. 🟢 **Nguồn: Slide (Đã xác thực)**: Câu trả lời được bám sát nội dung trang slide (có citation).
2. 🟠 **Mở rộng từ AI / Lịch sử bài giảng**: Câu trả lời lấy từ transcript cũ hoặc suy luận, học viên cần tự hiệu chỉnh mức độ tin cậy.

---

## 5. Kế hoạch Code lại (Next Steps cho Quân)

Với nhận thức mới này, nhiệm vụ Backend của Quân thay đổi hoàn toàn:
1. **Không làm RAG vector database phức tạp** cho mốc này.
2. Dựng một file `data.json` đóng vai trò là "Deterministic Database", map chính xác: `Page N -> Text nội dung trang N`.
3. Viết hàm `fetch_page_content(page_number)` thay vì `semantic_search(query)`.
4. (Nếu kịp): Mapping thủ công vài trang quan trọng (Golden Set) với đoạn Transcript tương ứng để LLM sinh câu trả lời xuất sắc hơn.
