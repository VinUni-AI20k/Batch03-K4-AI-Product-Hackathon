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
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []
        self.slides_by_page: Dict[int, Dict[str, Any]] = {}

    def index_slide_file(self, slide_path: str):
        slides = SlideParser.extract_slides(slide_path)
        self.slides_by_page.clear()

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
        chunks = TranscriptParser.load_all_transcripts(transcript_dir)
        for c in chunks:
            self.documents.append({
                "type": "transcript",
                "chunk_id": c["chunk_id"],
                "content": c["content"],
                "source": c["file_name"]
            })

    def get_page_context(self, slide_number: int) -> Dict[str, Any]:
        slide_info = self.slides_by_page.get(slide_number)
        if not slide_info or not slide_info.get("content"):
            return {
                "slide_number": slide_number,
                "slide_text": "",
                "has_content": False,
                "context_str": f"[Slide {slide_number}] Không tìm thấy nội dung văn bản trên slide (slide trống hoặc chỉ chứa hình ảnh)."
            }

        slide_text = slide_info["content"]
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

    @staticmethod
    def _remove_accents(text: str) -> str:
        s1 = 'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾếỀềỂểỄễỆệỈỉỊịỌọỎảỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỶỷỸỹ'
        s0 = 'AAAAEEEIIOOOOUUYaaaaeeeiiOOoouuyAaDdIiUuOoUuAaAaAaAaAaAaAaAaAaAaAaAaEeEeEeEeEeEeEeEeIiIiOoOoOoOoOoOoOoOoOoOoOoOoUuUuUuUuUuUuUuYyYyYy'
        trans = str.maketrans(s1, s0)
        return text.translate(trans).lower()

    def search_relevant(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        norm_query = self._remove_accents(query)
        query_words = set(re.findall(r"\w+", norm_query))
        if not query_words:
            return []

        scored_docs = []
        for doc in self.documents:
            content = doc["content"]
            norm_content = self._remove_accents(content)
            doc_words = set(re.findall(r"\w+", norm_content))
            overlap = len(query_words.intersection(doc_words))
            
            if overlap > 0:
                score = overlap / (math.log(len(doc_words) + 10) + 1)
                scored_docs.append((score, doc))

        scored_docs.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored_docs[:top_k]]
