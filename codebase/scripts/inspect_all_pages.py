import fitz
doc = fitz.open("D:/vinai/qn1304/data/vlearn-pack/slides/d1-slide-hackathon.pdf")
for i, page in enumerate(doc):
    text = page.get_text().strip()
    if text:
        last_line = text.split('\n')[-1]
        if last_line != "AI IN ACTION - HACKATHON":
            print(f"Page {i+1}: {last_line}")
