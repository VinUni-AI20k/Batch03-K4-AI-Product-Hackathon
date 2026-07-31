"""
AIQAAgent – Agentic RAG with Multi-Tool Support
================================================
Tools:
  - search_knowledge_base  : Hybrid BM25 + Semantic search trong KB nội bộ
  - search_internet         : DuckDuckGo web search cho thông tin mới
  - calculate               : Máy tính toán học an toàn
  - get_current_time        : Trả về ngày giờ hiện tại
  - get_kb_stats            : Thống kê tổng quan Knowledge Base

Provider:
  - OpenAI  (Function Calling / Tool Use) → ưu tiên
  - Gemini  (generate_content prompt-only fallback)
  - Anthropic (messages fallback)
  - local   (BM25+Semantic fallback nếu không có API)
"""

import json
import math
import os
import re
import sys
from datetime import datetime

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass
from typing import Any, Dict, List, Tuple

import numpy as np
from dotenv import load_dotenv

try:
    from sentence_transformers import SentenceTransformer, util as st_util
except ImportError:
    SentenceTransformer = None
    st_util = None

try:
    from rank_bm25 import BM25Okapi
except ImportError:
    BM25Okapi = None

try:
    from duckduckgo_search import DDGS
except ImportError:
    DDGS = None

try:
    from pymongo import MongoClient
except ImportError:
    MongoClient = None

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

load_dotenv(os.path.join(PROJECT_ROOT, ".env"))
load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)


# ---------------------------------------------------------------------------
# TOOL DEFINITIONS (OpenAI Function Calling schema)
# ---------------------------------------------------------------------------

TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "search_knowledge_base",
            "description": (
                "Tìm kiếm thông tin trong Knowledge Base nội bộ, bao gồm: "
                "các bài đăng Facebook Group AI Thực Chiến đã được TA xác nhận, "
                "sổ tay chương trình, rubric, guide, spec, deadline, và tài liệu VLearn. "
                "Dùng tool này cho mọi câu hỏi liên quan đến khoá học, bài tập, lỗi kỹ thuật, deadline."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Câu truy vấn để tìm trong KB, viết ngắn gọn và đúng trọng tâm."
                    },
                    "top_k": {
                        "type": "integer",
                        "description": "Số tài liệu muốn lấy (mặc định 5).",
                        "default": 5
                    }
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_internet",
            "description": (
                "Tìm kiếm thông tin trên Internet qua DuckDuckGo. "
                "Dùng khi câu hỏi không thuộc phạm vi khoá học, "
                "cần thông tin cập nhật, hoặc KB nội bộ không đủ. "
                "Ví dụ: lỗi thư viện mới, tài liệu kỹ thuật, tin tức AI."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Truy vấn tìm kiếm bằng tiếng Anh hoặc tiếng Việt."
                    },
                    "max_results": {
                        "type": "integer",
                        "description": "Số kết quả tối đa (mặc định 4).",
                        "default": 4
                    }
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": (
                "Thực hiện phép tính toán học an toàn. "
                "Hỗ trợ: +, -, *, /, **, sqrt, sin, cos, tan, log, ceil, floor, round, abs, pi, e. "
                "Ví dụ: '2 ** 10', 'math.sqrt(144)', '(3 + 4) * 2'."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "Biểu thức toán học cần tính, viết theo cú pháp Python."
                    }
                },
                "required": ["expression"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_current_time",
            "description": "Trả về ngày giờ hiện tại theo múi giờ Việt Nam (UTC+7). Dùng khi hỏi về thời gian.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
]


class AIQAAgent:
    """
    AI Agent QA cho khóa AI Thực Chiến Vingroup – VinUni (Batch 03).
    Tích hợp Agentic RAG với Multi-Tool: KB search, Internet search, Calculator, Clock.
    """

    def __init__(self, kb_fb_path: str = None, kb_vlearn_path: str = None):
        mongo_uri = os.getenv("MONGO_URI", "")
        mongo_db_name = os.getenv("MONGO_DB_NAME", "ai_hackathon_kb")
        self.use_mongo = False

        if MongoClient and mongo_uri:
            try:
                client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
                client.admin.command('ping')
                db = client[mongo_db_name]
                self.fb_kb = list(db["fb_posts"].find({}, {"_id": 0}))
                self.vlearn_kb = list(db["vlearn"].find({}, {"_id": 0}))
                self.handbook_kb = list(db["handbooks"].find({}, {"_id": 0}))
                if self.fb_kb or self.vlearn_kb or self.handbook_kb:
                    self.use_mongo = True
                    print(f"[MongoDB] Successfully loaded KB from database '{mongo_db_name}' ({len(self.fb_kb)} FB, {len(self.vlearn_kb)} VLearn, {len(self.handbook_kb)} Handbooks)")
            except Exception as e:
                print(f"[Warning] Could not load from MongoDB ({e}). Falling back to local files.")

        if not self.use_mongo:
            kb_fb_path = kb_fb_path or os.getenv("FB_KB_PATH", "data/fb_group_qa.json")
            kb_vlearn_path = kb_vlearn_path or os.getenv("VLEARN_KB_PATH", "data/vlearn_kb.json")
            self.fb_kb = self._load_kb(kb_fb_path)
            self.vlearn_kb = self._load_kb(kb_vlearn_path)
            self.handbook_kb = self._load_handbook_kb()

        # Loại bỏ tuyệt đối các file transcript (-clean.md) và chatlog (.csv) khỏi handbook_kb
        # để tránh gây nhiễu citation (bấm vào ra toàn bộ text âm thanh thô không đáp án)
        self.handbook_kb = [
            d for d in self.handbook_kb
            if not any(
                ignored in str(d.get("id", "")).lower()
                or ignored in str(d.get("title", "")).lower()
                or ignored in str(d.get("url", "")).lower()
                for ignored in ["transcript", "chatlog", "-clean.md", ".csv"]
            )
        ]

        self.all_docs: List[Dict] = []
        self._prepare_docs()

        self.use_llm = os.getenv("USE_LLM", "true").strip().lower() in {"1", "true", "yes", "on"}
        self.client = None
        self.llm_provider = "none"
        self.model_name = "local-rag-fallback"

        self.encoder = None
        self.doc_embeddings = None
        self.bm25 = None

        self._init_hybrid_search()

        if self.use_llm:
            self._init_llm()

    # ------------------------------------------------------------------
    # Data preparation
    # ------------------------------------------------------------------

    def _prepare_docs(self):
        for doc in self.fb_kb:
            q_text = doc.get("question", "")
            answer = doc.get("verified_answer", {})
            a_text = answer.get("content", "")
            other = " ".join(doc.get("other_comments", []))
            combined = f"{q_text} {a_text} {other}"

            rich_content = a_text
            other_list = doc.get("other_comments", [])
            if other_list:
                rich_content += "\n\n**Bình luận từ cộng đồng:**\n" + "\n".join(
                    f"- {c}" for c in other_list[:3]
                )

            self.all_docs.append({
                "source_type": "fb_group",
                "id": doc.get("id"),
                "title": f"FB Post #{doc.get('post_id', '')} - {answer.get('author_name', 'Cộng đồng AI Thực Chiến')}",
                "search_text": combined,
                "content": rich_content,
                "url": answer.get("source_url", ""),
                "likes": answer.get("likes", 0),
                "original_doc": doc
            })

        for doc in self.vlearn_kb:
            title = f"VLearn {doc.get('source_id', '')} - {doc.get('title', '')}"
            content = doc.get("content", "")
            self.all_docs.append({
                "source_type": "vlearn",
                "id": doc.get("id"),
                "title": title,
                "search_text": f"{title} {content}",
                "content": content,
                "url": doc.get("source_url", ""),
                "original_doc": doc
            })

        for doc in self.handbook_kb:
            self.all_docs.append({
                "source_type": "handbook",
                "id": doc.get("id"),
                "title": doc.get("title", ""),
                "search_text": f"{doc.get('title', '')} {doc.get('content', '')}",
                "content": doc.get("content", ""),
                "url": doc.get("url", ""),
                "original_doc": doc
            })

    # ------------------------------------------------------------------
    # Search engine init
    # ------------------------------------------------------------------

    def _init_hybrid_search(self):
        if SentenceTransformer:
            print("[Search] Khoi tao mo hinh Semantic Embedding...")
            try:
                self.encoder = SentenceTransformer(
                    'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2'
                )
                corpus_texts = [d["search_text"] for d in self.all_docs]
                if corpus_texts:
                    self.doc_embeddings = self.encoder.encode(corpus_texts, convert_to_tensor=True)
                print("[Search] Semantic Embedding san sang.")
            except Exception as e:
                print(f"[Warning] Loi khoi tao SentenceTransformer: {e}")

        if BM25Okapi:
            print("[Search] Khoi tao he thong BM25...")
            tokenized = [self._tokenize_bm25(d["search_text"]) for d in self.all_docs]
            if tokenized:
                self.bm25 = BM25Okapi(tokenized)
            print("[Search] BM25 san sang.")

    def _tokenize_bm25(self, text: str) -> List[str]:
        return re.findall(r"\w+", text.lower())

    # ------------------------------------------------------------------
    # LLM init
    # ------------------------------------------------------------------

    def _init_llm(self):
        # Priority 1: OpenAI (Function Calling support)
        openai_key = os.getenv("OPENAI_API_KEY", "").strip()
        if openai_key:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=openai_key)
                self.llm_provider = "openai"
                self.model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip()
                print(f"[LLM] Using OpenAI (Function Calling): {self.model_name}")
                return
            except Exception as e:
                print(f"[Warning] OpenAI init failed: {e}")

        # Priority 2: Anthropic Claude
        anthropic_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
        if anthropic_key:
            try:
                import anthropic
                self.client = anthropic.Anthropic(api_key=anthropic_key)
                self.llm_provider = "anthropic"
                self.model_name = os.getenv("ANTHROPIC_MODEL", "claude-haiku-4-5-20251001").strip()
                print(f"[LLM] Using Anthropic Claude: {self.model_name}")
                return
            except Exception as e:
                print(f"[Warning] Anthropic init failed: {e}")

        # Priority 3: Gemini
        gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
        if gemini_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=gemini_key)
                self.model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash").strip()
                self.client = genai.GenerativeModel(self.model_name)
                self.llm_provider = "gemini"
                print(f"[LLM] Using Gemini: {self.model_name}")
                return
            except Exception as e:
                print(f"[Warning] Gemini init failed: {e}")

        print("[LLM] No LLM API key found. Using local RAG fallback.")

    # ------------------------------------------------------------------
    # Path resolution
    # ------------------------------------------------------------------

    def _resolve_path(self, path: str) -> str:
        if os.path.isabs(path):
            return path
        for base in [BASE_DIR, PROJECT_ROOT, os.getcwd()]:
            candidate = os.path.join(base, path)
            if os.path.exists(candidate):
                return candidate
        return os.path.join(BASE_DIR, path)

    def _load_kb(self, rel_path: str) -> List[Dict[str, Any]]:
        try:
            with open(self._resolve_path(rel_path), "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[Warning] Cannot load KB {rel_path}: {e}")
            return []

    def _load_handbook_kb(self) -> List[Dict[str, Any]]:
        default_paths = [
            "tham-khao",
        ]
        configured = os.getenv("PROGRAM_HANDBOOK_PATHS", "")
        paths = [p.strip() for p in configured.split(";") if p.strip()] or default_paths

        docs = []
        for source_path in paths:
            full_path = self._resolve_path(source_path)
            if os.path.isdir(full_path):
                for root, _, files in os.walk(full_path):
                    for filename in files:
                        if filename.lower().endswith((".md", ".txt")):
                            if any(ignored in filename.lower() or ignored in root.lower() for ignored in ["transcript", "chatlog", "-clean.md", ".csv"]):
                                continue
                            docs.extend(self._read_text_chunks(os.path.join(root, filename)))
            elif os.path.isfile(full_path):
                docs.extend(self._read_text_chunks(full_path))
        return docs

    def _read_text_chunks(self, full_path: str, chunk_size: int = 1600) -> List[Dict[str, Any]]:
        try:
            with open(full_path, "r", encoding="utf-8") as f:
                text = f.read()
        except Exception as e:
            print(f"[Warning] Cannot read {full_path}: {e}")
            return []

        text = re.sub(r"\n{3,}", "\n\n", text).strip()
        if not text:
            return []

        rel_path = os.path.relpath(full_path, PROJECT_ROOT).replace("\\", "/")
        chunks = []
        for idx in range(0, len(text), chunk_size):
            chunk = text[idx: idx + chunk_size].strip()
            if not chunk:
                continue
            chunks.append({
                "source_type": "handbook",
                "id": f"handbook_{rel_path}_{idx // chunk_size + 1}",
                "title": f"Sổ tay chương trình - {rel_path}",
                "content": chunk,
                "url": f"/api/docs/{rel_path}",
            })
        return chunks

    # ------------------------------------------------------------------
    # TOOLS implementation
    # ------------------------------------------------------------------

    def tool_search_knowledge_base(self, query: str, top_k: int = 5) -> str:
        """Tìm kiếm trong KB nội bộ, trả về JSON string."""
        results = self._retrieve_relevant_docs(query, top_k=top_k)
        if not results:
            return json.dumps({"found": 0, "results": [], "message": "Không tìm thấy tài liệu liên quan trong KB."}, ensure_ascii=False)
        
        output = []
        for i, doc in enumerate(results, 1):
            output.append({
                "rank": i,
                "title": doc.get("title", ""),
                "source_type": doc.get("source_type", ""),
                "url": doc.get("url", ""),
                "score": round(doc.get("score", 0), 3),
                "content": doc.get("content", "")[:1500]
            })
        return json.dumps({"found": len(output), "results": output}, ensure_ascii=False, indent=2)

    def tool_search_internet(self, query: str, max_results: int = 4) -> str:
        """Tìm kiếm DuckDuckGo, trả về JSON string."""
        if not DDGS:
            return json.dumps({"error": "duckduckgo-search chưa được cài. Chạy: pip install duckduckgo-search"}, ensure_ascii=False)
        try:
            results = []
            with DDGS() as ddgs:
                for r in ddgs.text(query, max_results=max_results):
                    results.append({
                        "title": r.get("title", ""),
                        "url": r.get("href", ""),
                        "snippet": r.get("body", "")[:400]
                    })
            if not results:
                return json.dumps({"found": 0, "results": [], "message": "Không tìm thấy kết quả."}, ensure_ascii=False)
            return json.dumps({"found": len(results), "results": results}, ensure_ascii=False, indent=2)
        except Exception as e:
            return json.dumps({"error": f"Lỗi tìm kiếm: {str(e)}"}, ensure_ascii=False)

    def tool_calculate(self, expression: str) -> str:
        """Tính biểu thức toán học an toàn."""
        allowed_names = {
            k: v for k, v in math.__dict__.items() if not k.startswith("_")
        }
        allowed_names.update({"abs": abs, "round": round, "int": int, "float": float})
        try:
            # Bảo mật: chỉ cho phép ký tự số và toán học
            safe_expr = re.sub(r"[^0-9+\-*/().,%\s\w]", "", expression)
            result = eval(safe_expr, {"__builtins__": {}}, allowed_names)  # noqa: S307
            return json.dumps({"expression": expression, "result": result}, ensure_ascii=False)
        except Exception as e:
            return json.dumps({"expression": expression, "error": str(e)}, ensure_ascii=False)

    def tool_get_current_time(self) -> str:
        """Trả về thời gian hiện tại UTC+7."""
        from datetime import timezone, timedelta
        tz_vn = timezone(timedelta(hours=7))
        now = datetime.now(tz_vn)
        return json.dumps({
            "datetime": now.strftime("%Y-%m-%d %H:%M:%S"),
            "date": now.strftime("%d/%m/%Y"),
            "time": now.strftime("%H:%M:%S"),
            "weekday": ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"][now.weekday()],
            "timezone": "Asia/Ho_Chi_Minh (UTC+7)"
        }, ensure_ascii=False)

    def _dispatch_tool(self, tool_name: str, tool_args: Dict) -> str:
        """Gọi đúng tool dựa trên tên."""
        if tool_name == "search_knowledge_base":
            return self.tool_search_knowledge_base(
                query=tool_args.get("query", ""),
                top_k=int(tool_args.get("top_k", 5))
            )
        elif tool_name == "search_internet":
            return self.tool_search_internet(
                query=tool_args.get("query", ""),
                max_results=int(tool_args.get("max_results", 4))
            )
        elif tool_name == "calculate":
            return self.tool_calculate(expression=tool_args.get("expression", ""))
        elif tool_name == "get_current_time":
            return self.tool_get_current_time()
        else:
            return json.dumps({"error": f"Tool '{tool_name}' không tồn tại."})

    # ------------------------------------------------------------------
    # Hybrid search (used by search_knowledge_base tool)
    # ------------------------------------------------------------------

    def _retrieve_relevant_docs(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        if not self.all_docs:
            return []

        bm25_scores = np.zeros(len(self.all_docs))
        semantic_scores = np.zeros(len(self.all_docs))

        if self.bm25:
            tokenized_query = self._tokenize_bm25(query)
            raw_bm25 = self.bm25.get_scores(tokenized_query)
            if np.max(raw_bm25) > 0:
                bm25_scores = raw_bm25 / np.max(raw_bm25)

        if self.encoder and self.doc_embeddings is not None:
            query_embedding = self.encoder.encode(query, convert_to_tensor=True)
            cos_scores = st_util.cos_sim(query_embedding, self.doc_embeddings)[0].cpu().numpy()
            semantic_scores = np.clip(cos_scores, 0, 1)

        hybrid_scores = 0.7 * semantic_scores + 0.3 * bm25_scores

        # Tag bonus & keyword relevance boost
        query_words = set(re.findall(r"\w+", query.lower()))
        for i, doc in enumerate(self.all_docs):
            tags = doc.get("original_doc", {}).get("tags", []) if isinstance(doc.get("original_doc"), dict) else []
            if any(tag.lower() in query.lower() for tag in tags):
                hybrid_scores[i] += 0.15
            title_words = set(re.findall(r"\w+", doc.get("title", "").lower()))
            overlap = len(query_words.intersection(title_words))
            if overlap > 0:
                hybrid_scores[i] += min(0.2, overlap * 0.05)

        if self._is_out_of_domain(query):
            return []

        STOPWORDS = {
            "là", "và", "của", "cho", "em", "hỏi", "mình", "có", "không", "thế", "nào", "gì", "ai",
            "được", "trong", "với", "các", "những", "này", "khi", "tại", "sao", "thì", "mà", "hay",
            "hoặc", "ở", "từ", "làm", "về", "cái", "để", "ra", "bị", "đang", "đã", "vào", "nhiều",
            "ít", "rất", "quá", "vậy", "ạ", "nhé", "luôn", "chỉ", "cần", "một", "hai", "ba"
        }
        query_words = {w for w in re.findall(r"\w+", query.lower()) if len(w) > 1 and w not in STOPWORDS}

        top_indices = np.argsort(hybrid_scores)[::-1][:top_k]
        results = []
        for idx in top_indices:
            score = float(hybrid_scores[idx])
            doc = self.all_docs[idx]
            doc_text = f"{doc.get('title', '')} {doc.get('content', '')}".lower()
            tags = doc.get("original_doc", {}).get("tags", []) if isinstance(doc.get("original_doc"), dict) else []
            doc_words = set(re.findall(r"\w+", doc_text))
            for tag in tags:
                doc_words.update(re.findall(r"\w+", str(tag).lower()))
            overlap = len(query_words.intersection(doc_words))
            has_bm25 = (self.bm25 is not None and bm25_scores[idx] > 0)

            # Lọc tài liệu thực sự liên quan: tránh đính kèm tài liệu không liên quan cho câu hỏi của người dùng
            is_relevant = (score >= 0.22 and (overlap > 0 or has_bm25)) or (score >= 0.35) or (overlap >= 2 and score >= 0.15)
            if is_relevant:
                doc_copy = doc.copy()
                doc_copy["score"] = score
                doc_copy.pop("search_text", None)
                doc_copy.pop("original_doc", None)
                results.append(doc_copy)

        return results

    # ------------------------------------------------------------------
    # Guardrails
    # ------------------------------------------------------------------

    _L1_BATCH_OLD = re.compile(
        r"batch\s*0?[12]|kh[oó]a\s*[12]|n[aă]m\s*ngo[aá]i|batch\s*c[uũ]|l[oớ]p\s*tr[uướ]c",
        re.IGNORECASE,
    )
    _L1_DEADLINE = re.compile(
        r"deadline|h[aạ]n\s*n[oộ]p|l[iị]ch|ng[aà]y|m[oố]c|gi[oờ]",
        re.IGNORECASE,
    )
    _L3_CHEAT = re.compile(
        r"vi[eế]t\s*h[oộ]|gi[aả]i\s*h[oộ]|l[aà]m\s*h[oộ]|code\s*full|full\s*code"
        r"|cho\s*(em|m[iì]nh)\s*(xin\s*)?code|vi[eế]t\s*giúp|code\s*(cho|h[oộ])\s*(em|m[iì]nh)"
        r"|gi[aả]i\s*b[aà]i\s*h[oộ]|l[aà]m\s*b[aà]i\s*h[oộ]|checkpoint\s*\d.*h[oộ]"
        r"|vi[eế]t\s*cv|l[aà]m\s*cv|so[aạ]n\s*cv|t[aạ]o\s*cv"
        r"|vi[eế]t\s*(th[uư]|email|b[aá]o\s*c[aá]o|lu[aậ]n\s*v[aă]n)\s*h[oộ]"
        r"|ngo[aà]i\s*(ph[aạ]m\s*vi|kh[oó]a\s*h[oọ]c)",
        re.IGNORECASE,
    )
    _L3_OUT_OF_DOMAIN_EXPLICIT = re.compile(
        r"qu[aầ]n\s*đ[aả]o|ho[aà]ng\s*sa|tr[uườ]ng\s*sa|bi[eể]n\s*đ[oô]ng|l[aã]nh\s*th[oổ]|ch[uủ]\s*quy[eề]n"
        r"|th[uủ]\s*đ[oô]|qu[oố]c\s*gia|t[oổ]ng\s*th[oố]ng|ch[uủ]\s*t[iị]ch|th[uủ]\s*t[uướ]ng|chi[eế]n\s*tranh"
        r"|l[iị]ch\s*s[uử]\s*(vi[eệ]t|th[eế]|n[uướ]c)|lu[aậ]t\s*đ[aấ]t\s*đai|hi[eế]n\s*ph[aá]p|qu[oố]c\s*h[oộ]i"
        r"|b[oó]ng\s*đ[aá]|world\s*cup|aff\s*cup|ngo[aạ]i\s*h[aạ]ng|c[aầ]u\s*th[uủ]|ca\s*s[iĩ]|ngh[eệ]\s*s[iĩ]"
        r"|di[eễ]n\s*vi[eê]n|phim|b[aà]i\s*h[aá]t|ch[uơ]ng\s*tr[iì]nh\s*truy[eề]n\s*h[iì]nh|tr[aấ]n\s*th[aà]nh|s[oơ]n\s*t[uù]ng"
        r"|c[aá]ch\s*n[aấ]u|m[oó]n\s*[aă]n|c[oô]ng\s*th[uứ]c\s*n[aấ]u|qu[aá]n\s*[aă]n|du\s*l[iị]ch|đ[iị]a\s*đi[eể]m"
        r"|gi[aá]\s*v[aà]ng|b[aấ]t\s*đ[oộ]ng\s*s[aả]n|c[oổ]\s*phi[eế]u|ch[uứ]ng\s*kho[aá]n|x[oổ]\s*s[oố]|t[uử]\s*vi"
        r"|cung\s*ho[aà]ng\s*đ[aạ]o|th[oờ]i\s*ti[eế]t"
        r"|ph[uơ]ng\s*tr[iì]nh\s*ho[aá]|h[oó]a\s*h[oọ]c|v[aậ]t\s*l[yý]\s*(l[oớ]p|h[aạ]t)|sinh\s*h[oọ]c|v[aă]n\s*h[oọ]c|b[aà]i\s*v[aă]n",
        re.IGNORECASE,
    )
    _IN_DOMAIN_KW = re.compile(
        r"ai|llm|rag|agent|prompt|vlearn|hackathon|vinuni|vingroup|spec|rubric|jtbd|hax|pair|vibe"
        r"|code|l[aậ]p\s*tr[iì]nh|python|pip|install|m[oô]i\s*tr[uườ]ng|l[oỗ]i|error|bug|fix|ch[aạ]y"
        r"|checkpoint|cp\d|deadline|h[aạ]n\s*n[oộ]p|b[aà]i\s*t[aậ]p|b[aà]i\s*1|b[aà]i\s*2|b[aà]i\s*3"
        r"|th[aầ]y|c[oô]|ta|mentor|gi[aả]ng\s*vi[eê]n|kh[oó]a\s*h[oọ]c|batch|l[oớ]p|ch[oỗ]\s*kh[oó]"
        r"|ch[aấ]m\s*đi[eể]m|evidence|b[aằ]ng\s*ch[uứ]ng|dataset|model|token|embedding|api|key"
        r"|t[aà]i\s*li[eệ]u|s[oổ]\s*tay|slide|b[aà]i\s*gi[aả]ng|ph[aâ]n\s*c[oô]ng|n[oộ]p\s*b[aà]i"
        r"|m[aá]y\s*t[ií]nh|c[aà]i\s*đ[aặ]t|th[uư]\s*vi[eệ]n|package|git|github|vscode|cursor|cline|selenium|scraper|scrape",
        re.IGNORECASE,
    )
    _CONVERSATIONAL_KW = re.compile(
        r"^(xin\s*ch[aà]o|ch[aà]o|hello|hi|hey|b[aạ]n\s*l[aà]\s*ai|ai\s*đ[oó]|c[aả]m\s*[oơ]n|thank|ok|t[oố]t|t[aạ]m\s*bi[eệ]t|gi[uú]p\s*(em|m[iì]nh|t[oô]i)|c[oó]\s*ai\s*kh[oô]ng)[\s\W]*$",
        re.IGNORECASE,
    )
    _L2_AMBIGUOUS_KW = re.compile(
        r"^(l[oỗ]i\s*pip|l[oỗ]i\s*c[aà]i|b[aà]i\s*\d\s*l[aà]m\s*sao|sao\s*kh[oô]ng\s*ch[aạ]y"
        r"|fix\s*th[eế]\s*n[aà]o|error\s*code|kh[oô]ng\s*ch[aạ]y)[\s\W]*$",
        re.IGNORECASE,
    )
    _L4_DOMAIN = re.compile(
        r"jtbd|spec|rubric|hax|pair|vlearn|vibe.coding|l[aá]t\s*c[aắ]t"
        r"|cost\s*of\s*error|sketch|working\s*proto|4\s*l[oớ]p|ch[oỗ]\s*kh[oó]"
        r"|taxonomy|guardrail|checkpoint\s*\d|cp\d"
        r"|evidence|b[aằ]ng\s*ch[uứ]ng|kh[aả]o\s*s[aá]t|mining|golden\s*set"
        r"|quality\s*bar|automation|willing\s*user|canvas|impact"
        r"|non.goal|prototype|ph[aâ]n\s*c[oô]ng|l[uư][oờ]t\s*ch[aạ]y"
        r"|deadline|h[aạ]n\s*n[oộ]p|c[aâ]u\s*h[oỏ]i\s*ki[eể]m\s*th[uử]",
        re.IGNORECASE,
    )

    def _get_max_kb_similarity(self, query: str) -> float:
        if not self.all_docs:
            return 0.0
        max_score = 0.0
        if self.encoder and self.doc_embeddings is not None:
            query_embedding = self.encoder.encode(query, convert_to_tensor=True)
            cos_scores = st_util.cos_sim(query_embedding, self.doc_embeddings)[0].cpu().numpy()
            max_score = float(np.max(cos_scores)) if len(cos_scores) > 0 else 0.0
        return max_score

    def _is_out_of_domain(self, query: str) -> bool:
        q_strip = query.strip()
        if self._CONVERSATIONAL_KW.search(q_strip):
            return False
        if self._L3_OUT_OF_DOMAIN_EXPLICIT.search(query):
            return True
        if not self._IN_DOMAIN_KW.search(query):
            if self._get_max_kb_similarity(query) < 0.25:
                return True
        return False

    def _check_guardrails(self, query: str) -> Tuple[List[str], str, float]:
        triggered, override_msg, conf_mod = [], "", 1.0

        if self._L1_BATCH_OLD.search(query) and self._L1_DEADLINE.search(query):
            triggered.append("layer1_ground_truth")
            override_msg = (
                "⚠️ **Cảnh báo Nguồn sự thật (Ground Truth):** Bạn đang hỏi thông tin "
                "deadline/lịch trình của batch cũ.\n\n"
                "**Lịch chính thức Mini Hackathon AI Batch 03:**\n"
                "- 17:30 Ngày 1 → CP4 (Chốt tiến độ trên lớp)\n"
                "- 23:59 Ngày 1 → Hard Deadline nộp `spec.md` hoàn chỉnh lên repo\n"
                "- 10:00–15:00 Ngày 2 → CP6 demo & chấm điểm\n\n"
                "Vui lòng chỉ dùng lịch Batch 03 này, không tham chiếu Batch 01/02."
            )
            return triggered, override_msg, 0.98

        if self._L3_CHEAT.search(query) or self._is_out_of_domain(query):
            triggered.append("layer3_authority")
            if self._is_out_of_domain(query) and not self._L3_CHEAT.search(query):
                override_msg = (
                    "🚫 **Từ chối trả lời (Ngoài phạm vi chuyên môn / Out of Domain):**\n\n"
                    "Câu hỏi của bạn không thuộc phạm vi hỗ trợ của khóa học **AI Thực Chiến Vingroup - VinUni**.\n\n"
                    "Mình là Trợ lý AI QA chuyên trách chỉ hỗ trợ giải đáp thuộc lĩnh vực:\n"
                    "1. **Quy chế & Lịch trình khóa học:** Spec, Rubric, Checkpoints (CP1-CP6), Deadline, Vibe-coding rule...\n"
                    "2. **Kiến thức AI & Lập trình:** Python, pip, môi trường, lỗi code, LLM, RAG, Agent, HAX, PAIR, JTBD...\n"
                    "3. **Tra cứu cơ sở tri thức:** Các bài đăng hỏi-đáp đã được Giảng viên/TA xác nhận trên FB Group & VLearn.\n\n"
                    "Vui lòng đặt câu hỏi liên quan đến nội dung khóa học hoặc bài tập Hackathon để mình hỗ trợ chính xác nhất nhé!"
                )
            else:
                override_msg = (
                    "🚫 **Từ chối theo Academic Integrity (Vibe-coding rule):** "
                    "AI Agent không viết trọn gói code bài nộp/checkpoint.\n\n"
                    "Mình có thể giúp bạn:\n"
                    "1. **Tách nhỏ bài toán** — chia bài thành các bước nhỏ độc lập\n"
                    "2. **Giải thích kiến trúc** — mô tả luồng dữ liệu, các module cần có\n"
                    "3. **Debug lỗi cụ thể** — paste stacktrace để mình phân tích\n"
                    "4. **Gợi ý hướng tiếp cận** — pseudocode hoặc outline logic\n\n"
                    "Theo luật Vibe-coding: bạn dùng AI để build thoải mái, nhưng phải "
                    "giải thích được từng phần có tên mình tại CP5."
                )
            return triggered, override_msg, 1.0

        if self._L2_AMBIGUOUS_KW.search(query):
            triggered.append("layer2_ambiguity")
            override_msg = (
                "🔍 **Cần làm rõ thêm:** Câu hỏi đang thiếu ngữ cảnh để mình tra cứu chính xác.\n\n"
                "Hãy bổ sung:\n"
                "- **Hệ điều hành:** Windows / macOS / Linux (và phiên bản)\n"
                "- **Phiên bản Python:** `python --version`\n"
                "- **Lệnh đã chạy:** lệnh đầy đủ bạn đã gõ\n"
                "- **Thông báo lỗi:** copy toàn bộ stacktrace/error message\n"
                "- **Thư mục đang làm việc:** đường dẫn hiện tại\n\n"
                "Với thông tin trên mình sẽ tìm đúng đáp án TA đã giải trong Group!"
            )
            conf_mod = 0.85

        if self._L4_DOMAIN.search(query):
            triggered.append("layer4_domain")

        return triggered, override_msg, conf_mod

    # ------------------------------------------------------------------
    # Core: Agent Loop with Function Calling
    # ------------------------------------------------------------------

    SYSTEM_PROMPT = """Bạn là AI Agent QA thông minh cho khóa học AI Thực Chiến Vingroup - VinUni (Batch 03).

Nguyên tắc BẮT BUỘC (Guardrails & Phạm vi chuyên môn):
1. CHỈ trả lời các câu hỏi trong phạm vi:
   - Nội dung, quy chế, spec, rubric, lịch trình khóa học AI Thực Chiến Vingroup - VinUni.
   - Kỹ thuật, lập trình Python, lỗi code, công nghệ AI, LLM, RAG, Agent, Vibe-coding.
2. TUYỆT ĐỐI TỪ CHỐI trả lời mọi vấn đề NGOÀI LĨNH VỰC / NGOÀI PHẠM VI (ví dụ: địa lý, chính trị, lịch sử, tin tức giải trí, thể thao, nấu ăn, các chủ đề không liên quan đến khóa học và công nghệ AI/lập trình). Khi từ chối, giải thích rõ phạm vi hỗ trợ và KHÔNG được gửi/kèm bất kỳ tài liệu hay link tra cứu nào.
3. Với câu giao tiếp thông thường (chào hỏi, cảm ơn, hỏi thăm): trả lời tự nhiên, thân thiện như người bạn, KHÔNG cần tra tài liệu và KHÔNG gửi link tài liệu.
4. Với câu hỏi thuộc chuyên môn/khóa học: BẮT BUỘC dùng tool `search_knowledge_base` trước tiên. Chỉ khi tài liệu thực sự liên quan đến câu hỏi mới gửi kèm Danh sách Tài liệu & Link gốc liên quan ở cuối câu trả lời dưới định dạng Markdown link rõ ràng (ví dụ: `[📖 Sổ tay chương trình: spec.md](/api/docs/spec.md)`). TUYỆT ĐỐI KHÔNG gửi tài liệu hoặc link không liên quan đến câu hỏi mà người dùng hỏi.
5. Nếu KB không đủ thông tin về chủ đề thuộc phạm vi khóa học/kỹ thuật: có thể dùng `search_internet` để tìm thêm.
6. Với yêu cầu tính toán: dùng `calculate`.
7. Với câu hỏi về thời gian: dùng `get_current_time`.
8. Luôn trả lời bằng tiếng Việt, đúng trọng tâm và trình bày đẹp mắt.
9. Không viết hộ toàn bộ code bài nộp/checkpoint; chỉ hướng dẫn tư duy và debug."""

    def _agent_loop_openai(self, query: str, guardrail_prefix: str) -> Tuple[str, List[Dict]]:
        """Vòng lặp Agent OpenAI Function Calling. Trả về (answer, tool_citations)."""
        messages = [
            {"role": "system", "content": self.SYSTEM_PROMPT},
            {"role": "user", "content": query}
        ]

        all_tool_results: List[Dict] = []
        max_iterations = 5  # An toàn: tránh vòng lặp vô hạn

        for _ in range(max_iterations):
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                tools=TOOL_SCHEMAS,
                tool_choice="auto",
                max_tokens=1500,
            )

            msg = response.choices[0].message

            # Nếu LLM muốn gọi tool
            if msg.tool_calls:
                messages.append(msg)  # append assistant message with tool_calls

                for tool_call in msg.tool_calls:
                    tool_name = tool_call.function.name
                    try:
                        tool_args = json.loads(tool_call.function.arguments)
                    except json.JSONDecodeError:
                        tool_args = {}

                    print(f"[Tool] Calling: {tool_name}({tool_args})")
                    tool_result = self._dispatch_tool(tool_name, tool_args)
                    all_tool_results.append({
                        "tool": tool_name,
                        "args": tool_args,
                        "result_preview": tool_result[:200]
                    })

                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": tool_result
                    })
            else:
                # Không còn tool nào → đây là câu trả lời cuối
                final_text = (msg.content or "").strip()
                if guardrail_prefix:
                    final_text = guardrail_prefix + "\n\n---\n\n" + final_text
                return final_text, all_tool_results

        return "Đã xử lý nhưng không tạo được câu trả lời cuối. Vui lòng thử lại.", all_tool_results

    def _fallback_answer(self, query: str, guardrail_prefix: str) -> Tuple[str, List[Dict]]:
        """Fallback: dùng RAG + Gemini/Anthropic hoặc local match."""
        retrieved = self._retrieve_relevant_docs(query, top_k=5)
        answer = guardrail_prefix + "\n\n---\n\n" if guardrail_prefix else ""

        if self.client and self.llm_provider in ("gemini", "anthropic"):
            context_blocks = []
            for i, doc in enumerate(retrieved, 1):
                context_blocks.append(
                    f"[{i}] {doc.get('title', '')}\n"
                    f"URL: {doc.get('url', '')}\n"
                    f"Nội dung: {doc.get('content', '')[:1500]}"
                )
            context = "\n\n".join(context_blocks) or "Không tìm thấy nguồn liên quan."
            prompt = (
                self.SYSTEM_PROMPT + "\n\n"
                f"Context từ Knowledge Base:\n{context}\n\n"
                f"Câu hỏi: {query}"
            )
            try:
                if self.llm_provider == "gemini":
                    resp = self.client.generate_content(prompt)
                    answer += (getattr(resp, "text", "") or "").strip()
                elif self.llm_provider == "anthropic":
                    import anthropic
                    resp = self.client.messages.create(
                        model=self.model_name,
                        max_tokens=1024,
                        messages=[{"role": "user", "content": prompt}],
                    )
                    answer += resp.content[0].text.strip()
                return answer, self._build_tool_citations_from_docs(retrieved)
            except Exception as e:
                print(f"[Warning] Fallback LLM failed: {e}")

        # Pure local fallback
        answer += self._local_answer(retrieved, query)
        return answer, self._build_tool_citations_from_docs(retrieved)

    def _local_answer(self, retrieved_docs: List[Dict], query: str = "") -> str:
        if not retrieved_docs:
            return (
                "**Trợ lý AI Thực Chiến Vingroup - VinUni:**\n\n"
                "Hiện tại mình chưa tìm thấy tài liệu phù hợp trong kho dữ liệu (Facebook Group KB, Sổ tay chương trình & VLearn). "
                "Bạn hãy hỏi rõ hơn thông ngữ cảnh (ví dụ: đang làm phần nào trong spec.md, gặp lỗi gì lúc chạy code, hoặc cần tìm quy chế checkpoint nào) để mình dẫn đúng tài liệu nhé!"
            )

        answer_parts = []
        answer_parts.append("### 🎯 Giải đáp & Hướng dẫn từ cơ sở tri thức khóa học:\n")

        # 1. Main answer synthesis from top 1-2 docs
        top_docs = retrieved_docs[:2]
        for i, doc in enumerate(top_docs, 1):
            st = doc.get("source_type", "")
            title = doc.get("title", "")
            content = doc.get("content", "").strip()
            
            if st == "fb_group":
                badge = "💬 **Giải đáp từ FB Group (Đã được Mentor/TA xác nhận):**"
            elif st == "handbook":
                badge = f"📖 **Quy chế & Hướng dẫn từ Sổ tay chương trình (`{title}`):**"
            else:
                badge = f"🎓 **Kiến thức khóa học VLearn (`{title}`):**"

            answer_parts.append(f"{badge}\n\n{content}\n")

        # 2. Supplementary insights if more documents retrieved
        if len(retrieved_docs) > 2:
            answer_parts.append("\n### 📌 Thông tin tham khảo & mở rộng:\n")
            for doc in retrieved_docs[2:5]:
                title = doc.get("title", "Tài liệu tham khảo")
                snippet = doc.get("content", "").strip()
                if len(snippet) > 220:
                    snippet = snippet[:220] + "..."
                answer_parts.append(f"- **{title}**: {snippet}")

        # 3. Dedicated Document & Link Access Section
        answer_parts.append("\n---\n### 📑 Tài liệu & Link truy cập chuẩn xác cho bạn:\n")
        seen_links = set()
        for doc in retrieved_docs:
            url = str(doc.get("url", "") or "").strip()
            title = doc.get("title", "Tài liệu")
            st = doc.get("source_type", "")
            if not url or url in seen_links:
                continue
            seen_links.add(url)
            
            # Format clean descriptive clickable markdown links
            if st == "handbook" or url.startswith("/api/docs/"):
                answer_parts.append(f"- [📖 Mở và đọc chi tiết Sổ tay chương trình: **{title}**]({url})")
            elif st == "fb_group" or "facebook.com" in url:
                answer_parts.append(f"- [💬 Xem bài đăng & các bình luận gốc trên **FB Group**]({url})")
            elif st == "vlearn":
                answer_parts.append(f"- [🎓 Truy cập bài giảng VLearn: **{title}**]({url})")
            else:
                answer_parts.append(f"- [🔗 Xem tài liệu: **{title}**]({url})")

        return "\n".join(answer_parts)

    def _build_tool_citations_from_docs(self, docs: List[Dict]) -> List[Dict]:
        return [{
            "title": d.get("title", ""),
            "url": d.get("url", ""),
            "snippet": d.get("content", "")[:180] + ("..." if len(d.get("content", "")) > 180 else ""),
            "type": d.get("source_type", ""),
        } for d in docs]

    def _build_citations(self, retrieved_docs: List[Dict]) -> List[Dict]:
        return self._build_tool_citations_from_docs(retrieved_docs)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def ask(self, query: str) -> Dict[str, Any]:
        # 1. Guardrails check
        triggered_layers, override_msg, conf_mod = self._check_guardrails(query)

        # Hard block guardrails → trả về ngay không qua LLM
        if "layer3_authority" in triggered_layers:
            return {
                "question": query,
                "answer": override_msg,
                "guardrails_triggered": triggered_layers,
                "confidence_score": conf_mod,
                "citations": [],
                "retrieved_docs": [],
            }

        if "layer1_ground_truth" in triggered_layers:
            retrieved = self._retrieve_relevant_docs(query, top_k=2)
            if retrieved:
                override_msg += "\n\n---\n### 📑 Tài liệu & Link truy cập gốc liên quan:\n"
                for d in retrieved:
                    url = str(d.get("url", "") or "").strip()
                    title = d.get("title", "Tài liệu")
                    st = d.get("source_type", "")
                    if url:
                        if st == "handbook" or url.startswith("/api/docs/"):
                            override_msg += f"- [📖 Mở Sổ tay chương trình: **{title}**]({url})\n"
                        elif st == "fb_group" or "facebook.com" in url:
                            override_msg += f"- [💬 Xem trên FB Group ({title})]({url})\n"
                        else:
                            override_msg += f"- [🔗 Xem chi tiết: **{title}**]({url})\n"
            return {
                "question": query,
                "answer": override_msg,
                "guardrails_triggered": triggered_layers,
                "confidence_score": conf_mod,
                "citations": self._build_citations(retrieved),
                "retrieved_docs": retrieved,
            }

        # 2. Run agent loop
        guardrail_prefix = override_msg  # Có thể rỗng
        tool_citations = []

        try:
            if self.llm_provider == "openai" and self.client:
                answer_text, tool_citations = self._agent_loop_openai(query, guardrail_prefix)
            else:
                answer_text, tool_citations = self._fallback_answer(query, guardrail_prefix)
        except Exception as e:
            print(f"[Error] Agent loop failed: {e}")
            answer_text, tool_citations = self._fallback_answer(query, guardrail_prefix)

        # 3. Build citations from KB docs (for sidebar display)
        retrieved_docs = self._retrieve_relevant_docs(query, top_k=5)
        citations = self._build_citations(retrieved_docs)

        base_conf = 0.96 if self.client and retrieved_docs else 0.90 if retrieved_docs else 0.40
        final_conf = round(base_conf * conf_mod, 2)

        return {
            "question": query,
            "answer": answer_text,
            "guardrails_triggered": triggered_layers,
            "confidence_score": final_conf,
            "citations": citations,
            "retrieved_docs": retrieved_docs,
        }

    def get_kb_stats(self) -> Dict[str, Any]:
        categories: Dict[str, int] = {}
        total_likes = 0
        for doc in self.fb_kb:
            cat = doc.get("category", "general")
            categories[cat] = categories.get(cat, 0) + 1
            total_likes += doc.get("verified_answer", {}).get("likes", 0)

        return {
            "fb_posts_scraped": len(self.fb_kb),
            "vlearn_snippets": len(self.vlearn_kb),
            "handbook_snippets": len(self.handbook_kb),
            "total_verified_answers": len(self.fb_kb),
            "total_community_likes": total_likes,
            "categories": categories,
            "source_tool": "fb/facebook_post_comment_scraper (Hybrid BM25 + Semantic + Tool Calling)",
            "llm_enabled": self.client is not None,
            "llm_provider": self.llm_provider,
            "model": self.model_name,
            "tools_available": [t["function"]["name"] for t in TOOL_SCHEMAS],
        }
