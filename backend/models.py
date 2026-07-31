from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
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

class Concept(Base):
    __tablename__ = "concepts"
    
    id = Column(Integer, primary_key=True, index=True)
    concept_id = Column(String, unique=True, index=True)
    lecture_id = Column(String, index=True)
    name = Column(String)
    prereq_id = Column(String, nullable=True)
    
class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    concept_id = Column(String, ForeignKey("concepts.concept_id"))
    stem = Column(Text)
    options = Column(JSON)
    answer_idx = Column(Integer)
    explanation = Column(Text)
    source_slide = Column(Integer)
