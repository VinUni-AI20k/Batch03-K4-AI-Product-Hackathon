import json
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
res = converter.convert("temp_uploads/d2-slide-hackathon.pdf")
doc_dict = res.document.export_to_dict()

with open("test_out.json", "w", encoding="utf-8") as f:
    json.dump(doc_dict, f, indent=2, ensure_ascii=False)
