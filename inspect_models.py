import joblib
import os

models_dir = "models"
models = {
    'diabetes': 'diabetes_model.pkl',
    'kidney': 'kidney_model.pkl',
    'lung': 'lung_model.pkl',
    'heart': 'heart_model.pkl'
}

with open("model_info.txt", "w") as f:
    for name, filename in models.items():
        path = os.path.join(models_dir, filename)
        try:
            model = joblib.load(path)
            f.write(f"--- {name} ---\n")
            if hasattr(model, 'feature_names_in_'):
                f.write(f"Features: {list(model.feature_names_in_)}\n")
            if hasattr(model, 'steps'):
                f.write("Type: Pipeline\n")
                for s_name, s_obj in model.steps:
                    f.write(f"  Step: {s_name}\n")
            else:
                f.write(f"Type: {type(model).__name__}\n")
            f.write("\n")
        except Exception as e:
            f.write(f"Error loading {name}: {e}\n\n")
