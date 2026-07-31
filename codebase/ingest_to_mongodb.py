import os
import json
import re
import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass
from pymongo import MongoClient
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

load_dotenv(os.path.join(PROJECT_ROOT, ".env"))
load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "ai_hackathon_kb")

def read_text_chunks(full_path, chunk_size=1600):
    try:
        with open(full_path, "r", encoding="utf-8") as f:
            text = f.read()
    except UnicodeDecodeError:
        try:
            with open(full_path, "r", encoding="utf-16le") as f:
                text = f.read()
        except Exception as e:
            print(f"Cannot read {full_path}: {e}")
            return []
    except Exception as e:
        print(f"Cannot read {full_path}: {e}")
        return []
        
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    if not text: return []
    rel_path = os.path.relpath(full_path, PROJECT_ROOT).replace("\\", "/")
    chunks = []
    for idx in range(0, len(text), chunk_size):
        chunk = text[idx: idx + chunk_size].strip()
        if not chunk: continue
        chunks.append({
            "source_type": "handbook",
            "id": f"handbook_{rel_path.replace('/','_')}_{idx // chunk_size + 1}",
            "title": f"Sổ tay chương trình - {rel_path}",
            "content": chunk,
            "url": f"/api/docs/{rel_path}",
            "source_name": os.path.basename(full_path)
        })
    return chunks

def load_handbooks():
    paths = ["tham-khao"]
    docs = []
    for source_path in paths:
        full_path = os.path.join(PROJECT_ROOT, source_path)
        if os.path.isdir(full_path):
            for root, _, files in os.walk(full_path):
                for filename in files:
                    if filename.lower().endswith((".md", ".txt")):
                        if any(ign in filename.lower() or ign in root.lower() for ign in ["transcript", "chatlog", "-clean.md", ".csv"]):
                            continue
                        docs.extend(read_text_chunks(os.path.join(root, filename)))
    return docs

def load_json(rel_path):
    full_path = os.path.join(PROJECT_ROOT, rel_path)
    if not os.path.exists(full_path):
        full_path = os.path.join(BASE_DIR, rel_path)
    if os.path.exists(full_path):
        with open(full_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def main():
    print(f"Kết nối tới MongoDB tại {MONGO_URI}...")
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
    except Exception as e:
        print(f"Không thể kết nối tới MongoDB: {e}")
        return
        
    db = client[MONGO_DB_NAME]
    
    # 1. Ingest FB Posts
    fb_data = load_json("data/fb_group_qa.json")
    if fb_data:
        db["fb_posts"].drop()
        db["fb_posts"].insert_many(fb_data)
        print(f"Đã cập nhật {len(fb_data)} bài đăng FB vào MongoDB.")
    else:
        print("Không tìm thấy dữ liệu FB posts.")
        
    # 2. Ingest VLearn
    vlearn_data = load_json("data/vlearn_kb.json")
    if vlearn_data:
        db["vlearn"].drop()
        db["vlearn"].insert_many(vlearn_data)
        print(f"Đã cập nhật {len(vlearn_data)} bài giảng VLearn vào MongoDB.")
    else:
        print("Không tìm thấy dữ liệu VLearn.")
        
    # 3. Ingest Handbooks
    handbooks = load_handbooks()
    if handbooks:
        db["handbooks"].drop()
        db["handbooks"].insert_many(handbooks)
        print(f"Đã cập nhật {len(handbooks)} đoạn (chunks) sổ tay vào MongoDB.")
    else:
        print("Không tìm thấy sổ tay chương trình.")

    # 4. Ingest raw scraper data if present
    scraper_files = ["scraper_out.txt", "scraper_out2.txt", "scraper_out3.txt"]
    scraper_chunks = []
    for sf in scraper_files:
        full_sf = os.path.join(PROJECT_ROOT, sf)
        if os.path.exists(full_sf):
            chunks = read_text_chunks(full_sf, 2000)
            if chunks:
                for c in chunks:
                    c["title"] = f"Dữ liệu cào FB gốc - {sf}"
                scraper_chunks.extend(chunks)
                
    if scraper_chunks:
        # Thêm trực tiếp vào handbooks collection
        db["handbooks"].insert_many(scraper_chunks)
        print(f"Đã bổ sung thêm {len(scraper_chunks)} chunks từ các file cào dữ liệu gốc vào MongoDB.")

    print("Quá trình Import dữ liệu vào MongoDB hoàn tất!")

if __name__ == '__main__':
    main()
