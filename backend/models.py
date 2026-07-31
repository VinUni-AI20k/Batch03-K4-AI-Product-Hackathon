from sqlalchemy import Column, Integer, String, Text, ForeignKey
from pgvector.sqlalchemy import Vector
from .database import Base

class Slide(Base):
    __tablename__ = "slides"

    id = Column(Integer, primary_key=True, index=True)
    lecture_id = Column(String, index=True)
    slide_no = Column(Integer)
    title = Column(String)
    content_text = Column(Text)

class SlideEmbedding(Base):
    __tablename__ = "slide_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    slide_id = Column(Integer, ForeignKey("slides.id"))
    chunk_text = Column(Text)
    # Gemini gemini-embedding-2 has 3072 dimensions
    embedding = Column(Vector(3072))
