import fitz  # PyMuPDF
from typing import List, Tuple, Dict
import os

def extract_slide_ranges(pdf_path: str) -> List[Dict]:
    """
    Extracts main slide sections and their page ranges.
    A section starts when a large header is found and lasts until the next large header.
    """
    doc = fitz.open(pdf_path)
    sections = []
    current_section = None

    for page_num in range(1, len(doc) + 1):
        page = doc[page_num - 1]
        blocks = page.get_text("dict")["blocks"]

        # Find the largest font size on this page
        max_size = 0
        best_text = ""
        for b in blocks:
            if "lines" in b:
                for line in b["lines"]:
                    for span in line["spans"]:
                        if span["size"] > max_size:
                            max_size = span["size"]
                            best_text = span["text"].strip()

        # Heuristic: If font size is significantly large (e.g., >= 20), it's a new section
        if max_size >= 20 and best_text:
            if current_section:
                current_section["end_page"] = page_num - 1
                sections.append(current_section)

            current_section = {
                "title": best_text,
                "start_page": page_num,
                "end_page": page_num
            }
        elif current_section:
            # Extend the current section
            current_section["end_page"] = page_num

    if current_section:
        sections.append(current_section)

    doc.close()
    return sections

def update_knowledge_md(knowledge_path: str, slide_ranges: List[Dict]):
    """
    Writes the extracted slide metadata with ranges to knowledge.md.
    """
    with open(knowledge_path, "w", encoding="utf-8") as f:
        f.write("# Knowledge Base\n\n")
        f.write("## Slide Sections\n")
        for s in slide_ranges:
            f.write(f"- {s['title']} (Pages {s['start_page']}-{s['end_page']})\n")

def extract_pages_content(pdf_path: str, start_page: int, end_page: int) -> str:
    """
    Extracts all text from a range of pages to provide context for AI.
    """
    doc = fitz.open(pdf_path)
    content = []
    for p in range(start_page, end_page + 1):
        if p > len(doc): break
        page = doc[p-1]
        content.append(f"--- Page {p} ---\n{page.get_text()}")
    doc.close()
    return "\n\n".join(content)
