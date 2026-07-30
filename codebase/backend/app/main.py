import os
import shutil
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from docling.document_converter import DocumentConverter

app = FastAPI(
    title="AI in Action Hackathon API",
    description="Backend API for AI in Action Hackathon projects using Next.js & FastAPI",
    version="1.0.0"
)

# Cấu hình CORS để cho phép Next.js gọi API từ localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Có thể giới hạn lại thành ["http://localhost:3000"] nếu cần bảo mật hơn
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI in Action Hackathon API"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "backend"}

@app.post("/api/upload-slide")
async def upload_slide(file: UploadFile = File(...)):
    # Tạo thư mục temp nếu chưa có
    os.makedirs("temp_uploads", exist_ok=True)
    file_path = os.path.join("temp_uploads", file.filename)
    
    # Lưu file tạm thời
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Dùng PyMuPDF (fitz) để quét toàn bộ text và toạ độ cực nhanh & chính xác
        import fitz
        
        all_items = []
        pdf_doc = fitz.open(file_path)
        
        markdown_text = ""
        pages_dict = {} # Lưu kích thước từng trang
        
        for page_no_0 in range(len(pdf_doc)):
            page = pdf_doc.load_page(page_no_0)
            page_no = page_no_0 + 1
            
            # Lưu kích thước trang
            rect = page.rect
            pages_dict[page_no] = {"width": rect.width, "height": rect.height}
            
            markdown_text += f"\n\n---\n## Slide {page_no}\n\n"
            
            # Lấy toàn bộ dict cấu trúc của trang
            page_dict = page.get_text("dict")
            blocks = page_dict.get("blocks", [])
            
            for block in blocks:
                if block.get("type") == 0:  # Text block
                    bbox = block.get("bbox") # [l, t, r, b] top-left origin
                    text = ""
                    for line in block.get("lines", []):
                        for span in line.get("spans", []):
                            text += span.get("text", "") + " "
                        text += "\n"
                    
                    text = text.strip()
                    if text:
                        # Thêm vào mảng all_items
                        all_items.append({
                            "page_no": page_no,
                            "bbox": bbox,
                            "text": text,
                            "label": "text"
                        })
                        markdown_text += f"{text}\n\n"
        # Cấu hình dotenv để lấy GEMINI_API_KEY
        from dotenv import load_dotenv
        load_dotenv()
        
        # Gọi Gemini để sinh Outline
        import json
        import google.generativeai as genai
        
        outline_data = []
        gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        if gemini_api_key:
            try:
                genai.configure(api_key=gemini_api_key)
                model = genai.GenerativeModel('gemini-1.5-flash')
                prompt = f"""
                Hãy đóng vai một chuyên gia giáo dục. Đọc nội dung Markdown sau của một file Slide và tự động sinh ra một cấu trúc Outline (Mục lục) phân cấp logic.
                Trả về DUY NHẤT một mảng JSON (không có markdown formatting), mỗi phần tử gồm:
                - "level": 1, 2, hoặc 3 (độ sâu của mục)
                - "title": tiêu đề của mục
                - "summary": (tuỳ chọn) một dòng tóm tắt mục này.

                Nội dung Markdown:
                {markdown_text[:8000]}
                """
                response = model.generate_content(prompt)
                
                # Làm sạch response
                json_str = response.text.strip()
                if json_str.startswith("```json"):
                    json_str = json_str[7:]
                if json_str.endswith("```"):
                    json_str = json_str[:-3]
                
                outline_data = json.loads(json_str)
            except Exception as e:
                print("Lỗi khi gọi Gemini:", e)
        
        # Nếu không có API Key hoặc lỗi, fallback về Regex
        if not outline_data:
            import re
            headings = re.findall(r'(#+)\s+(.*)', markdown_text)
            for level, title in headings:
                outline_data.append({'level': len(level), 'title': title.strip()})
                
        # Tạo sidebar HTML
        outline_html = "<h2>Mục lục (Outline AI)</h2><ul>"
        for item in outline_data:
            indent = (item.get('level', 1) - 1) * 20
            title = item.get('title', '')
            summary = item.get('summary', '')
            outline_html += f"<li style='margin-left: {indent}px; margin-bottom: 12px;'>"
            outline_html += f"<a href='#{title}' style='text-decoration: none; color: #2563eb; font-weight: bold;'>{title}</a>"
            if summary:
                outline_html += f"<br><span style='font-size: 12px; color: #64748b;'>{summary}</span>"
            outline_html += "</li>"
        outline_html += "</ul>"
        
        # Lưu lại file Markdown vào thư mục temp_uploads
        md_file_path = file_path.replace(".pdf", ".md")
        with open(md_file_path, "w", encoding="utf-8") as f:
            f.write(markdown_text)
            
            
        slides_html = ""
        html_content = "" # Fallback cho key html trong response
        
        # Mở PDF bằng PyMuPDF để trích xuất ảnh nền
        import fitz
        import base64
        try:
            pdf_doc = fitz.open(file_path)
        except:
            pdf_doc = None
            
        for page_no, page_info in pages_dict.items():
            p_width = page_info.get("width", 1024)
            p_height = page_info.get("height", 768)
            
            # Lấy ảnh nền trang (base64) chất lượng cao (zoom 2x)
            bg_image_b64 = ""
            if pdf_doc:
                try:
                    page = pdf_doc.load_page(page_no - 1)
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                    bg_image_b64 = base64.b64encode(pix.tobytes("png")).decode("utf-8")
                except Exception as e:
                    print(f"Lỗi lấy ảnh nền trang {page_no}: {e}")
            
            page_items_html = ""
            for item in all_items:
                if item.get("page_no") == page_no:
                    bbox = item.get("bbox", [])
                    if len(bbox) != 4: continue
                    
                    # PyMuPDF bbox format: [x0, y0, x1, y1] (top-left origin)
                    l, t, r, b = bbox
                    item_w = r - l
                    item_h = b - t
                    css_left = l
                    css_top = t
                    
                    label = item.get("label", "text")
                    
                    if label == "picture":
                        content_html_item = ""
                        bg_css = "background: rgba(239,68,68,0.1); border: 2px dashed #ef4444;"
                    else:
                        content_html_item = item.get("text", "")
                        bg_css = "background: rgba(255,255,255,0.7); border: 1px dashed rgba(59,130,246,0.5); border-radius: 4px; padding: 2px;"
                    
                    page_items_html += f"""
                    <div class="element" data-label="{label}" data-bbox="[{l},{t},{r},{b}]" style="position: absolute; left: {css_left}px; top: {css_top}px; width: {item_w}px; min-height: {item_h}px; box-sizing: border-box; font-size: 14px; display: flex; align-items: flex-start; {bg_css}">
                        {content_html_item}
                    </div>
                    """
            
            # Đặt ảnh nền vào background-image
            bg_style = f"background-image: url('data:image/png;base64,{bg_image_b64}'); background-size: 100% 100%; background-repeat: no-repeat;" if bg_image_b64 else "background: white;"
            
            # Cần chỉnh scale wrapper cho màn hình để vừa vặn khi render
            slides_html += f"""
            <div class="slide-container" id="slide-{page_no}" data-page="{page_no}" style="position: relative; width: {p_width}px; height: {p_height}px; margin-bottom: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #cbd5e1; flex-shrink: 0; transform-origin: top center; transform: scale(0.9); {bg_style}">
                <div style="position: absolute; top: -30px; left: 0; font-weight: bold; color: #64748b; font-size: 18px;">Slide {page_no}</div>
                {page_items_html}
            </div>
            """
            
        if pdf_doc:
            pdf_doc.close()
            
        full_html = f"""
        <html>
        <head>
            <meta charset='utf-8'>
            <title>Tài liệu & Outline AI</title>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; display: flex; height: 100vh; background-color: #f1f5f9; overflow: hidden; }}
                .sidebar {{ width: 350px; background-color: #ffffff; border-right: 1px solid #e2e8f0; padding: 20px; overflow-y: auto; box-shadow: 2px 0 5px rgba(0,0,0,0.05); }}
                .content {{ flex: 1; padding: 40px; overflow-y: auto; background-color: #f1f5f9; display: flex; flex-direction: column; align-items: center; }}
                h2 {{ color: #0f172a; }}
                ul {{ list-style-type: none; padding-left: 0; }}
                li a:hover {{ text-decoration: underline !important; }}
                .element:hover {{ background: rgba(59,130,246,0.1) !important; cursor: pointer; border: 2px solid #2563eb !important; }}
            </style>
        </head>
        <body>
            <div class="sidebar">
                {outline_html}
            </div>
            <div class="content">
                {slides_html}
            </div>
        </body>
        </html>
        """
        
        html_file_path = os.path.splitext(file_path)[0] + ".html"
        with open(html_file_path, "w", encoding="utf-8") as f:
            f.write(full_html)
        
        return {
            "status": "success", 
            "markdown": markdown_text, 
            "html": html_content,
            "html_file_path": html_file_path
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        # Dọn dẹp file tạm
        if os.path.exists(file_path):
            os.remove(file_path)