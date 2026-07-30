# core/pdf_processor.py
import os
from pathlib import Path
from pypdf import PdfReader

# Đường dẫn mặc định đến data pack của Hackathon
BASE_DIR = Path(__file__).resolve().parent.parent.parent
SLIDES_DIR = BASE_DIR / "data" / "vlearn-pack" / "slides"

def read_slide_page_real(day_code: str, page_num: int) -> str:
    """
    Đọc trực tiếp nội dung trang slide từ file PDF thật.
    day_code có thể là "d1" hoặc "d2" ứng với d1-slide-hackathon.pdf và d2-slide-hackathon.pdf
    """
    file_name = f"{day_code.lower()}-slide-hackathon.pdf"
    pdf_path = SLIDES_DIR / file_name

    # Kiểm tra xem file thật có tồn tại không
    if not pdf_path.exists():
        return f"[MOCK-DATA - File thật không tìm thấy tại {pdf_path.name}] Nội dung giả lập cho {day_code} trang {page_num}."

    try:
        reader = PdfReader(pdf_path)
        total_pages = len(reader.pages)
        
        # Kiểm tra giới hạn trang hợp lệ (Lớp ① - Nguồn sự thật)
        if page_num < 1 or page_num > total_pages:
            return f"LỖI: Trang {page_num} nằm ngoài phạm vi tài liệu (Tổng số trang: {total_pages})."
            
        # pypdf tính trang từ 0, slide tính từ 1
        page = reader.pages[page_num - 1]
        text = page.extract_text()
        
        if not text.strip():
            return f"[Cảnh báo]: Trang {page_num} của slide {day_code} trống hoặc chỉ chứa ảnh."
            
        return f"[Trích dẫn chính thức - Slide {day_code.upper()} - Trang {page_num}]:\n{text.strip()}"
        
    except Exception as e:
        return f"LỖI khi đọc file PDF: {str(e)}"