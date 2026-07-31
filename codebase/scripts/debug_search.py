import json

with open("D:/vinai/qn1304/codebase/data/slide_db.json", "r", encoding="utf-8") as f:
    slide_db = json.load(f)

with open("D:/vinai/qn1304/codebase/scripts/search_out.txt", "w", encoding="utf-8") as out:
    out.write("--- SEARCH RESULTS ---\n")
    for page_id, content in slide_db.items():
        if "chiến lược" in content.lower():
            out.write(f"FOUND IN {page_id}:\n{content}\n")
            out.write("-"*40 + "\n")
