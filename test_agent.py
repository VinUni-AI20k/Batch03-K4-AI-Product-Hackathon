import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from tools import SlideParser, TranscriptParser, PageAwareRAGEngine
from config.settings import SLIDES_DIR, BASE_DIR

class TestPageAwareAIAgent(unittest.TestCase):

    def setUp(self):
        self.sample_pdf = str(SLIDES_DIR / "d1-slide-hackathon.pdf")
        self.transcript_dir = str(BASE_DIR / "data" / "vlearn-pack" / "transcript")

    def test_slide_parser(self):
        slides = SlideParser.extract_slides(self.sample_pdf)
        self.assertGreater(len(slides), 0, "Slide PDF không được rỗng")
        self.assertIn("slide_number", slides[0])

    def test_transcript_parser(self):
        chunks = TranscriptParser.load_all_transcripts(self.transcript_dir)
        self.assertGreater(len(chunks), 0, "Transcript không được rỗng")
        self.assertTrue(chunks[0]["chunk_id"].startswith("T"))

    def test_rag_page_filtering(self):
        engine = PageAwareRAGEngine()
        engine.index_slide_file(self.sample_pdf)
        engine.index_transcripts(self.transcript_dir)

        page1_ctx = engine.get_page_context(1)
        self.assertEqual(page1_ctx["slide_number"], 1)
        self.assertIn("=== NỘI DUNG SLIDE TRANG 1 ===", page1_ctx["context_str"])

    def test_rag_semantic_search(self):
        engine = PageAwareRAGEngine()
        engine.index_slide_file(self.sample_pdf)
        engine.index_transcripts(self.transcript_dir)

        results = engine.search_relevant("product manager", top_k=2)
        self.assertGreater(len(results), 0)

if __name__ == "__main__":
    unittest.main(verbosity=2)
