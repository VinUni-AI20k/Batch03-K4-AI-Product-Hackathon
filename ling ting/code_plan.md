# 🔧 Code Plan — Citation-First Tutor Prototype

## Kiến trúc tổng quan

```
                        ┌─────────────┐
                        │   Browser   │
                        └──────┬──────┘
                               │
                  ┌────────────▼────────────┐
                  │  Frontend (index.html)   │
                  │                          │
                  │  ┌──────────────────┐    │
                  │  │ Transcript view  │    │  ← Hiện nội dung bài giảng
                  │  │ (bôi đen text)   │    │
                  │  └──────────────────┘    │
                  │  ┌──────────────────┐    │
                  │  │ Question input   │    │  ← Ô gõ câu hỏi
                  │  │ [Hỏi AI Tutor]   │    │
                  │  └──────────────────┘    │
                  │  ┌──────────────────┐    │
                  │  │ Answer display   │    │  ← Kết quả + [trang N]
                  │  │ + citation tags  │    │
                  │  │ + 👍👎 feedback  │    │
                  │  └──────────────────┘    │
                  └────────────┬────────────┘
                               │ fetch("/api/ask")
                  ┌────────────▼────────────┐
                  │  Backend (app.py)        │
                  │  FastAPI / Flask         │
                  │                          │
                  │  1. Parse request        │
                  │  2. retrieve(query)  ──────► Knowledge Base
                  │  3. build_prompt()       │   (transcript chunks)
                  │  4. call_llm()      ──────► Gemini API (THẬT)
                  │  5. Return response      │
                  └─────────────────────────┘
```

---

## Cấu trúc thư mục `codebase/`

```
codebase/
├── README.md                  ← Hướng dẫn chạy local
├── app.py                     ← Backend chính (FastAPI)
├── rag/
│   ├── loader.py              ← Load + chunk transcript
│   ├── retriever.py           ← Search đoạn liên quan
│   └── llm.py                 ← Gọi Gemini API
├── prompts/
│   ├── system_prompt_v1.txt   ← Prompt v1
│   └── system_prompt_v2.txt   ← Prompt sau khi sửa từ eval
├── static/
│   ├── index.html             ← Trang chính
│   ├── style.css              ← CSS
│   └── app.js                 ← JS xử lý UI
├── data/                      ← Transcript đã chunk (KHÔNG commit data pack gốc)
│   └── chunks.json            ← Output của loader.py
├── .env.example               ← Template env (KHÔNG commit .env thật)
└── requirements.txt           ← Dependencies
```

---

## PHASE CP2 — Frontend bấm được (chưa cần AI)

### File 1: `static/index.html`

```html
<!-- Layout chính -->
<div id="app">
  <!-- Header -->
  <header>
    <h1>📚 Citation-First AI Tutor</h1>
    <p class="subtitle">
      Tôi trả lời dựa trên tài liệu buổi học. 
      Ngoài tài liệu, tôi sẽ nói rõ.
    </p>  <!-- ← G2: Làm rõ AI tốt đến đâu -->
  </header>

  <!-- Panel trái: Transcript -->
  <div id="transcript-panel">
    <h2>📖 Tài liệu buổi học</h2>
    <select id="transcript-selector">
      <option>Day 2 — Xác định bài toán (T01)</option>
      <option>Day 1 — Foundation LLM (T04)</option>
    </select>
    <div id="transcript-content">
      <!-- Nội dung transcript load ở đây -->
      <!-- User bôi đen text → JS bắt selection -->
    </div>
  </div>

  <!-- Panel phải: Chat -->
  <div id="chat-panel">
    <div id="selected-text">
      <!-- Hiện đoạn user vừa bôi đen -->
      <span class="label">Đoạn đã chọn:</span>
      <p id="highlight-preview">Chưa chọn đoạn nào</p>
    </div>
    <div id="question-area">
      <input id="question-input" placeholder="Hỏi về đoạn này..." />
      <button id="ask-btn">Hỏi AI Tutor</button>
    </div>
    <div id="answer-area">
      <!-- Kết quả AI hiện ở đây -->
      <!-- Format: giải thích + [trang N, đoạn Txx-NNN] -->
    </div>
    <div id="feedback-area" style="display:none">
      <!-- G15: Nút feedback -->
      <button class="feedback-btn">👍</button>
      <button class="feedback-btn">👎</button>
      <span>Câu trả lời có hữu ích không?</span>
    </div>
  </div>
</div>
```

**Yêu cầu CP2:**
- Bôi đen text trên transcript → hiện preview đoạn đã chọn ✅
- Gõ câu hỏi + bấm "Hỏi AI" → hiện kết quả (hardcode) ✅
- Kết quả có dạng: `"Giải thích... [trang 45, đoạn T01-023]"` ✅
- Bấm đi hết flow, không crash giữa chừng ✅

### File 2: `static/app.js`

```javascript
// === CP2: Mock response (thay thế bằng API call ở CP3) ===

// 1. Bắt sự kiện bôi đen text
document.getElementById('transcript-content').addEventListener('mouseup', () => {
  const selection = window.getSelection().toString().trim();
  if (selection.length > 0) {
    document.getElementById('highlight-preview').textContent = selection;
    // Lưu selectedText để gửi lên backend
    window.selectedText = selection;
  }
});

// 2. Bấm "Hỏi AI" → gửi request
document.getElementById('ask-btn').addEventListener('click', async () => {
  const question = document.getElementById('question-input').value;
  const selectedText = window.selectedText || '';
  
  // Hiện loading
  document.getElementById('answer-area').innerHTML = '<p class="loading">Đang tìm trong tài liệu...</p>';
  
  // === CP2: Hardcode response ===
  // === CP3: Thay bằng fetch('/api/ask', ...) ===
  const mockResponse = {
    answer: "Đoạn này trình bày 4 chiến lược tối ưu prompt: Write, Select, Compress, Isolate...",
    citations: ["trang 45", "đoạn T01-023"],
    confidence: "high"
  };
  
  // Hoặc mock case "không tìm thấy":
  // const mockResponse = {
  //   answer: "Nội dung này không có trong tài liệu buổi học hiện tại.",
  //   citations: [],
  //   confidence: "none"  
  // };
  
  setTimeout(() => {
    displayAnswer(mockResponse);
  }, 1000); // Giả lập delay
});

// 3. Hiển thị kết quả
function displayAnswer(response) {
  const answerArea = document.getElementById('answer-area');
  let citationHtml = '';
  if (response.citations.length > 0) {
    citationHtml = response.citations
      .map(c => `<span class="citation">[${c}]</span>`)
      .join(' ');
  }
  answerArea.innerHTML = `
    <div class="answer ${response.confidence}">
      <p>${response.answer}</p>
      <div class="sources">${citationHtml || '<span class="no-source">Không tìm thấy trong tài liệu</span>'}</div>
    </div>
  `;
  // Hiện nút feedback (G15)
  document.getElementById('feedback-area').style.display = 'flex';
}
```

---

## PHASE CP3 — Backend AI thật

### File 3: `rag/loader.py` — Load + chunk transcript

```python
"""
Load transcript markdown → chia thành chunks theo mã [Txx-NNN]

Input:  data/vlearn-pack/transcript/transcript-01-clean.md
Output: data/chunks.json
"""
import re
import json

def load_transcript(filepath: str) -> list[dict]:
    """Parse transcript thành list of chunks."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    chunks = []
    # Regex bắt pattern: **[Txx-NNN]** nội dung...
    pattern = r'\*\*\[([T]\d{2}-\d{3})\]\*\*\s*(.*?)(?=\*\*\[[T]\d{2}-\d{3}\]\*\*|## |\Z)'
    matches = re.findall(pattern, content, re.DOTALL)
    
    for code, text in matches:
        text = text.strip()
        if len(text) > 20:  # Bỏ đoạn quá ngắn
            chunks.append({
                "id": code,           # "T01-023"
                "text": text,          # Nội dung đoạn
                "source": filepath,    # File nguồn
                "section": "",         # Heading cha (parse thêm nếu cần)
            })
    
    return chunks

def load_all_transcripts(transcript_dir: str) -> list[dict]:
    """Load tất cả transcript, gán metadata."""
    import os
    all_chunks = []
    for fname in sorted(os.listdir(transcript_dir)):
        if fname.endswith('-clean.md'):
            fpath = os.path.join(transcript_dir, fname)
            chunks = load_transcript(fpath)
            # Gán thêm metadata buổi học
            for c in chunks:
                c["file"] = fname
            all_chunks.extend(chunks)
    return all_chunks

# Chạy 1 lần → lưu chunks.json
if __name__ == "__main__":
    chunks = load_all_transcripts("../data/vlearn-pack/transcript/")
    with open("data/chunks.json", "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)
    print(f"Loaded {len(chunks)} chunks from transcripts")
```

**Output mẫu `chunks.json`:**
```json
[
  {
    "id": "T01-001",
    "text": "Một trong những kỹ năng mình nghĩ quan trọng...",
    "source": "transcript-01-clean.md",
    "file": "transcript-01-clean.md"
  },
  ...
]
```

### File 4: `rag/retriever.py` — Tìm đoạn liên quan

```python
"""
Retrieval đơn giản: keyword search trên chunks.
Có thể nâng lên embedding search nếu kịp.
"""

import json
import re
from typing import List, Dict

class SimpleRetriever:
    def __init__(self, chunks_path: str = "data/chunks.json"):
        with open(chunks_path, 'r', encoding='utf-8') as f:
            self.chunks = json.load(f)
    
    def search(self, query: str, selected_text: str = "", top_k: int = 5) -> List[Dict]:
        """
        Keyword search: đếm số từ query xuất hiện trong chunk.
        Ưu tiên chunk chứa selected_text.
        
        Returns: top_k chunks có score cao nhất
        """
        # Tách query thành từ khóa
        query_combined = f"{selected_text} {query}".lower()
        keywords = set(re.findall(r'\w{3,}', query_combined))  # từ ≥3 ký tự
        
        scored = []
        for chunk in self.chunks:
            chunk_lower = chunk["text"].lower()
            score = 0
            
            # Đếm keyword matches
            for kw in keywords:
                if kw in chunk_lower:
                    score += 1
            
            # Bonus nếu chunk chứa selected_text
            if selected_text and selected_text.lower() in chunk_lower:
                score += 10
            
            if score > 0:
                scored.append({**chunk, "score": score})
        
        # Sắp xếp theo score
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]


# --- NÂNG CAO (nếu kịp): Embedding search ---
# class EmbeddingRetriever:
#     def __init__(self, chunks_path):
#         # pip install sentence-transformers
#         from sentence_transformers import SentenceTransformer
#         self.model = SentenceTransformer('all-MiniLM-L6-v2')
#         self.chunks = json.load(open(chunks_path))
#         self.embeddings = self.model.encode([c["text"] for c in self.chunks])
#
#     def search(self, query, top_k=5):
#         q_emb = self.model.encode([query])
#         from sklearn.metrics.pairwise import cosine_similarity
#         scores = cosine_similarity(q_emb, self.embeddings)[0]
#         top_idx = scores.argsort()[-top_k:][::-1]
#         return [self.chunks[i] | {"score": float(scores[i])} for i in top_idx]
```

### File 5: `rag/llm.py` — Gọi Gemini API thật

```python
"""
Gọi LLM API thật — đây là "≥1 lời gọi AI chạy thật" bắt buộc.
Dùng Gemini free tier (~1500 req/ngày).
"""

import os
import google.generativeai as genai

def call_llm(question: str, selected_text: str, context_chunks: list[dict]) -> dict:
    """
    Gọi Gemini API với context từ retrieval.
    
    Returns: {answer, citations, confidence}
    """
    # Load API key từ env (KHÔNG hardcode)
    api_key = os.environ.get("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    
    # Load system prompt
    with open("prompts/system_prompt_v1.txt", "r", encoding="utf-8") as f:
        system_prompt = f.read()
    
    # Build context string từ retrieved chunks
    context_str = ""
    for chunk in context_chunks:
        context_str += f"\n[Đoạn {chunk['id']}]:\n{chunk['text']}\n"
    
    # Build user message
    user_message = f"""
Đoạn học viên bôi đen: "{selected_text}"

Câu hỏi: {question}

--- TÀI LIỆU THAM KHẢO ---
{context_str}
---
"""
    
    # Gọi API
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",  # hoặc gemini-1.5-flash
        system_instruction=system_prompt
    )
    
    response = model.generate_content(user_message)
    answer_text = response.text
    
    # Parse citations từ response (tìm [Txx-NNN] hoặc [trang N])
    import re
    citations = re.findall(r'\[(?:đoạn\s+)?(T\d{2}-\d{3})\]', answer_text)
    page_citations = re.findall(r'\[trang\s+(\d+)\]', answer_text)
    
    # Xác định confidence
    no_source_phrases = ["không tìm thấy", "không có trong tài liệu", "ngoài tài liệu"]
    confidence = "none" if any(p in answer_text.lower() for p in no_source_phrases) else "high"
    
    return {
        "answer": answer_text,
        "citations": citations,
        "page_citations": page_citations,
        "confidence": confidence,
        "chunks_used": [c["id"] for c in context_chunks],  # trace
    }
```

### File 6: `prompts/system_prompt_v1.txt`

```
Bạn là AI Tutor của khóa học "AI Thực Chiến". Nhiệm vụ duy nhất của bạn là giúp học viên hiểu nội dung bài giảng.

## QUY TẮC BẮT BUỘC

1. **LUÔN trích dẫn nguồn**: Mỗi thông tin bạn đưa ra PHẢI kèm mã đoạn [Txx-NNN] từ tài liệu tham khảo. Không có nguồn = không đưa ra.

2. **Không bịa**: Nếu tài liệu tham khảo KHÔNG chứa thông tin liên quan đến câu hỏi, trả lời CHÍNH XÁC: "Nội dung này không có trong tài liệu buổi học hiện tại. Bạn có thể hỏi giảng viên hoặc TA để được hỗ trợ thêm."

3. **Không đoán khi mơ hồ**: Nếu đoạn học viên bôi đen quá ngắn hoặc câu hỏi không rõ, hỏi lại MỘT câu cụ thể: "Bạn muốn tìm hiểu về [chủ đề X] hay [chủ đề Y] trong đoạn này?"

4. **Từ chối ngoài phạm vi**: Nếu học viên yêu cầu viết code, cho đáp án bài thi, hoặc nội dung không liên quan bài giảng, từ chối lịch sự: "Mình chỉ hỗ trợ về nội dung bài giảng thôi nhé. Bạn có câu hỏi nào về bài học không?"

5. **Đúng kiến thức domain**: Khi giải thích khái niệm AI/ML, phải chính xác về mặt kỹ thuật. Không giải thích sai concept (ví dụ: không nhầm precision với recall).

## FORMAT TRẢ LỜI

- Giải thích ngắn gọn, đúng trọng tâm câu hỏi
- Cuối mỗi ý, ghi nguồn: [đoạn Txx-NNN]
- Nếu có nhiều nguồn, liệt kê tất cả
- Giọng văn: thân thiện, như trợ giảng, không quá formal
```

### File 7: `app.py` — Backend chính

```python
"""
Backend FastAPI — endpoint chính: POST /api/ask
"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import json, os, time

from rag.retriever import SimpleRetriever
from rag.llm import call_llm

app = FastAPI()

# Load retriever 1 lần khi start
retriever = SimpleRetriever("data/chunks.json")

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return FileResponse("static/index.html")

# --- API Models ---
class AskRequest(BaseModel):
    question: str
    selected_text: str = ""

class AskResponse(BaseModel):
    answer: str
    citations: list[str]
    confidence: str
    chunks_used: list[str]
    latency_ms: int

# --- Main endpoint ---
@app.post("/api/ask")
async def ask_tutor(req: AskRequest) -> AskResponse:
    start = time.time()
    
    # 1. Retrieve relevant chunks
    chunks = retriever.search(
        query=req.question,
        selected_text=req.selected_text,
        top_k=5
    )
    
    # 2. Call LLM (AI THẬT)
    result = call_llm(
        question=req.question,
        selected_text=req.selected_text,
        context_chunks=chunks
    )
    
    latency = int((time.time() - start) * 1000)
    
    # 3. Log trace (lưu vào file để nộp trong repo)
    log_entry = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "question": req.question,
        "selected_text": req.selected_text[:100],
        "chunks_retrieved": [c["id"] for c in chunks],
        "answer_preview": result["answer"][:200],
        "citations": result["citations"],
        "confidence": result["confidence"],
        "latency_ms": latency,
    }
    with open("logs/trace.jsonl", "a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
    
    return AskResponse(
        answer=result["answer"],
        citations=result["citations"],
        confidence=result["confidence"],
        chunks_used=result.get("chunks_used", []),
        latency_ms=latency,
    )

# --- Endpoint load transcript (cho frontend) ---
@app.get("/api/transcript/{filename}")
async def get_transcript(filename: str):
    """Trả nội dung transcript để hiện trên frontend."""
    # Chỉ cho phép đọc file sạch, không đọc file khác
    allowed = ["transcript-01-clean.md", "transcript-04-clean.md"]
    if filename not in allowed:
        return {"error": "File không được phép"}
    
    filepath = f"../data/vlearn-pack/transcript/{filename}"
    if not os.path.exists(filepath):
        filepath = f"data/{filename}"  # fallback
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    return {"content": content, "filename": filename}
```

### File 8: `requirements.txt`

```
fastapi==0.115.0
uvicorn==0.30.0
google-generativeai==0.8.0
python-dotenv==1.0.0
pydantic==2.9.0
```

### File 9: `.env.example`

```
GEMINI_API_KEY=your_api_key_here
```

### File 10: `codebase/README.md`

```markdown
# Citation-First AI Tutor — Prototype

## Chạy local

1. Cài dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Tạo file `.env` từ `.env.example`, điền API key Gemini

3. Chuẩn bị knowledge base:
   ```bash
   python rag/loader.py
   ```

4. Chạy server:
   ```bash
   uvicorn app:app --reload --port 8000
   ```

5. Mở browser: http://localhost:8000

## Phần mock vs thật

| Phần | Trạng thái |
|---|---|
| UI mô phỏng VLearn | **Mock** — không pixel-perfect |
| Chọn transcript | **Mock** — load sẵn 2 transcript |
| Retrieval (tìm đoạn) | **Thật** — keyword search trên ~700 đoạn |
| LLM call | **Thật** — Gemini API |
| Citation trong output | **Thật** — parse từ LLM response |
| Nút 👍👎 | **Mock** — UI có nhưng chưa lưu data |
```

---

## Thứ tự build — ai làm gì

### CP2 (bấm được) — ~2 giờ

| Thứ tự | Task | Ai | File |
|---|---|---|---|
| 1 | Tạo repo + cấu trúc thư mục | Quang | Toàn bộ |
| 2 | Build `index.html` + `style.css` | Quang | `static/` |
| 3 | Viết `app.js` với mock response | Quang | `static/app.js` |
| 4 | Viết `system_prompt_v1.txt` | Kiên | `prompts/` |
| 5 | Chạy `loader.py` → `chunks.json` | Kiên | `rag/loader.py` |
| 6 | Test: bôi đen → gõ → bấm → ra kết quả mock | Quang | — |
| 7 | Commit + push | Quang | — |

### CP3 (AI thật) — ~3-4 giờ

| Thứ tự | Task | Ai | File |
|---|---|---|---|
| 1 | Viết `retriever.py` | Kiên | `rag/retriever.py` |
| 2 | Viết `llm.py` + test với Gemini API | Quang | `rag/llm.py` |
| 3 | Viết `app.py` (FastAPI endpoint) | Quang | `app.py` |
| 4 | Sửa `app.js`: fetch thật thay mock | Quang | `static/app.js` |
| 5 | Test end-to-end: bôi đen → hỏi → AI trả lời thật | Quang + Kiên | — |
| 6 | Chạy golden set lượt 1 qua prototype | Kiên | `eval/run_01.md` |
| 7 | Sửa prompt nếu cần → `system_prompt_v2.txt` | Kiên | `prompts/` |
| 8 | Chạy lại golden set lượt 2 | Kiên | `eval/run_02.md` |
| 9 | Commit + push (có log/trace) | Quang | — |

---

## Checklist kỹ thuật trước nộp

- [ ] `.env` trong `.gitignore` — KHÔNG commit API key
- [ ] Data pack gốc KHÔNG có trong repo — chỉ có `chunks.json` (derived)
- [ ] `README.md` có hướng dẫn chạy local
- [ ] `logs/trace.jsonl` có ≥1 trace thật
- [ ] Phần mock ghi rõ trong `codebase/README.md`
- [ ] Code chạy được khi TA clone + cài deps + thêm API key

---

## Flow demo 2 phút (slide 3)

```
=== CASE 1: Happy path ===
1. Mở http://localhost:8000
2. Thấy transcript Day 2 — tài liệu buổi học
3. Bôi đen đoạn: "4 chiến lược tối ưu prompt"
4. Gõ: "giải thích đoạn này"
5. AI trả lời:
   "Đoạn này trình bày 4 chiến lược tối ưu prompt:
    1. Write — chuyển state ra ngoài context [đoạn T01-023]
    2. Select — chỉ chọn thông tin liên quan (RAG) [đoạn T01-023]
    3. Compress — tóm tắt history [đoạn T01-023]
    4. Isolate — tách context cho sub-agent [đoạn T01-023]"
   ✅ Có citation rõ ràng

=== CASE 2: Chỗ khó (lớp ①) ===
1. Bôi đen đoạn bất kỳ
2. Gõ: "trang 99 nói gì về neural network?"
3. AI trả lời:
   "Nội dung về trang 99 và neural network không có
    trong tài liệu buổi học hiện tại. Bạn có thể hỏi
    giảng viên hoặc TA để được hỗ trợ thêm."
   ✅ Không bịa — nói rõ không có
```
