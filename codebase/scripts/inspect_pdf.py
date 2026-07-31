import fitz
doc = fitz.open("D:/vinai/qn1304/data/vlearn-pack/slides/d1-slide-hackathon.pdf")
text = doc[5].get_text() # Try page index 5
with open("D:/vinai/qn1304/codebase/data/page5_dump.txt", "w", encoding="utf-8") as f:
    f.write(text)
