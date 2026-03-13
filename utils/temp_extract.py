import json

with open("Heart.ipynb", "r", encoding="utf-8") as f:
    notebook = json.load(f)

with open("extracted.py", "w", encoding="utf-8") as out:
    for cell in notebook.get("cells", []):
        if cell.get("cell_type") == "code":
            out.write("".join(cell.get("source", [])) + "\n")
            out.write("\n# " + "-"*40 + "\n\n")
