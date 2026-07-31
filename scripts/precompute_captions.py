"""Pre-generate image captions for all slides using OpenAI Vision API."""

import sys
import codecs
if sys.stdout.encoding != 'utf-8':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
from pathlib import Path
import json
import base64

# Add codebase to path so we can import from config and llm
ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT_DIR / "codebase"))

from config import SLIDE_STORE, ROOT
from llm import call_openai_vision_api
import fitz  # PyMuPDF

def main():
    captions_file = ROOT / "slide" / "captions.json"
    
    # Load existing to avoid re-generating
    captions = {}
    if captions_file.exists():
        with captions_file.open("r", encoding="utf-8") as f:
            captions = json.load(f)
            
    lessons = SLIDE_STORE.list_lessons()
    
    for lesson in lessons:
        if not lesson["available"]:
            continue
            
        lesson_id = lesson["id"]
        if lesson_id not in captions:
            captions[lesson_id] = {}
            
        pdf_path = ROOT / "slide" / lesson["filename"]
        print(f"Processing {lesson['filename']}...")
        
        doc = fitz.open(pdf_path)
        for page_num in range(len(doc)):
            page_index = str(page_num + 1)
            
            if page_index in captions[lesson_id]:
                print(f"  Skipping page {page_index}, already captioned.")
                continue
                
            print(f"  Capturing page {page_index}...")
            page = doc[page_num]
            pix = page.get_pixmap(dpi=150)
            img_data = pix.tobytes("png")
            b64_image = base64.b64encode(img_data).decode("utf-8")
            
            prompt = (
                "Bạn là một chuyên gia phân tích tài liệu giáo dục. "
                "Hãy mô tả chi tiết, đầy đủ mọi nội dung, biểu đồ, hình ảnh, luồng xử lý (workflow) "
                "hoặc bất kỳ sơ đồ nào có trên slide này. Không cần nhắc lại tiêu đề lớn nếu nó hiển nhiên. "
                "Cần tập trung vào các thông tin bằng hình ảnh mà người xem chỉ có thể thấy khi nhìn vào slide "
                "để hỗ trợ tính năng tra cứu (search) về sau."
            )
            
            try:
                caption = call_openai_vision_api(prompt, b64_image, model="gpt-4o-mini")
                captions[lesson_id][page_index] = caption
                print(f"    -> Thành công: {caption[:50]}...")
            except Exception as e:
                print(f"    -> Lỗi khi gọi OpenAI API: {e}")
                
            # Save incrementally
            with captions_file.open("w", encoding="utf-8") as f:
                json.dump(captions, f, ensure_ascii=False, indent=2)
                
    print("Hoàn tất tạo captions!")

if __name__ == "__main__":
    main()
