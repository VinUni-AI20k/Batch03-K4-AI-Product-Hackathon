import os
import sys
import fitz  # PyMuPDF
import google.generativeai as genai
from sqlalchemy.orm import Session
from sqlalchemy import text

# Add parent directory to sys.path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import engine, SessionLocal, Base
from backend.models import Slide, SlideEmbedding
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

def chunk_text(text, max_length=1000):
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    for word in words:
        if current_length + len(word) > max_length:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_length = len(word)
        else:
            current_chunk.append(word)
            current_length += len(word) + 1
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks

def get_embedding(text):
    result = genai.embed_content(
        model="models/gemini-embedding-2",
        content=text,
        task_type="retrieval_document"
    )
    return result['embedding']

def process_pdf(pdf_path, lecture_id, db: Session):
    print(f"Processing {pdf_path}...")
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return
        
    for i, page in enumerate(doc):
        slide_no = i + 1
        text_content = page.get_text()
        if not text_content.strip():
            continue
        
        # Save Slide
        slide = Slide(
            lecture_id=lecture_id,
            slide_no=slide_no,
            title=f"Slide {slide_no}",
            content_text=text_content
        )
        db.add(slide)
        db.commit()
        db.refresh(slide)
        
        # Chunk and Embed
        chunks = chunk_text(text_content)
        for chunk in chunks:
            embedding = get_embedding(chunk)
            slide_emb = SlideEmbedding(
                slide_id=slide.id,
                chunk_text=chunk,
                embedding=embedding
            )
            db.add(slide_emb)
        db.commit()
        print(f"  Processed slide {slide_no} with {len(chunks)} chunks.")

def main():
    # Ensure pgvector extension
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()
        
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(Slide).first():
        print("Database already seeded. Skipping.")
        return
    
    data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "vlearn-pack", "slides")
    
    # Process PDF 1
    pdf1 = os.path.join(data_dir, "d1-slide-hackathon.pdf")
    if os.path.exists(pdf1):
        process_pdf(pdf1, "day01", db)
        
    # Process PDF 2
    pdf2 = os.path.join(data_dir, "d2-slide-hackathon.pdf")
    if os.path.exists(pdf2):
        process_pdf(pdf2, "day02", db)
        
    db.close()
    print("Seeding complete.")

if __name__ == "__main__":
    main()
