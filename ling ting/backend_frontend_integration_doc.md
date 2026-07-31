# Tài liệu Tích hợp Frontend - Backend (VLearn AI Tutor)

Tài liệu này mô tả chi tiết kiến trúc, luồng hoạt động và định dạng dữ liệu trả về của API `/chat`. Frontend Developer sử dụng tài liệu này để xây dựng giao diện UI/UX hiển thị phản hồi của AI Tutor một cách chính xác.

## 1. Thông tin chung
- **Endpoint**: `POST /chat`
- **Chức năng**: Nhận tin nhắn từ học viên, xử lý qua hệ thống Dual-Engine RAG (Retrieval-Augmented Generation) kết hợp Google Search Grounding và trả về dữ liệu JSON đã được cấu trúc hóa.
- **Payload Request**:
  ```json
  {
    "message": "Nội dung tin nhắn của học viên"
  }
  ```

## 2. Kiến trúc Dual-Engine

Backend tự động phân luồng tin nhắn của học viên thành 2 nhánh (Engines) dựa trên nội dung tin nhắn:

### Nhánh A: Anchored Flow (Hỏi có bối cảnh Slide)
- **Điều kiện kích hoạt**: Tin nhắn có chứa cú pháp bôi đen từ giao diện học: `(Trang X, đoạn được chọn: "...") Câu hỏi thực sự`.
- **Luồng xử lý**: Backend dùng Regex bóc tách đoạn text được bôi đen và tìm kiếm **Exact Match** (chính xác tuyệt đối) trong database của slide.
- **Kết quả**:
  - `anchored_success`: Tìm thấy bối cảnh. Trả lời dựa trên bối cảnh, ép buộc có trích dẫn slide (`citations`) và tự động tìm kiếm Google để trả về nguồn đọc thêm (`external_links`).
  - `anchored_not_found`: Không tìm thấy bối cảnh do lỗi highlight hoặc query drift. AI sẽ yêu cầu học viên làm rõ. Nhánh này sẽ **không** trả về thẻ trích dẫn và `external_links` sẽ rỗng `[]`.

### Nhánh B: Unanchored Flow (Hỏi tự do)
- **Điều kiện kích hoạt**: Các câu hỏi thông thường không chứa cú pháp bôi đen.
- **Luồng xử lý**: 
  - Backend sử dụng mô hình Vector (SentenceTransformer) để tìm kiếm theo ngữ nghĩa (Semantic Search) top 3 đoạn ghi âm bài giảng (Transcript) phù hợp nhất từ Qdrant DB.
  - Ánh xạ từ khóa để tìm ra Slide liên quan nhất (Slide Mapping).
- **Kết quả**: `unanchored_rag`. AI sẽ trả lời dựa trên lời giảng của giảng viên, có trích dẫn trang slide liên quan, và luôn kèm theo các tài liệu đọc thêm từ Google Search.

---

## 3. Cấu trúc JSON Response (Đầu ra)

Backend đã bóc tách toàn bộ metadata phức tạp và trả về một object JSON phẳng (flat object), thân thiện với Frontend.

```json
{
  "mode": "unanchored_rag",
  "detected_page": "unmatched_d1-slide-hackathon.pdf_idx_9",
  "answer": "Prompt Injection trong LLM là... <citation>unmatched_d1-slide-hackathon.pdf_idx_9</citation>",
  "follow_up": [
    "Theo bạn, tại sao việc phòng tránh lại khó?",
    "Ngoài Prompt Injection còn có loại tấn công nào?"
  ],
  "citations": [
    "unmatched_d1-slide-hackathon.pdf_idx_9"
  ],
  "external_links": [
    {
      "title": "What is prompt injection? - IBM",
      "domain": "www.ibm.com",
      "url": "https://www.ibm.com/topics/prompt-injection",
      "snippet": "Learn how attackers manipulate LLM prompts to bypass safety filters...",
      "type": "Article"
    },
    {
      "title": "Prompt injection - Wikipedia",
      "domain": "en.wikipedia.org",
      "url": "https://en.wikipedia.org/wiki/Prompt_injection",
      "snippet": "Prompt injection is an attack against applications built on top of AI...",
      "type": "Wiki"
    }
  ],
  "final_prompt_template": "..." 
}
```

### Chi tiết các trường (Fields) quan trọng dành cho Frontend:

| Field | Type | Mô tả & Hướng dẫn Render UI |
| :--- | :--- | :--- |
| `mode` | String | Trạng thái luồng xử lý: `anchored_success`, `anchored_not_found`, hoặc `unanchored_rag`. (Thường dùng để log hoặc đổi icon UI). |
| `detected_page` | String/Null | ID của trang Slide mà AI phát hiện có liên quan nhất. |
| `answer` | String | Câu trả lời chính của AI (Markdown format). **Lưu ý**: Có thể chứa các thẻ `<citation>page_id</citation>`. Frontend cần dùng Regex thay thế thẻ này thành một Nút bấm (Button) hoặc Hyperlink để khi người dùng click vào, trình xem PDF bên trái sẽ nhảy đến đúng trang đó. |
| `follow_up` | Array[String] | Danh sách 2-3 câu hỏi gợi mở tiếp nối. Frontend nên render dưới dạng các "Chip" hoặc "Gợi ý" ở cuối câu trả lời để học viên click vào hỏi tiếp. |
| `citations` | Array[String] | Danh sách ID các trang slide được AI trích dẫn trong câu trả lời (Dùng để kiểm tra xem có trích dẫn hay không). |
| `external_links` | Array[Object] | Mảng chứa tối đa 3 tài liệu đọc thêm lấy từ Google Search Grounding. Đã được Backend phân giải ra Canonical URL và lấy meta data (title, snippet). |

### Chi tiết cấu trúc Object của `external_links`:
Dữ liệu này được thiết kế để render giao diện tương tự Perplexity.

- **`title`**: Tiêu đề trang web (đã được parse và rút gọn).
- **`domain`**: Tên miền gốc (vd: `en.wikipedia.org`, `hai.stanford.edu`).
- **`url`**: Đường dẫn đích (Canonical URL), **không phải** link redirect ảo của Google. Dùng để gán vào thẻ `href`.
- **`snippet`**: Tóm tắt nội dung trang (lấy từ thẻ `<meta name="description">`). Frontend có thể hiển thị dưới dạng Tooltip khi hover, hoặc hiện mờ phía dưới title.
- **`type`**: Phân loại tài nguyên, dùng để hiển thị Icon tương ứng cho đẹp mắt. Có các loại sau:
  - `Paper` (📄): Các nghiên cứu từ arxiv.
  - `Wiki` (🌐): Từ Wikipedia.
  - `Academic` (🎓): Các trang có đuôi `.edu`.
  - `Docs` (📘): Tài liệu kỹ thuật từ Microsoft, Google Developer, Github...
  - `Blog` (✍️): Các trang Medium, TowardsDataScience...
  - `Article` (📰): Các bài báo thông thường.

---

## 4. Cơ chế thông minh của Backend (Frontend không cần bận tâm nhưng cần biết)

- **Prioritization (Whitelist)**: Backend tự động ưu tiên các nguồn chất lượng cao (như OpenAI, Stanford, Wikipedia, IBM) lên đầu mảng `external_links`.
- **URL Resolution & Scraping**: URL do AI trả về vốn dĩ là link redirect mã hóa của Google (`vertexaisearch...`). Backend đã tự động `requests.head` để phân giải thành URL thật, đồng thời tải lướt qua HTML để bóc lấy thẻ `<title>` và `<meta description>` cho Frontend.
- **Guardrails**: Nếu người dùng hỏi các câu hỏi không liên quan và rơi vào `anchored_not_found`, Backend sẽ chủ động ngắt Google Search và trả về mảng `external_links` rỗng để tránh hiện tượng Query Drift (Lạc đề). Frontend chỉ cần ẩn khu vực "Đọc thêm" nếu mảng này rỗng.

## 5. Hướng dẫn tích hợp cho Frontend

Một đoạn mã giả (Pseudo-code) ví dụ cho cách render component:

```javascript
// 1. Render Answer & Citations
let htmlAnswer = markdownToHTML(response.answer);
// Thay thế <citation> thành nút bấm
htmlAnswer = htmlAnswer.replace(
  /<citation>(.*?)<\/citation>/g, 
  `<button class="citation-btn" onclick="jumpToSlide('$1')">📄 Trang $1</button>`
);
document.getElementById("chat-bubble").innerHTML = htmlAnswer;

// 2. Render External Links (Giao diện Perplexity)
if (response.external_links && response.external_links.length > 0) {
  let linksHTML = response.external_links.map(link => `
    <a href="${link.url}" target="_blank" class="external-link-card" title="${link.snippet}">
      <div class="link-icon">${getIconForType(link.type)}</div>
      <div class="link-info">
        <h4>${link.title}</h4>
        <span>${link.domain}</span>
      </div>
    </a>
  `).join("");
  document.getElementById("read-more-section").innerHTML = linksHTML;
}

// 3. Render Follow Ups
if (response.follow_up && response.follow_up.length > 0) {
  let followUpHTML = response.follow_up.map(q => `
    <button class="follow-up-chip" onclick="sendChat('${q}')">${q}</button>
  `).join("");
  document.getElementById("follow-up-section").innerHTML = followUpHTML;
}
```
