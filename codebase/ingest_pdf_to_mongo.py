"""
ingest_pdf_to_mongo.py
======================
Tải PDF từ URL → trích xuất text bằng PyMuPDF → chunk → lưu vào MongoDB collection `handbooks`.
Usage:
    python ingest_pdf_to_mongo.py
"""

import os
import re
import sys
import json
import hashlib
from datetime import datetime

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# ─── Thư viện ───────────────────────────────────────────────────────────────
try:
    import fitz  # PyMuPDF
except ImportError:
    print("[ERROR] Chưa cài PyMuPDF. Chạy: pip install pymupdf")
    sys.exit(1)

try:
    import requests
except ImportError:
    print("[ERROR] Chưa cài requests. Chạy: pip install requests")
    sys.exit(1)

try:
    from pymongo import MongoClient, UpdateOne
except ImportError:
    print("[ERROR] Chưa cài pymongo. Chạy: pip install pymongo")
    sys.exit(1)

from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

load_dotenv(os.path.join(PROJECT_ROOT, ".env"))
load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)

# ─── Cấu hình ───────────────────────────────────────────────────────────────
PDF_URL = "https://vinuni.edu.vn/wp-content/uploads/2025/04/20K-AI-Handbook_final.pdf"
PDF_LOCAL = os.path.join(BASE_DIR, "data", "20K-AI-Handbook_final.pdf")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "ai_hackathon_kb")
COLLECTION = "handbooks"
CHUNK_SIZE = 1200          # ký tự mỗi chunk
CHUNK_OVERLAP = 150        # ký tự overlap giữa các chunk
SOURCE_URL = PDF_URL       # URL để trích dẫn


def download_pdf(url: str, dest: str) -> bool:
    """Tải PDF về local nếu chưa có."""
    if os.path.exists(dest):
        size_mb = os.path.getsize(dest) / 1_048_576
        print(f"[PDF] Đã tồn tại local: {dest} ({size_mb:.1f} MB)")
        return True
    print(f"[PDF] Đang tải từ: {url}")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        resp = requests.get(url, headers=headers, stream=True, timeout=60)
        resp.raise_for_status()
        total = int(resp.headers.get("content-length", 0))
        downloaded = 0
        with open(dest, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
                downloaded += len(chunk)
                if total:
                    pct = downloaded * 100 // total
                    print(f"\r  [{pct}%] {downloaded/1024:.0f}KB / {total/1024:.0f}KB", end="", flush=True)
        print(f"\n[PDF] Tải xong: {dest}")
        return True
    except Exception as e:
        print(f"[ERROR] Không tải được PDF: {e}")
        return False


def extract_text_from_pdf(pdf_path: str) -> list[dict]:
    """Trích xuất text theo từng trang từ PDF, trả về list dict {page, text}."""
    doc = fitz.open(pdf_path)
    pages = []
    print(f"[PDF] Tổng số trang: {len(doc)}")
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        # Làm sạch: xóa dòng trắng thừa, ký tự lạ
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = re.sub(r"[ \t]{2,}", " ", text)
        text = text.strip()
        if text and len(text) > 30:  # Bỏ trang trắng / chỉ có số trang
            pages.append({"page": page_num + 1, "text": text})
    doc.close()
    print(f"[PDF] Trích xuất được {len(pages)} trang có nội dung")
    return pages


def chunk_pages(pages: list[dict], chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[dict]:
    """Chia text từ các trang thành các chunk chồng lấp để giữ ngữ cảnh."""
    # Gộp tất cả text, đánh dấu trang
    full_text = ""
    page_markers = []
    for p in pages:
        start = len(full_text)
        full_text += p["text"] + "\n\n"
        page_markers.append((start, p["page"]))

    def get_page_for_pos(pos):
        """Tìm số trang cho một vị trí trong full_text."""
        page = page_markers[0][1]
        for marker_pos, page_num in page_markers:
            if marker_pos <= pos:
                page = page_num
        return page

    chunks = []
    pos = 0
    chunk_idx = 0
    while pos < len(full_text):
        end = min(pos + chunk_size, len(full_text))
        # Cố gắng cắt tại ranh giới câu/đoạn
        if end < len(full_text):
            for sep in ["\n\n", ".\n", ". ", "\n"]:
                cut = full_text.rfind(sep, pos, end)
                if cut > pos + chunk_size // 2:
                    end = cut + len(sep)
                    break

        chunk_text = full_text[pos:end].strip()
        if chunk_text and len(chunk_text) > 50:
            page_num = get_page_for_pos(pos)
            chunk_idx += 1
            chunk_id = hashlib.md5(f"handbook_vinuni_20k_pdf_p{page_num}_c{chunk_idx}".encode()).hexdigest()[:16]
            chunks.append({
                "id": f"handbook_vinuni_20k_pdf_{chunk_id}",
                "title": f"VinUni AI 20K Handbook - Trang {page_num}",
                "content": chunk_text,
                "source_type": "handbook",
                "source_name": "VinUni AI 20K Handbook",
                "source_url": SOURCE_URL,
                "url": SOURCE_URL,
                "page": page_num,
                "chunk_index": chunk_idx,
                "char_count": len(chunk_text),
                "ingested_at": datetime.utcnow().isoformat(),
                "tags": ["handbook", "vinuni", "ai-thuc-chien", "20k", "curriculum", "tuyển sinh", "lộ trình", "kỹ năng"]
            })

        pos = end - overlap if end - overlap > pos else end
        if pos >= len(full_text):
            break

    return chunks


def upsert_to_mongo(chunks: list[dict], uri: str, db_name: str, collection: str) -> int:
    """Upsert các chunk vào MongoDB, trả về số chunk đã upsert."""
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    client.admin.command("ping")
    db = client[db_name]
    col = db[collection]

    # Tạo index để upsert nhanh
    col.create_index("id", unique=True)
    col.create_index("source_name")

    operations = [
        UpdateOne({"id": c["id"]}, {"$set": c}, upsert=True)
        for c in chunks
    ]
    result = col.bulk_write(operations, ordered=False)
    upserted = result.upserted_count
    modified = result.modified_count
    print(f"[MongoDB] Upserted: {upserted} mới | Modified: {modified} cập nhật | Collection: '{collection}'")
    client.close()
    return upserted + modified


def main():
    print("=" * 60)
    print("  VinUni AI 20K Handbook → MongoDB Ingestion")
    print("=" * 60)

    # 1. Tải PDF
    if not download_pdf(PDF_URL, PDF_LOCAL):
        print("[FAIL] Không thể tải PDF. Dừng lại.")
        sys.exit(1)

    # 2. Trích xuất text từng trang
    pages = extract_text_from_pdf(PDF_LOCAL)
    if not pages:
        print("[FAIL] Không trích xuất được nội dung nào từ PDF.")
        sys.exit(1)

    # 3. Chunk text
    print(f"[Chunk] Đang chia nhỏ nội dung (chunk_size={CHUNK_SIZE}, overlap={CHUNK_OVERLAP})...")
    chunks = chunk_pages(pages, CHUNK_SIZE, CHUNK_OVERLAP)
    print(f"[Chunk] Tổng số chunk: {len(chunks)}")

    # Preview 3 chunk đầu
    for c in chunks[:3]:
        print(f"\n  --- Chunk #{c['chunk_index']} | Trang {c['page']} ---")
        print(f"  {c['content'][:200]}...")

    # 4. Lưu vào MongoDB
    print(f"\n[MongoDB] Kết nối đến: {MONGO_URI} / DB: {MONGO_DB_NAME}")
    try:
        total = upsert_to_mongo(chunks, MONGO_URI, MONGO_DB_NAME, COLLECTION)
        print(f"\n✅ Hoàn tất! {total} chunks từ VinUni AI 20K Handbook đã được nạp vào MongoDB.")
        print(f"   → AI Agent sẽ tự động học từ tài liệu này khi restart backend.")
    except Exception as e:
        print(f"\n[ERROR] Lỗi kết nối MongoDB: {e}")
        print("  Hãy đảm bảo MongoDB đang chạy trên localhost:27017")
        sys.exit(1)

    # 5. Lưu metadata
    meta_path = os.path.join(BASE_DIR, "data", "handbook_pdf_meta.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump({
            "source": PDF_URL,
            "local_path": PDF_LOCAL,
            "total_pages": len(pages),
            "total_chunks": len(chunks),
            "ingested_at": datetime.utcnow().isoformat(),
            "mongo_db": MONGO_DB_NAME,
            "mongo_collection": COLLECTION
        }, f, ensure_ascii=False, indent=2)
    print(f"   → Metadata đã lưu tại: {meta_path}")


if __name__ == "__main__":
    main()
