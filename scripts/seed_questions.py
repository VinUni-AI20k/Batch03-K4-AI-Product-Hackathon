import os
import sys
import json
from sqlalchemy.orm import Session

# Add parent directory to sys.path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import engine, SessionLocal, Base
from backend.models import Concept, Question

def main():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "processed", "d1-ai-llm-foundation")
    concepts_file = os.path.join(data_dir, "concepts.json")
    questions_file = os.path.join(data_dir, "questions.json")
    
    # 1. Seed Concepts
    print("Seeding concepts...")
    if os.path.exists(concepts_file):
        with open(concepts_file, "r", encoding="utf-8") as f:
            concepts_data = json.load(f)
            for c_data in concepts_data:
                # Check if exists
                exists = db.query(Concept).filter(Concept.concept_id == c_data["concept_id"]).first()
                if not exists:
                    concept = Concept(
                        concept_id=c_data["concept_id"],
                        lecture_id=c_data["lecture_id"],
                        name=c_data["name"],
                        prereq_id=c_data.get("prereq_id")
                    )
                    db.add(concept)
            db.commit()
            print(f"Loaded concepts from {concepts_file}")
            
    # 2. Seed Questions
    print("Seeding questions...")
    if os.path.exists(questions_file):
        with open(questions_file, "r", encoding="utf-8") as f:
            questions_data = json.load(f)
            # Check if questions already seeded
            if not db.query(Question).first():
                for q_data in questions_data:
                    # Make sure the concept exists
                    concept = db.query(Concept).filter(Concept.concept_id == q_data["concept_id"]).first()
                    if concept:
                        question = Question(
                            concept_id=q_data["concept_id"],
                            stem=q_data["stem"],
                            options=q_data["options"],
                            answer_idx=q_data["answer_idx"],
                            explanation=q_data.get("explanation", ""),
                            source_slide=q_data.get("source_slide", 0)
                        )
                        db.add(question)
                db.commit()
                print(f"Loaded questions from {questions_file}")
            else:
                print("Questions already seeded. Skipping.")
                
    db.close()
    print("Done seeding questions!")

if __name__ == "__main__":
    main()
