import sys
import math
import re
from pathlib import Path
from typing import List, Dict, Any, Optional

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from tools.slide_parser import SlideParser
from tools.transcript_parser import TranscriptParser

class PageAwareRAGEngine:
    """
    RAG Engine cơ bản với 2 chế độ:
    1. Metadata Filtering theo số trang (Page-Aware Filter): Lọc chính xác 100% ngữ cảnh của trang slide N.
    2. Semantic / Keyword Search: Tìm kiếm đoạn thông tin liên quan nhất khi hỏi câu hỏi chung.
    """

    def __init__(self):
        self.documents: List[Dict[str, Any]] = []
        self.slides_by_page: Dict[int, Dict[str, Any]] = {}
        self.current_slide_path: Optional[str] = None

    def index_slide_file(self, slide_path: str):
        """
        Đọc và đánh chỉ mục bộ slide theo từng trang (Có Cache).
        """
        if self.current_slide_path == slide_path and self.slides_by_page:
            return  # Cache hit: Slide đã được nạp trước đó, không cần parse lại!

        slides = SlideParser.extract_slides(slide_path)
        self.slides_by_page.clear()
        self.documents = [d for d in self.documents if d.get("type") != "slide"]
        self.current_slide_path = slide_path

        for s in slides:
            s_num = s["slide_number"]
            self.slides_by_page[s_num] = s
            self.documents.append({
                "type": "slide",
                "slide_number": s_num,
                "content": s["content"],
                "source": Path(slide_path).name
            })

    def index_transcripts(self, transcript_dir: str):
        """
        Đánh chỉ mục tất cả các file transcript bài giảng.
        """
        chunks = TranscriptParser.load_all_transcripts(transcript_dir)
        for c in chunks:
            self.documents.append({
                "type": "transcript",
                "chunk_id": c["chunk_id"],
                "content": c["content"],
                "source": c["file_name"]
            })

    def get_page_context(self, slide_number: int) -> Dict[str, Any]:
        """
        Metadata-Filtered Retrieval: Lấy ngữ cảnh chính xác của đúng trang slide `slide_number`.
        """
        slide_info = self.slides_by_page.get(slide_number)
        if not slide_info or not slide_info.get("content"):
            return {
                "slide_number": slide_number,
                "slide_text": "",
                "has_content": False,
                "context_str": f"[Slide {slide_number}] Không tìm thấy nội dung văn bản trên slide (slide trống hoặc chỉ chứa hình ảnh)."
            }

        slide_text = slide_info["content"]
        
        # Tìm thêm các đoạn transcript liên quan đến từ khóa trong trang slide này
        relevant_transcripts = self._search_transcripts_for_text(slide_text, top_k=2)
        
        context_blocks = [f"=== NỘI DUNG SLIDE TRANG {slide_number} ===\n{slide_text}"]
        if relevant_transcripts:
            context_blocks.append("\n=== BÀI GIẢNG CỦA GIẢNG VIÊN LIÊN QUAN ===")
            for t in relevant_transcripts:
                context_blocks.append(f"[{t['chunk_id']}] {t['content']}")

        return {
            "slide_number": slide_number,
            "slide_text": slide_text,
            "has_content": True,
            "context_str": "\n\n".join(context_blocks)
        }

    def _search_transcripts_for_text(self, text: str, top_k: int = 2) -> List[Dict[str, Any]]:
        words = set(re.findall(r"\w+", text.lower()))
        if not words:
            return []

        results = []
        for doc in self.documents:
            if doc["type"] == "transcript":
                doc_words = set(re.findall(r"\w+", doc["content"].lower()))
                overlap = len(words.intersection(doc_words))
                if overlap > 0:
                    results.append((overlap, doc))

        results.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in results[:top_k]]

    def search_relevant(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """
        Tìm kiếm ngữ cảnh liên quan nhất trong toàn bộ tài liệu dựa trên câu hỏi của người dùng.
        """
        query_words = set(re.findall(r"\w+", query.lower()))
        if not query_words:
            return []

        scored_docs = []
        for doc in self.documents:
            content = doc["content"]
            doc_words = set(re.findall(r"\w+", content.lower()))
            overlap = len(query_words.intersection(doc_words))
            
            if overlap > 0:
                # Tính điểm số overlap đơn giản
                score = overlap / (math.log(len(doc_words) + 10) + 1)
                scored_docs.append((score, doc))

        scored_docs.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored_docs[:top_k]]
