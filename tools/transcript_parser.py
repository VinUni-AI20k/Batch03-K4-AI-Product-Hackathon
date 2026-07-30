import sys
import os
import re
from pathlib import Path
from typing import List, Dict, Any

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

class TranscriptParser:
    """
    Công cụ đọc và bóc tách các file transcript bài giảng trong data/vlearn-pack/transcript/
    """

    @staticmethod
    def parse_transcript_file(file_path: str) -> List[Dict[str, Any]]:
        """
        Phân tách file transcript sạch thành các đoạn trích dẫn có mã [Txx-NNN]
        """
        path = Path(file_path)
        if not path.exists():
            return []

        chunks = []
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        # Regex tìm các mã đoạn [Txx-NNN]
        pattern = r"\*\*\[(T\d+-\d+)\]\*\*\s*(.*?)(?=\n\n\*\*\[T\d+-\d+\]\*\*|\n\n## |\Z)"
        matches = re.findall(pattern, content, re.DOTALL)

        for match_id, text in matches:
            clean_text = text.strip()
            if clean_text:
                chunks.append({
                    "chunk_id": match_id,
                    "content": clean_text,
                    "file_name": path.name
                })

        return chunks

    @staticmethod
    def load_all_transcripts(transcript_dir: str) -> List[Dict[str, Any]]:
        """
        Đọc tất cả các file transcript có trong thư mục
        """
        dir_path = Path(transcript_dir)
        all_chunks = []
        if not dir_path.exists():
            return all_chunks

        for file_file in dir_path.glob("transcript-*.md"):
            chunks = TranscriptParser.parse_transcript_file(str(file_file))
            all_chunks.extend(chunks)

        return all_chunks
