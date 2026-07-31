from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from pathlib import Path
import json
import re
from app.core.config import DATA_PACK_DIR
from app.pipeline.pdf_processor import extract_slide_ranges, update_knowledge_md, extract_pages_content
from app.core.llm_client import LLMClient # Assuming this is the Gemini client

router = APIRouter(prefix="/api/upload", tags=["upload"])

UPLOAD_DIR = DATA_PACK_DIR / "uploads"
KNOWLEDGE_FILE = DATA_PACK_DIR / "knowledge.md"

# Global state to track enrichment status. In production, use Redis or a database.
ENRICHMENT_STATUS = {
    "is_running": False,
    "last_updated": None
}

def background_enrich_knowledge(weak_sections: list[str], pdf_filename: str):
    """
    Background task to scan PDF for text and visual content and enrich knowledge.md
    """
    global ENRICHMENT_STATUS
    ENRICHMENT_STATUS["is_running"] = True
    try:
        pdf_path = UPLOAD_DIR / pdf_filename
        if not pdf_path.exists():
            ENRICHMENT_STATUS["is_running"] = False
            return

        # 1. Find page ranges for the weak sections
        ranges = extract_slide_ranges(str(pdf_path))

        enrichments = []
        for section in weak_sections:
            # Find the range that matches the section title (loose match)
            matching_range = next((r for r in ranges if section.lower() in r["title"].lower()), None)
            if matching_range:
                # Extract all text (Title + Bullets) from the PDF pages
                content = extract_pages_content(str(pdf_path), matching_range["start_page"], matching_range["end_page"])

                # Call AI to find/describe images, charts, formulas based on the text
                prompt = (
                    f"You are an educational assistant. I will provide you with the text content of a few slides "
                    f"belonging to the section '{section}'.\n\n"
                    f"Content:\n{content}\n\n"
                    f"Based on this content and the typical structure of a presentation, please describe any "
                    f"likely images, diagrams, charts, or complex formulas that would be present in these slides "
                    f"to help a student understand the concepts better. Be specific about what the visual would show."
                )

                visual_insights = "No specific visual insights found."
                try:
                    llm = LLMClient()
                    visual_insights = llm.generate(prompt)
                except Exception as e:
                    print(f"AI enrichment failed for {section}: {e}")

                # Combine raw text and AI visual insights
                enrichments.append(
                    f"### Detailed Knowledge for {section}\n"
                    f"**Slide Text Content:**\n{content}\n\n"
                    f"**Visual/Formula Insights:**\n{visual_insights}\n"
                )

        if enrichments:
            with open(KNOWLEDGE_FILE, "a", encoding="utf-8") as f:
                f.write("\n\n## AI Enriched Knowledge (Weak Sections)\n")
                f.write("\n".join(enrichments))

    except Exception as e:
        print(f"Background enrichment failed: {e}")
    finally:
        ENRICHMENT_STATUS["is_running"] = False

@router.post("/pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as buffer:
        buffer.write(await file.read())

    try:
        ranges = extract_slide_ranges(str(file_path))
        update_knowledge_md(str(KNOWLEDGE_FILE), ranges)

        # --- New Logic: Group slides into Learning Units using LLM ---
        titles = [r["title"] for r in ranges]
        prompt = (
            "You are analyzing a lecture.\n\n"
            "Here are all slide titles in order:\n"
            f"{titles}\n\n"
            "Your task:\n"
            "1. Divide this lecture into major learning units.\n"
            "2. Assign each slide to one learning unit.\n"
            "3. Give each learning unit a concise name.\n"
            "4. Return JSON only. Ví dụ output: [\n"
            "  {\n"
            "    \"unit\": \"Transformer Overview\",\n"
            "    \"slides\": [1,2]\n"
            "  },\n"
            "  {\n"
            "    \"unit\": \"Encoder\",\n"
            "    \"slides\": [3,4,5]\n"
            "  },\n"
            "  {\n"
            "    \"unit\": \"Self Attention\",\n"
            "    \"slides\": [6,7,8,9]\n"
            "  }\n"
            "]"
        )

        llm = LLMClient()
        response_text = llm.generate_text(prompt)

        # Clean JSON response from LLM (remove markdown markers)
        json_match = re.search(r"\[.*\]", response_text, re.DOTALL)
        if json_match:
            learning_units = json.loads(json_match.group())
        else:
            learning_units = []

        return {
            "message": "PDF uploaded and processed successfully",
            "filename": file.filename,
            "ranges": ranges,
            "learning_units": learning_units,
            "knowledge_path": str(KNOWLEDGE_FILE)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@router.post("/enrich")
async def enrich_knowledge(
    background_tasks: BackgroundTasks,
    payload: dict # Expected: {"weak_sections": ["Section 1", ...], "pdf_filename": "file.pdf"}
):
    weak_sections = payload.get("weak_sections", [])
    pdf_filename = payload.get("pdf_filename", "")

    if not pdf_filename:
        raise HTTPException(status_code=400, detail="pdf_filename is required")

    background_tasks.add_task(background_enrich_knowledge, weak_sections, pdf_filename)
    return {"message": "Enrichment process started in background"}

@router.get("/enrich-status")
async def get_enrichment_status():
    return ENRICHMENT_STATUS
