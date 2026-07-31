"""
Seed script to import local JSON, raw FB scraped posts & Handbook data into MongoDB.
Usage:
    python seed_mongo.py
"""

import glob
import json
import os
import re
import sys
from typing import Any, Dict, List
from dotenv import load_dotenv

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

load_dotenv(os.path.join(PROJECT_ROOT, ".env"))
load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)

try:
    from pymongo import MongoClient, ReplaceOne
except ImportError:
    MongoClient = None

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "ai_hackathon_kb")

def resolve_path(path: str) -> str:
    if os.path.isabs(path):
        return path
    for base in [BASE_DIR, PROJECT_ROOT, os.getcwd()]:
        candidate = os.path.join(base, path)
        if os.path.exists(candidate):
            return candidate
    return os.path.join(BASE_DIR, path)

def best_comment(comments: list) -> dict | None:
    if not comments:
        return None
    def reactions(c):
        v = c.get("reaction_count", "0")
        try:
            return int(str(v).replace("K", "000").replace("k", "000").replace(",", ""))
        except Exception:
            return 0
    return max(comments, key=reactions)

def guess_category(text: str) -> str:
    text_lower = text.lower()
    if any(w in text_lower for w in ["pip", "install", "lỗi", "error", "fix", "windows", "python", "package"]):
        return "technical_setup"
    if any(w in text_lower for w in ["deadline", "hạn", "lịch", "nộp", "spec", "checkpoint", "cp"]):
        return "deadline_schedule"
    if any(w in text_lower for w in ["rubric", "điểm", "chấm", "tiêu chí", "evidence", "r1", "r2", "r3", "r4", "r5", "r6"]):
        return "rubric_grading"
    if any(w in text_lower for w in ["hax", "pair", "vibe", "prototype", "sketch", "mock", "working", "jtbd", "spec.md"]):
        return "course_concept"
    if any(w in text_lower for w in ["scraper", "facebook", "graphql", "api", "agent", "llm", "rag"]):
        return "technical_implementation"
    return "general"

def guess_tags(text: str) -> list[str]:
    tags = []
    mapping = {
        "windows": ["windows"],
        "pip": ["pip", "install"],
        "python": ["python"],
        "deadline": ["deadline", "hạn nộp"],
        "spec": ["spec.md", "spec"],
        "checkpoint": ["checkpoint", "cp"],
        "rubric": ["rubric", "tiêu chí"],
        "evidence": ["evidence", "bằng chứng"],
        "hax": ["hax"],
        "pair": ["pair"],
        "vibe-coding": ["vibe-coding", "vibe coding"],
        "prototype": ["prototype"],
        "facebook": ["facebook", "fb", "scraper"],
        "graphql": ["graphql"],
        "llm": ["llm", "gpt", "claude", "gemini"],
        "rag": ["rag", "retrieval"],
    }
    text_lower = text.lower()
    for tag, keywords in mapping.items():
        if any(kw in text_lower for kw in keywords):
            tags.append(tag)
    return tags or ["general"]

def convert_scraped_fb_post(raw: dict, index: int) -> dict | None:
    message = (raw.get("message") or "").strip()
    comments = raw.get("comments") or []
    post_id = raw.get("post_id", f"unknown_{index}")
    permalink = raw.get("permalink", "")
    group_name = raw.get("group_name", "")

    if not message or len(comments) == 0:
        return None
    if len(message) < 15:
        return None

    top = best_comment(comments)
    if not top or not top.get("text", "").strip():
        return None

    answer_parts = [top["text"].strip()]
    for reply in top.get("replies", []):
        rt = reply.get("text", "").strip()
        if rt:
            answer_parts.append(f"  ↳ {rt}")
    answer_text = "\n".join(answer_parts)

    other_comments = []
    for c in comments:
        if c is top:
            continue
        ct = c.get("text", "").strip()
        if ct:
            other_comments.append(ct)

    return {
        "id": f"fb_scraped_{post_id}",
        "post_id": str(post_id),
        "author_type": "student",
        "author_name": "Học viên (scraped)",
        "timestamp": "",
        "question": message,
        "category": guess_category(message),
        "tags": guess_tags(message + " " + answer_text),
        "verified_answer": {
            "author_type": "community",
            "author_name": "Cộng đồng AI Thực Chiến",
            "content": answer_text,
            "likes": 0,
            "source_url": permalink,
        },
        "other_comments": other_comments[:5],
        "source": "scraped",
        "group_name": group_name,
    }

def read_text_chunks(full_path: str, chunk_size: int = 1600) -> List[Dict[str, Any]]:
    try:
        with open(full_path, "r", encoding="utf-8") as f:
            text = f.read()
    except Exception as e:
        print(f"[Warning] Cannot read {full_path}: {e}")
        return []

    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    if not text:
        return []

    rel_path = os.path.relpath(full_path, PROJECT_ROOT).replace("\\", "/")
    chunks = []
    for idx in range(0, len(text), chunk_size):
        chunk = text[idx: idx + chunk_size].strip()
        if not chunk:
            continue
        chunks.append({
            "source_type": "handbook",
            "id": f"handbook_{rel_path}_{idx // chunk_size + 1}",
            "title": f"Sổ tay chương trình - {rel_path}",
            "content": chunk,
            "url": f"/api/docs/{rel_path}",
        })
    return chunks

def seed_database():
    if not MongoClient:
        print("[Error] pymongo uninitialized or not installed. Run: pip install pymongo")
        return

    print(f"[MongoDB] Connecting to {MONGO_URI} (DB: {MONGO_DB_NAME})...")
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        db = client[MONGO_DB_NAME]
        print("[MongoDB] Connected successfully!")
    except Exception as e:
        print(f"[Error] Could not connect to MongoDB: {e}")
        return

    # 1. Load existing fb_group_qa.json
    fb_docs = {}
    fb_path = resolve_path(os.getenv("FB_KB_PATH", "data/fb_group_qa.json"))
    if os.path.exists(fb_path):
        with open(fb_path, "r", encoding="utf-8") as f:
            for doc in json.load(f):
                if doc.get("id"):
                    fb_docs[doc["id"]] = doc

    # 2. Also scan all raw scraped JSON files in fb/facebook_post_comment_scraper/group_post/
    raw_fb_dir = os.path.join(PROJECT_ROOT, "fb", "facebook_post_comment_scraper", "group_post")
    raw_files = glob.glob(os.path.join(raw_fb_dir, "**", "*.json"), recursive=True)
    scraped_added = 0
    for i, jf in enumerate(raw_files):
        try:
            with open(jf, "r", encoding="utf-8") as f:
                raw = json.load(f)
            doc = convert_scraped_fb_post(raw, i)
            if doc and doc["id"] not in fb_docs:
                fb_docs[doc["id"]] = doc
                scraped_added += 1
        except Exception:
            pass

    if fb_docs:
        ops = [
            ReplaceOne({"id": doc.get("id")}, doc, upsert=True)
            for doc in fb_docs.values() if doc.get("id")
        ]
        if ops:
            db["fb_posts"].bulk_write(ops)
            print(f"[FB] Collection 'fb_posts': Seeded/Updated {len(ops)} items ({scraped_added} new from raw scraper logs!).")
            # Save updated list back to fb_group_qa.json for local fallback
            try:
                with open(fb_path, "w", encoding="utf-8") as f:
                    json.dump(list(fb_docs.values()), f, ensure_ascii=False, indent=2)
            except Exception:
                pass

    # 3. Seed VLearn KB
    vlearn_path = resolve_path(os.getenv("VLEARN_KB_PATH", "data/vlearn_kb.json"))
    if os.path.exists(vlearn_path):
        with open(vlearn_path, "r", encoding="utf-8") as f:
            vlearn_data = json.load(f)
        if vlearn_data:
            ops = [
                ReplaceOne({"id": doc.get("id")}, doc, upsert=True)
                for doc in vlearn_data if doc.get("id")
            ]
            if ops:
                db["vlearn"].bulk_write(ops)
                print(f"[VLearn] Collection 'vlearn': Seeded/Updated {len(ops)} items.")

    # 4. Seed Handbook KB (only official course references in tham-khao, exclude assignment docs & transcripts)
    default_paths = [
        "tham-khao"
    ]
    configured = os.getenv("PROGRAM_HANDBOOK_PATHS", "")
    paths = [p.strip() for p in configured.split(";") if p.strip()] or default_paths

    # Xóa toàn bộ doc trong handbooks (đặc biệt là các file quy chế bài tập 01-de-bai.md, README.md, transcript...)
    if db is not None:
        try:
            db["handbooks"].delete_many({})
        except Exception as e:
            print(f"[Warning] Could not clear old handbooks from MongoDB: {e}")

    handbook_docs = []
    for source_path in paths:
        full_path = resolve_path(source_path)
        if os.path.isdir(full_path):
            for root, _, files in os.walk(full_path):
                for filename in files:
                    if filename.lower().endswith((".md", ".txt")):
                        if any(ignored in filename.lower() or ignored in root.lower() for ignored in ["transcript", "chatlog", "-clean.md", ".csv"]):
                            continue
                        handbook_docs.extend(read_text_chunks(os.path.join(root, filename)))
        elif os.path.isfile(full_path):
            handbook_docs.extend(read_text_chunks(full_path))

    if handbook_docs:
        ops = [
            ReplaceOne({"id": doc.get("id")}, doc, upsert=True)
            for doc in handbook_docs if doc.get("id")
        ]
        if ops:
            db["handbooks"].bulk_write(ops)
            print(f"[Handbooks] Collection 'handbooks': Seeded/Updated {len(ops)} items.")

    print("\n[Complete] Successfully seeded all data into MongoDB!")

if __name__ == "__main__":
    seed_database()
