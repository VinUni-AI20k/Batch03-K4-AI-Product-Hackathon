import os
import sys
import asyncio
from dotenv import load_dotenv

# Ensure parent directory (quiz-app) is in sys.path for lightrag module
APP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if APP_DIR not in sys.path:
    sys.path.insert(0, APP_DIR)

load_dotenv(os.path.join(APP_DIR, ".env"))

from lightrag import LightRAG, QueryParam
from lightrag.utils import EmbeddingFunc
import lightrag.prompt as prompt_module
from lightrag.llm.openai import openai_complete_if_cache
from lightrag.llm.gemini import gemini_embed

# ==============================================================================
# 1. TÙY CHỈNH SYSTEM PROMPT (Dành cho sản phẩm Quiz Hackathon)
# ==============================================================================
prompt_module.PROMPTS["entity_extraction"] = """---Task---
Trích xuất các khái niệm, định nghĩa, phương pháp luận và kiến thức chính từ bài giảng để phục vụ tạo câu hỏi Quiz ứng dụng bài tập tình huống cho học viên.
"""

# ==============================================================================
# 2. WRAPPER LLM & EMBEDDING
# ==============================================================================
async def llm_complete(prompt, system_prompt=None, history_messages=None, **kwargs) -> str:
    return await openai_complete_if_cache(
        model=os.getenv("LLM_MODEL", "deepseek-v4-flash"),
        prompt=prompt,
        system_prompt=system_prompt,
        history_messages=history_messages or [],
        base_url=os.getenv("LLM_BINDING_HOST", "https://api.deepseek.com"),
        api_key=os.getenv("LLM_BINDING_API_KEY", os.getenv("DEEPSEEK_API_KEY")),
        **kwargs
    )

async def raw_embedding_func(texts: list[str]) -> list[list[float]]:
    return await gemini_embed(
        texts=texts,
        model=os.getenv("EMBEDDING_MODEL", "gemini-embedding-2"),
        api_key=os.getenv("GEMINI_API_KEY", os.getenv("EMBEDDING_BINDING_API_KEY")),
        embedding_dim=int(os.getenv("EMBEDDING_DIM", "3072"))
    )

# ==============================================================================
# 3. HÀM KHỞI TẠO & TRUY VẤN RAG ENGINE
# ==============================================================================
async def get_rag_instance(storage_dir="./rag_storage"):
    embedding_dim = int(os.getenv("EMBEDDING_DIM", "3072"))
    
    rag = LightRAG(
        working_dir=storage_dir,
        llm_model_func=llm_complete,
        embedding_func=EmbeddingFunc(
            embedding_dim=embedding_dim,
            max_token_size=8192,
            func=raw_embedding_func
        )
    )
    # BẮT BUỘC: Initialize storages
    await rag.initialize_storages()
    return rag

if __name__ == "__main__":
    print("[INFO] services/rag_engine.py is configured and ready!")
