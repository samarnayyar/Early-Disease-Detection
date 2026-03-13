import json
import os

notebooks = ["Diabetes.ipynb", "Kidney.ipynb", "Lung.ipynb", "Heart.ipynb"]
models_dir = "models"

for nb in notebooks:
    nb_path = os.path.join(models_dir, nb)
    if not os.path.exists(nb_path):
        print(f"File not found: {nb_path}")
        continue
        
    print(f"\n======= {nb} =======")
    with open(nb_path, "r", encoding="utf-8") as f:
        notebook = json.load(f)
    
    for cell in notebook.get("cells", []):
        if cell.get("cell_type") == "code":
            source = "".join(cell.get("source", []))
            # Look for lines related to X = or features or dumping
            if "X =" in source or "joblib.dump" in source or "columns" in source or "StandardScaler" in source:
                print(source)
                print("-" * 20)
