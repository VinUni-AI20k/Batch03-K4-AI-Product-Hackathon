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
    # Nếu đang dùng https://api.deepseek.com, model name chuẩn là deepseek-chat
    llm_model = os.getenv("LLM_MODEL", "deepseek-chat")
    if "deepseek.com" in os.getenv("LLM_BINDING_HOST", "").lower() and "flash" in llm_model.lower():
        llm_model = "deepseek-chat"
        
    return await openai_complete_if_cache(
        model=llm_model,
        prompt=prompt,
        system_prompt=system_prompt,
        history_messages=history_messages or [],
        base_url=os.getenv("LLM_BINDING_HOST", "https://api.deepseek.com"),
        api_key=os.getenv("LLM_BINDING_API_KEY", os.getenv("DEEPSEEK_API_KEY")),
        **kwargs
    )

import requests
import numpy as np

async def raw_embedding_func(texts: list[str]) -> np.ndarray:
    """SiliconFlow Provider: Qwen/Qwen3-Embedding-8B (4096 dimensions)."""
    api_key = os.getenv("SILICONFLOW_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("Vui lòng cấu hình SILICONFLOW_API_KEY trong tệp .env.")

    model = os.getenv("EMBEDDING_MODEL", "Qwen/Qwen3-Embedding-8B")
    base_url = os.getenv("SILICONFLOW_HOST", "https://api.siliconflow.com/v1").rstrip("/")
    
    url = f"{base_url}/embeddings" if not base_url.endswith("/embeddings") else base_url
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    all_embeddings = []
    batch_size = 10
    loop = asyncio.get_event_loop()

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        payload = {
            "model": model,
            "input": batch
        }

        def do_post(p):
            return requests.post(url, headers=headers, json=p, timeout=60)

        resp = await loop.run_in_executor(None, do_post, payload)
        if resp.status_code != 200:
            raise RuntimeError(f"SiliconFlow Embedding API Lỗi ({resp.status_code}): {resp.text}")

        res_json = resp.json()
        data = sorted(res_json.get("data", []), key=lambda x: x.get("index", 0))
        for item in data:
            all_embeddings.append(item["embedding"])

    return np.array(all_embeddings)


# ==============================================================================
# 3. HÀM KHỞI TẠO & TRUY VẤN RAG ENGINE
# ==============================================================================
async def get_rag_instance(storage_dir="./rag_storage"):
    embedding_dim = int(os.getenv("EMBEDDING_DIM", "4096"))
    
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
