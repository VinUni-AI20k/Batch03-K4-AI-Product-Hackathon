import os
os.environ["USE_TF"] = "0"
os.environ["USE_TORCH"] = "1"

import json
import re
import string
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from llm_caller import generate_answer

app = FastAPI(title="VLearn Tutor API - Dual Engine")

# --- 1. STARTUP: LOAD DATABASES ---
SLIDE_DB_PATH = "D:/vinai/qn1304/codebase/data/slide_db.json"
QDRANT_PATH = "D:/vinai/qn1304/codebase/data/qdrant_db"

slide_db = {}
if os.path.exists(SLIDE_DB_PATH):
    with open(SLIDE_DB_PATH, "r", encoding="utf-8") as f:
        slide_db = json.load(f)

# Load Qdrant Client & Embedding Model
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))
    
    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")

    if qdrant_url and qdrant_api_key:
        print("Connecting to Qdrant Cloud...")
        qdrant = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
    else:
        print("Connecting to Qdrant Local...")
        qdrant = QdrantClient(path=QDRANT_PATH)
        
    encoder = SentenceTransformer("all-MiniLM-L6-v2")
except Exception as e:
    print(f"Warning: Qdrant or Encoder not fully initialized: {e}")
    qdrant = None
    encoder = None

# --- 2. MODELS ---
class ChatRequest(BaseModel):
    message: str

# --- 3. HELPER: DETERMINISTIC LOOKUP ---
def normalize_text(text):
    if not text: return ""
    return re.sub(r'\s+', '', text).lower()

def exact_match_lookup(highlighted_text):
    norm_highlight = normalize_text(highlighted_text)
    for page_id, content in slide_db.items():
        if norm_highlight in normalize_text(content):
            return page_id, content
    return None, None

def find_best_slide_for_free_chat(query):
    if not slide_db: return "1" # Fallback
    
    # Tokenize query bỏ dấu câu và in thường
    query_tokens = set(re.findall(r'\w+', query.lower()))
    if not query_tokens: return "1"
    
    best_page = "1"
    max_score = -1
    
    for page_id, content in slide_db.items():
        # Trọng số nhẹ cho slide
        slide_tokens = set(re.findall(r'\w+', content.lower()))
        score = len(query_tokens.intersection(slide_tokens))
        
        if score > max_score:
            max_score = score
            best_page = page_id
            
    # Dù score = 0 vẫn trả về 1 page bất kỳ (thường là page đầu) hoặc trang có score cao nhất
    return best_page

# --- 4. API ENDPOINT ---
@app.post("/chat")
def chat(request: ChatRequest):
    user_message = request.message
    
    # BƯỚC 1: Parse Regex tìm Anchor
    # Pattern VLearn: (Trang 37, đoạn được chọn: "tóm tắt nội dung")
    match = re.search(r'\(Trang\s*(\d+),\s*đoạn được chọn:\s*"(.*?)"\)', user_message, re.IGNORECASE)
    
    if match:
        # ==========================================
        # NHÁNH A: ANCHORED (DETERMINISTIC LOOKUP)
        # ==========================================
        reported_page = match.group(1)
        highlighted_text = match.group(2)
        real_question = user_message[match.end():].strip()
        
        page_id, slide_context = exact_match_lookup(highlighted_text)
        
        if slide_context:
            prompt = f"Ngữ cảnh Slide: {slide_context}\nCâu hỏi: {real_question}\nBắt buộc trích dẫn bằng thẻ <citation>{page_id}</citation> ở cuối câu trả lời."
            mode = "anchored_success"
            enable_search = True
        else:
            prompt = f"Học viên hỏi: {real_question}. Đoạn bôi đen không tìm thấy trong DB hiện tại. Trả lời khéo léo yêu cầu làm rõ và tuyệt đối không tạo thẻ citation."
            mode = "anchored_not_found"
            slide_context = None
            enable_search = False
            
        # GỌI GEMINI AI VỚI TÍNH NĂNG GOOGLE SEARCH
        llm_response = generate_answer(prompt, enable_search=enable_search)
            
        response_dict = {
            "mode": mode,
            "detected_page": reported_page,
            "final_prompt_template": prompt
        }
        if isinstance(llm_response, dict):
            response_dict.update(llm_response)
        else:
            response_dict["llm_response"] = llm_response
            
        return response_dict
        
    else:
        # ==========================================
        # NHÁNH B: UNANCHORED (QDRANT RAG)
        # ==========================================
        if qdrant is None or encoder is None:
            return {"mode": "unanchored", "error": "Qdrant not initialized"}
            
        # Tìm kiếm Semantic bằng Qdrant (Tri thức lời giảng)
        try:
            response = qdrant.query_points(
                collection_name="transcripts",
                query=encoder.encode(user_message).tolist(),
                limit=3,
                with_payload=True
            )
            hits = response.points
        except Exception as e:
            print("Lỗi truy vấn Qdrant:", e)
            hits = []
        
        retrieved_texts = [hit.payload.get('text', '') for hit in hits] if hits else []
        combined_context = "\n".join(retrieved_texts)
        
        # Tìm kiếm Slide (Nguồn trích dẫn)
        best_slide_page = find_best_slide_for_free_chat(user_message)
        
        prompt = f"""Bạn là gia sư AI khóa học. Học viên hỏi: "{user_message}"
        
[NGỮ CẢNH TỪ LỜI GIẢNG] (Dùng để lấy kiến thức trả lời):
{combined_context}

[THÔNG TIN TRÍCH DẪN]
Slide liên quan nhất: Trang {best_slide_page}

Nhiệm vụ:
1. Trả lời câu hỏi trên dựa vào lời giảng.
2. Nếu ngữ cảnh lời giảng không có thông tin, bạn PHẢI SỬ DỤNG CÔNG CỤ TÌM KIẾM GOOGLE (Google Search) để lấy thông tin mới nhất và trả lời.
3. Nếu sử dụng thông tin từ lời giảng, BẮT BUỘC chèn trích dẫn bằng thẻ <citation>{best_slide_page}</citation> vào cuối câu trả lời. Nếu hoàn toàn dùng kiến thức độc lập (hoặc Google Search), TUYỆT ĐỐI KHÔNG tạo thẻ này."""
        
        # GỌI GEMINI AI VỚI TÍNH NĂNG GOOGLE SEARCH BẬT LÊN
        llm_response = generate_answer(prompt, enable_search=True)
        
        response_dict = {
            "mode": "unanchored_rag",
            "detected_page": best_slide_page,
            "final_prompt_template": prompt
        }
        if isinstance(llm_response, dict):
            response_dict.update(llm_response)
        else:
            response_dict["llm_response"] = llm_response
            
        return response_dict

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
