import os
import re
import requests
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

try:
    from google import genai
    from google.genai import types
except Exception:  # pragma: no cover - optional dependency
    genai = None
    types = None

# Cấu hình API Key (Lấy từ biến môi trường để bảo mật)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

try:
    if GEMINI_API_KEY and genai is not None and types is not None:
        client = genai.Client(api_key=GEMINI_API_KEY)
    else:
        client = None
except Exception as e:
    client = None
    print(f"Lỗi khởi tạo Gemini Client: {e}")

HIGH_QUALITY = [
    "openai.com", "anthropic.com", "huggingface.co", "developers.google.com",
    "python.org", "wikipedia.org", "arxiv.org", "stanford.edu", "ibm.com",
    "microsoft.com", "github.com", "deepmind.com", "mit.edu", "harvard.edu"
]

def load_system_prompt():
    prompt_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'prompts', 'system_prompt.txt')
    try:
        with open(prompt_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Bạn là gia sư AI. (Không tìm thấy file System Prompt gốc)."

def parse_llm_response(text: str) -> dict:
    answer = ""
    follow_up = []
    citations = []

    # 1. Parse <answer>
    ans_match = re.search(r'<answer>(.*?)</answer>', text, re.DOTALL)
    if ans_match:
        answer_full = ans_match.group(1).strip()
        # Find citations in answer
        cit_matches = re.findall(r'<citation>(.*?)</citation>', answer_full)
        citations.extend(cit_matches)
        answer = answer_full
    else:
        # Fallback if LLM didn't format properly
        answer = text

    # 2. Parse <follow_up>
    fu_match = re.search(r'<follow_up>(.*?)</follow_up>', text, re.DOTALL)
    if fu_match:
        fu_text = fu_match.group(1).strip()
        # Extract list items
        items = re.findall(r'-\s*(.*)', fu_text)
        follow_up = items

    return {
        "answer": answer,
        "follow_up": follow_up,
        "citations": list(set(citations))
    }

def determine_resource_type(domain: str, url: str) -> str:
    domain_lower = domain.lower()
    url_lower = url.lower()
    if "arxiv.org" in domain_lower or "research" in domain_lower: return "Paper"
    if "docs." in url_lower or "developer" in domain_lower or "learn.microsoft" in url_lower: return "Docs"
    if "wikipedia.org" in domain_lower: return "Wiki"
    if ".edu" in domain_lower: return "Academic"
    if "blog." in url_lower or "medium.com" in domain_lower or "towardsdatascience" in domain_lower: return "Blog"
    if "github.com" in domain_lower: return "Code"
    return "Article"

def resolve_grounding_url(redirect_url: str) -> dict:
    # Dùng requests để resolve URL gốc từ redirect URL của Google Grounding
    try:
        r = requests.head(redirect_url, allow_redirects=True, timeout=3)
        canonical_url = r.url
        domain = urlparse(canonical_url).netloc
        
        # Thử get HTML nhanh để lấy thẻ <title> và snippet
        title = domain
        snippet = ""
        try:
            r_get = requests.get(canonical_url, timeout=(1, 2.5))
            text = r_get.text
            
            title_match = re.search(r'<title.*?>(.*?)</title>', text, re.IGNORECASE | re.DOTALL)
            if title_match:
                title = title_match.group(1).strip()
                title = title.replace('\n', '').replace('\r', '')
                title = re.sub(r'\s+', ' ', title)
                if len(title) > 60:
                    title = title[:57] + "..."
            
            desc_match = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']', text, re.IGNORECASE)
            if not desc_match:
                desc_match = re.search(r'<meta[^>]*content=["\'](.*?)["\'][^>]*name=["\']description["\']', text, re.IGNORECASE)
            if desc_match:
                snippet = desc_match.group(1).strip()
                if len(snippet) > 120:
                    snippet = snippet[:117] + "..."
        except:
            pass # Fallback to domain if get fails
            
        return {
            "title": title,
            "domain": domain,
            "url": canonical_url,
            "snippet": snippet,
            "type": determine_resource_type(domain, canonical_url)
        }
    except Exception:
        # Nếu fail, fallback
        domain = urlparse(redirect_url).netloc
        return {
            "title": "Đọc thêm",
            "domain": domain,
            "url": redirect_url,
            "snippet": "",
            "type": "Article"
        }

def generate_answer(user_prompt: str, enable_search: bool = False) -> dict:
    """
    Hàm gọi API Gemini, parse output và resolve URL trả về dict JSON
    """
    if not client:
        return {
            "answer": "The AI helper is currently unavailable. Please add a valid GEMINI_API_KEY or install the required packages to enable live responses.",
            "follow_up": [],
            "citations": [],
            "external_links": []
        }
        
    system_prompt = load_system_prompt()
    
    # Kết hợp system prompt và yêu cầu của người dùng
    full_prompt = f"{system_prompt}\n\n--- YÊU CẦU CỦA NGƯỜI DÙNG ---\n{user_prompt}"
    
    config_kwargs = {
        "temperature": 0.3
    }
    
    if enable_search:
        config_kwargs["tools"] = [{"google_search": {}}]
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=full_prompt,
            config=types.GenerateContentConfig(**config_kwargs)
        )
        
        # Parse XML từ text output
        parsed_res = parse_llm_response(response.text)
        parsed_res["external_links"] = []
        
        # Bóc tách metadata lấy URL gốc
        if enable_search and response.candidates and response.candidates[0].grounding_metadata:
            metadata = response.candidates[0].grounding_metadata
            try:
                chunks = getattr(metadata, 'grounding_chunks', [])
                chunk_data = []
                for chunk in chunks:
                    web = getattr(chunk, 'web', None)
                    if web and getattr(web, 'uri', None):
                        chunk_data.append({
                            "uri": web.uri,
                            "domain_hint": getattr(web, 'title', '').lower()
                        })
                
                # Loại bỏ URL trùng lặp (giữ lại thứ tự)
                seen = set()
                unique_chunks = []
                for c in chunk_data:
                    if c["uri"] not in seen:
                        seen.add(c["uri"])
                        unique_chunks.append(c)
                
                # Hàm tính điểm ưu tiên (Càng nhỏ càng ưu tiên)
                def score_chunk(c):
                    for idx, hq in enumerate(HIGH_QUALITY):
                        if hq in c['domain_hint']:
                            return -len(HIGH_QUALITY) + idx
                    return 0
                    
                unique_chunks.sort(key=score_chunk)
                
                # Resolve canonical URLs (Tối đa 3 links)
                for c in unique_chunks[:3]:
                    resolved = resolve_grounding_url(c["uri"])
                    parsed_res["external_links"].append(resolved)
            except Exception as e:
                print(f"Error parsing metadata: {e}")
                
        return parsed_res
    except Exception as e:
        return {"error": f"Lỗi trong quá trình gọi LLM: {str(e)}"}

# --- Test nhanh ---
if __name__ == "__main__":
    if not GEMINI_API_KEY:
        print("Vui lòng tạo file .env trong thư mục codebase và thêm GEMINI_API_KEY=xxx")
    else:
        test_prompt = "Hãy giải thích ngắn gọn Prompt Injection là gì."
        import json
        res = generate_answer(test_prompt, enable_search=True)
        print(json.dumps(res, indent=2, ensure_ascii=False))
