import sys
import os
from pathlib import Path
from typing import Optional, Dict, Any, List

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from api.llm_client import LLMClient
from tools.rag_engine import PageAwareRAGEngine
from config.settings import DEFAULT_OPENAI_MODEL, BASE_DIR
from prompts import (
    SLIDE_AGENT_SYSTEM_PROMPT,
    RAG_PAGE_SUMMARY_PROMPT,
    RAG_GROUNDED_QA_PROMPT
)

class PageAwareRAGAgent:
    def __init__(
        self,
        provider: str = "openai",
        model_name: Optional[str] = DEFAULT_OPENAI_MODEL,
        temperature: float = 0.1
    ):
        self.llm_client = LLMClient(provider=provider, model_name=model_name, temperature=temperature)
        self.rag_engine = PageAwareRAGEngine()
        self.system_prompt = SLIDE_AGENT_SYSTEM_PROMPT
        
        transcript_dir = BASE_DIR / "data" / "vlearn-pack" / "transcript"
        if transcript_dir.exists():
            self.rag_engine.index_transcripts(str(transcript_dir))

    def load_slide(self, slide_path: str):
        self.rag_engine.index_slide_file(slide_path)

    def summarize_page(self, slide_path: str, page_number: int) -> str:
        self.load_slide(slide_path)
        page_info = self.rag_engine.get_page_context(page_number)

        if not page_info["has_content"]:
            return f"⚠️ **[Slide {page_number}]** Trang này không chứa nội dung chữ (slide trống hoặc là hình ảnh sơ đồ đồ họa). Bạn có câu hỏi cụ thể nào về hình ảnh này không?"

        prompt = RAG_PAGE_SUMMARY_PROMPT.format(
            slide_number=page_number,
            context_str=page_info["context_str"]
        )

        response = self.llm_client.generate(
            prompt=prompt,
            system_instruction=self.system_prompt
        )
        return response

    def ask_question(self, slide_path: str, query: str, page_number: Optional[int] = None) -> str:
        self.load_slide(slide_path)

        if page_number is not None:
            page_info = self.rag_engine.get_page_context(page_number)
            context_str = page_info["context_str"]
        else:
            docs = self.rag_engine.search_relevant(query, top_k=4)
            if not docs:
                context_str = "Không tìm thấy đoạn thông tin trùng khớp trong tài liệu."
            else:
                blocks = []
                for d in docs:
                    if d["type"] == "slide":
                        blocks.append(f"[Slide {d['slide_number']}]\n{d['content']}")
                    else:
                        blocks.append(f"[{d['chunk_id']}]\n{d['content']}")
                context_str = "\n\n".join(blocks)

        prompt = RAG_GROUNDED_QA_PROMPT.format(
            query=query,
            context_str=context_str
        )

        response = self.llm_client.generate(
            prompt=prompt,
            system_instruction=self.system_prompt
        )
        return response
