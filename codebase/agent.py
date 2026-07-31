"""
AIQAAgent – Agentic RAG with Multi-Tool Support
================================================
Tools (từ codebase/tools/):
  1.  search_knowledge_base  : Hybrid BM25 + Semantic search trong KB nội bộ
  2.  search_internet        : DuckDuckGo web search cho thông tin mới
  3.  calculate              : Máy tính toán học an toàn
  4.  get_current_time       : Trả về ngày giờ hiện tại (UTC+7)
  5.  summarize_doc          : Tóm tắt extractive tài liệu dài
  6.  translate              : Dịch Việt ↔ Anh
  7.  explain_concept        : Từ điển AI/ML/LLM nội bộ
  8.  check_deadline         : Tra cứu lịch/deadline Hackathon Batch 03
  9.  recommend_path         : Gợi ý lộ trình học AI/ML theo trình độ
  10. format_code            : Kiểm tra syntax + gợi ý sửa code Python
  11. get_kb_stats           : Thống kê tổng quan Knowledge Base

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

import warnings
warnings.filterwarnings("ignore", category=RuntimeWarning)
warnings.filterwarnings("ignore", category=UserWarning)
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

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
    try:
        from ddgs import DDGS
    except ImportError:
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
# Import tools package
# ---------------------------------------------------------------------------
try:
    from tools import ALL_SCHEMAS as TOOL_SCHEMAS, TOOL_REGISTRY
    print(f"[Tools] Loaded {len(TOOL_SCHEMAS)} tools từ tools/ package.")
except ImportError as _e:
    print(f"[Warning] Không load được tools/ package: {_e}. Dùng inline tools fallback.")
    TOOL_SCHEMAS = []
    TOOL_REGISTRY = {}


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
            # PDF chunks dùng 'source_url', handbook files dùng 'url' — thử cả hai
            url = doc.get("url", "") or doc.get("source_url", "") or ""
            source_name = doc.get("source_name", "")
            title = doc.get("title", "")
            # Thêm source_name vào search_text để tăng khả năng tìm kiếm theo tên tài liệu
            search_text = f"{title} {source_name} {doc.get('content', '')}"
            self.all_docs.append({
                "source_type": "handbook",
                "id": doc.get("id"),
                "title": title,
                "search_text": search_text,
                "content": doc.get("content", ""),
                "url": url,
                "source_name": source_name,
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
    # TOOLS dispatch — dùng TOOL_REGISTRY từ tools/ package
    # ------------------------------------------------------------------

    def _dispatch_tool(self, tool_name: str, tool_args: Dict) -> str:
        """Gọi tool từ TOOL_REGISTRY, inject dependencies cần thiết."""
        fn = TOOL_REGISTRY.get(tool_name)
        if fn is None:
            return json.dumps({"error": f"Tool '{tool_name}' không tồn tại."})

        kwargs = dict(tool_args)
        if tool_name == "search_knowledge_base":
            kwargs["kb_searcher"] = self._retrieve_relevant_docs
        elif tool_name == "get_kb_stats":
            kwargs["stats_provider"] = self.get_kb_stats

        try:
            return fn(**kwargs)
        except Exception as e:
            return json.dumps({"error": f"Tool '{tool_name}' lỗi: {str(e)}"}, ensure_ascii=False)

    # ------------------------------------------------------------------
    # Hybrid search (used by search_knowledge_base tool)
    # ------------------------------------------------------------------

    def _retrieve_relevant_docs(self, query: str, top_k: int = 15) -> List[Dict[str, Any]]:
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

        # Semantic 60% + BM25 40% for richer diversity
        hybrid_scores = 0.6 * semantic_scores + 0.4 * bm25_scores

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

            # Mở rộng ngưỡng liên quan: 0.12 thay vì 0.22, 0.20 thay vì 0.35 — để thu thập đa dạng tài liệu hơn
            is_relevant = (score >= 0.12 and (overlap > 0 or has_bm25)) or (score >= 0.20) or (overlap >= 1 and score >= 0.08)
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
        r"|ph[uơ]ng\s*tr[iì]nh\s*ho[aá]|(?:\s|^)h[oó]a\s*h[oọ]c|v[aậ]t\s*l[yý]\s*(l[oớ]p|h[aạ]t)|(?:\s|^)sinh\s*h[oọ]c|v[aă]n\s*h[oọ]c|b[aà]i\s*v[aă]n",
        re.IGNORECASE,
    )
    _IN_DOMAIN_KW = re.compile(
        r"ai|llm|rag|agent|prompt|vlearn|hackathon|vinuni|vingroup|spec|rubric|jtbd|hax|pair|vibe"
        r"|code|l[aậ]p\s*tr[iì]nh|python|pip|install|m[oô]i\s*tr[uườ]ng|l[oỗ]i|error|bug|fix|ch[aạ]y"
        r"|checkpoint|cp\d|deadline|h[aạ]n\s*n[oộ]p|b[aà]i\s*t[aậ]p|b[aà]i\s*1|b[aà]i\s*2|b[aà]i\s*3"
        r"|th[aầ]y|c[oô]|ta|mentor|gi[aả]ng\s*vi[eê]n|kh[oó]a\s*h[oọ]c|batch|l[oớ]p|ch[oỗ]\s*kh[oó]"
        r"|ch[aấ]m\s*đi[eể]m|evidence|b[aằ]ng\s*ch[uứ]ng|dataset|model|token|embedding|api|key"
        r"|t[aà]i\s*li[eệ]u|s[oổ]\s*tay|slide|b[aà]i\s*gi[aả]ng|ph[aâ]n\s*c[oô]ng|n[oộ]p\s*b[aà]i"
        r"|m[aá]y\s*t[ií]nh|c[aà]i\s*đ[aặ]t|th[uư]\s*vi[eệ]n|package|git|github|vscode|cursor|cline|selenium|scraper|scrape"
        r"|bao\s*l[aâ]u|th[oờ]i\s*gian|tuy[eể]n\s*sinh|l[oộ]\s*tr[iì]nh|h[oọ]c\s*ph[ií]|c[aă]ng\s*tin|c[oơ]\s*s[oở]|v[aậ]t\s*ch[aấ]t|g[uử]i\s*xe|wifi"
        r"|machine\s*learning|deep\s*learning|neural|transformer|gpt|claude|gemini|openai|anthropic"
        r"|vector|database|mongodb|fastapi|react|javascript|typescript|html|css|web|backend|frontend"
        r"|docker|cloud|deploy|server|localhost|port|api\s*key|environment|variable|import|library"
        r"|data|train|inference|fine.tun|parameter|weight|gradient|loss|accuracy|precision|recall"
        r"|career|job|interview|portfolio|project|skill|h[oọ]c|ki[eế]n\s*th[uứ]c|kinh\s*nghi[eệ]m"
        r"|h[oọ]c\s*b[oổ]ng|h[oọ]c\s*ph[ií]|mi[eễ]n\s*ph[ií]|chi\s*ph[ií]|ti[eề]n|ph[ií]\s*h[oọ]c"
        r"|đ[aă]ng\s*k[yý]|[uứ]ng\s*tuy[eể]n|ph[oỏ]ng\s*v[aấ]n|h[oồ]\s*s[oơ]"
        r"|ai\s*th[uự]c\s*chi[eế]n|cong\s*dong|c[oộ]ng\s*đ[oồ]ng|nh[oó]m|group|facebook\s*group"
        r"|gi[oờ]\s*h[oọ]c|l[iị]ch\s*h[oọ]c|th[oờ]i\s*kh[oó]a\s*bi[eể]u|bu[oổ]i|online|offline"
        r"|t[eự]\s*h[oọ]c|đ[aà]o\s*t[aạ]o|ch[uứ]ng\s*ch[iỉ]|b[aằ]ng|c[aấ]p|certificate"
        r"|notebook|jupyter|colab|kaggle|huggingface|langchain|llamaindex"
        r"|[tT]r[uườ]ng|[sS]inh\s*vi[eê]n|[hH][oọ]c\s*vi[eê]n|[vV]in[Uu]ni|[hH]a[nN][oO]i|[tT][pP]HCM",
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
        # Conversational → NOT out of domain
        if self._CONVERSATIONAL_KW.search(q_strip):
            return False
        # If query contains any in-domain keywords → NOT out of domain
        if self._IN_DOMAIN_KW.search(query):
            return False
        # Only block the most explicitly off-topic patterns
        if self._L3_OUT_OF_DOMAIN_EXPLICIT.search(query):
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
                    "Câu hỏi của bạn không thuộc phạm vi hỗ trợ của **AI Trợ lý Khóa học AI Thực Chiến (Vingroup - VinUni)**.\n\n"
                    "Mình chuyên trách tư vấn và giải đáp thuộc các lĩnh vực:\n"
                    "1. **Thông tin Tuyển sinh & Lộ trình 3 tháng:** Yêu cầu đầu vào, thời gian đào tạo, quyền lợi học viên & học bổng 100%...\n"
                    "2. **Cơ sở vật chất & Tiện ích cá nhân:** Địa điểm học tại VinUni / Tòa Vin, giờ mở cửa Căng tin, phòng tự học, wifi, gửi xe...\n"
                    "3. **Hỏi đáp Kỹ thuật & Chuyên môn:** Sửa lỗi Python, pip install, môi trường, tra cứu từ dữ liệu Facebook Group QA & VLearn (@codebase/data).\n\n"
                    "Vui lòng đặt câu hỏi liên quan đến chương trình khóa học để mình hỗ trợ chính xác nhất nhé!"
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
            # Không override message — AI vẫn cố gắng trả lời, chỉ gắn tag để tracking
            conf_mod = 0.85

        if self._L4_DOMAIN.search(query):
            triggered.append("layer4_domain")

        return triggered, override_msg, conf_mod

    # ------------------------------------------------------------------
    # Core: Agent Loop with Function Calling
    # ------------------------------------------------------------------

    SYSTEM_PROMPT = """Bạn là Trợ lý AI Thông minh của Khóa học AI Thực Chiến Vingroup - VinUni — một chuyên gia tư vấn am hiểu sâu về chương trình học, công nghệ AI/ML và hỗ trợ học viên toàn diện.

NHIỆM VỤ TRỌNG TÂM (CORE MISSION):
Bạn được trang bị toàn bộ kiến thức từ cơ sở dữ liệu MongoDB của chương trình (gồm bài đăng Facebook Group Q&A, bài giảng VLearn, sổ tay chương trình) để trả lời CHÍNH XÁC và ĐẦY ĐỦ nhất có thể mọi câu hỏi mà người dùng đặt ra.

ĐỐI TƯỢNG PHỤC VỤ:
1. **Ứng viên/Học sinh mới tìm hiểu chương trình**: Tuyển sinh, lộ trình 3 tháng, yêu cầu đầu vào, học bổng 100% Vingroup, chính sách hỗ trợ học viên.
2. **Học viên đang theo học**: Hướng dẫn kỹ thuật (Python, pip, môi trường, lỗi code, AI/LLM/RAG), thông tin sự kiện khóa học, cơ sở vật chất VinUni.
3. **Bất kỳ người dùng nào**: Giải đáp kiến thức AI/ML/LLM tổng quát, tư vấn học tập, chia sẻ kinh nghiệm và kiến thức về lĩnh vực AI thực chiến.

CHIẾN LƯỢC TRẢ LỜI (RESPONSE STRATEGY):
1. **Ưu tiên tra cứu KB MongoDB**: Với mọi câu hỏi, LUÔN gọi tool `search_knowledge_base` trước để kiểm tra dữ liệu nội bộ. Nếu có dữ liệu phù hợp → trích dẫn chính xác, kèm link nguồn.
2. **Mở rộng sáng tạo khi KB không đủ**: Nếu KB không có đủ thông tin, hãy dùng kiến thức chuyên môn về AI/ML/LLM/Python để trả lời một cách sáng tạo, chính xác và hữu ích. KHÔNG từ chối chỉ vì không có trong KB.
3. **Tìm kiếm internet khi cần**: Với câu hỏi cần thông tin mới nhất (lỗi thư viện, tin tức AI mới...) hãy gọi tool `search_internet`.

PHẠM VI HỖ TRỢ RỘNG (BROAD SUPPORT SCOPE):
✅ Thông tin tuyển sinh, học bổng, lộ trình, cơ sở vật chất VinUni
✅ Kỹ thuật AI/ML/LLM/RAG/Agent, Python, pip, lỗi code, môi trường
✅ Giải thích khái niệm AI, tư vấn định hướng học tập, career path AI
✅ Thông tin sự kiện khóa học, deadline, checkpoint từ Facebook Group
✅ Câu hỏi chung về lập trình, công nghệ liên quan đến AI
✅ Giao tiếp thông thường, chào hỏi, cảm ơn

GIỚI HẠN (BOUNDARIES):
❌ Nội dung chính trị, lãnh thổ, lịch sử quốc gia nhạy cảm
❌ Viết hộ toàn bộ bài nộp/checkpoint (nhưng được hướng dẫn cách làm)
❌ Thông tin giải trí hoàn toàn không liên quan (showbiz, thể thao, giá vàng...)

VĂN PHONG: Thân thiện, nhiệt huyết, chuyên nghiệp. Dùng Markdown rõ ràng. Ưu tiên tiếng Việt, dùng tiếng Anh cho thuật ngữ kỹ thuật."""

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
                temperature=0.8,
                max_tokens=3000,
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
        """Fallback: dùng RAG + Gemini/Anthropic hoặc local match. Lấy top_k=8 từ toàn bộ MongoDB KB."""
        retrieved = self._retrieve_relevant_docs(query, top_k=8)
        answer = guardrail_prefix + "\n\n---\n\n" if guardrail_prefix else ""

        if self.client and self.llm_provider in ("gemini", "anthropic"):
            context_blocks = []
            for i, doc in enumerate(retrieved, 1):
                context_blocks.append(
                    f"[{i}] {doc.get('title', '')}\n"
                    f"Nguồn: {doc.get('source_type', '')} | URL: {doc.get('url', '')}\n"
                    f"Nội dung: {doc.get('content', '')[:2000]}"
                )
            context = "\n\n".join(context_blocks) if context_blocks else "Không tìm thấy nguồn liên quan trong KB nội bộ."
            prompt = (
                self.SYSTEM_PROMPT + "\n\n"
                f"=== DỮ LIỆU TỪ KNOWLEDGE BASE MONGODB ({len(retrieved)} tài liệu liên quan) ===\n"
                f"{context}\n\n"
                f"=== CÂU HỎI CỦA NGƯỜI DÙNG ===\n"
                f"{query}\n\n"
                f"Hãy trả lời đầy đủ, chính xác và hữu ích nhất có thể dựa trên dữ liệu KB trên "
                f"và kiến thức chuyên môn của bạn về AI/ML/lập trình. "
                f"Nếu KB có dữ liệu liên quan hãy trích dẫn rõ nguồn. "
                f"Nếu KB không đủ, hãy dùng kiến thức chuyên môn để bổ sung."
            )
            try:
                if self.llm_provider == "gemini":
                    resp = self.client.generate_content(prompt)
                    answer += (getattr(resp, "text", "") or "").strip()
                elif self.llm_provider == "anthropic":
                    import anthropic
                    resp = self.client.messages.create(
                        model=self.model_name,
                        max_tokens=2048,
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

    def _build_smart_citations(self, retrieved_docs: List[Dict]) -> List[Dict]:
        """Chỉ trả về citations có giá trị thực sự: có URL hợp lệ và score cao, tối đa 5 cái."""
        smart = []
        for d in retrieved_docs:
            url = str(d.get("url", "") or "").strip()
            score = d.get("score", 0)
            # Chỉ đưa vào citations nếu: có URL thực sự và score đủ cao
            if url and score >= 0.20:
                smart.append({
                    "title": d.get("title", ""),
                    "url": url,
                    "snippet": d.get("content", "")[:180] + ("..." if len(d.get("content", "")) > 180 else ""),
                    "type": d.get("source_type", ""),
                    "score": round(score, 3),
                })
        # Sắp xếp theo score giảm dần, tối đa 5 citations
        smart.sort(key=lambda x: x.get("score", 0), reverse=True)
        return smart[:5]

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def ask(self, query: str) -> Dict[str, Any]:
        # 0. Phát hiện câu hỏi giao tiếp đơn giản (chào hỏi, cảm ơn...) → KHÔNG gửi citations
        is_conversational = bool(self._CONVERSATIONAL_KW.search(query.strip()))

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
                "tool_calls": [],
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
                "tool_calls": [],
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

        # 3. Chỉ gửi citations khi câu hỏi cần thông tin thực sự, không gửi cho câu giao tiếp
        if is_conversational:
            retrieved_docs = []
            citations = []
        else:
            retrieved_docs = self._retrieve_relevant_docs(query, top_k=15)
            citations = self._build_smart_citations(retrieved_docs)

        base_conf = 0.96 if self.client and retrieved_docs else 0.90 if retrieved_docs else 0.70
        if is_conversational:
            base_conf = 1.0
        final_conf = round(base_conf * conf_mod, 2)

        return {
            "question": query,
            "answer": answer_text,
            "guardrails_triggered": triggered_layers,
            "confidence_score": final_conf,
            "citations": citations,
            "retrieved_docs": retrieved_docs,
            "tool_calls": tool_citations,
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
