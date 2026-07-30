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
        # Dùng docling chuyển đổi file
        converter = DocumentConverter()
        result = converter.convert(file_path)
        markdown_text = result.document.export_to_markdown()
        
        # Tạo file HTML từ markdown
        import markdown
        html_text = markdown.markdown(markdown_text, extensions=['tables', 'fenced_code'])
        
        # Tên file HTML kết quả
        html_filename = f"{os.path.splitext(file.filename)[0]}.html"
        html_file_path = os.path.join("temp_uploads", html_filename)
        
        # Lưu file HTML
        with open(html_file_path, "w", encoding="utf-8") as f:
            f.write(f"<html><head><meta charset='utf-8'></head><body>{html_text}</body></html>")
        
        return {
            "status": "success", 
            "markdown": markdown_text, 
            "html": html_text,
            "html_file_path": html_file_path
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        # Dọn dẹp file tạm
        if os.path.exists(file_path):
            os.remove(file_path)
