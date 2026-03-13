from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
# Enable CORS for the frontend Vite server
CORS(app, resources={r"/*": {"origins": "*"}})

# Directory where models are stored
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# --- Background Model Configurations (Fixed/Static Parameters) ---
# These are the parameters that the model requires but are not part of our 
# simplified UI. We use stable medians to ensure model compatibility.
MODEL_DEFAULTS = {
    'diabetes': {
        'SkinThickness': 23.0,
        'DiabetesPedigreeFunction': 0.37
    },
    'heart': {
        'trestbps': 130.0,
        'fbs': 0.0,
        'restecg': 1.0,
        'oldpeak': 1.0,
        'slope': 2.0,
        'ca': 0.0,
        'thal': 3.0
    },
    'kidney': {
        'al': 0.0, 'su': 0.0, 'rbc': 1.0, 'pc': 1.0, 'pcc': 0.0, 'ba': 0.0,
        'bgr': 121.0, 'sod': 138.0, 'pot': 4.4, 'pcv': 44.0, 'wbcc': 8400.0, 
        'rbcc': 4.7, 'htn': 0.0, 'dm': 0.0, 'cad': 0.0, 'appet': 1.0, 'pe': 0.0, 'ane': 0.0
    },
    'lung': {
        'MWT1': 300.0, 'MWT2': 300.0, 'MWT1Best': 300.0, 'FEV1PRED': 60.0,
        'FVCPRED': 70.0, 'HAD': 10.0, 'SGRQ': 40.0, 'AGEquartiles': 3.0, 
        'gender': 1.0, 'smoking': 1.0, 'Diabetes': 0.0, 'muscular': 0.0, 
        'hypertension': 0.0, 'AtrialFib': 0.0, 'IHD': 0.0
    }
}

# Dictionary to store loaded models
models = {}

def load_models():
    """Load all 4 models into memory."""
    model_files = {
        'heart': 'heart_model.pkl',
        'diabetes': 'diabetes_model.pkl',
        'kidney': 'kidney_model.pkl',
        'lung': 'lung_model.pkl'
    }
    
    for key, filename in model_files.items():
        path = os.path.join(MODELS_DIR, filename)
        try:
            if os.path.exists(path):
                models[key] = joblib.load(path)
                print(f"Successfully loaded {key} model.")
            else:
                print(f"Warning: Model file {filename} not found at {path}")
        except Exception as e:
            print(f"Error loading {key} model: {e}")

# Initial load
load_models()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        disease = data.get('disease')
        
        if not disease or disease not in models:
            return jsonify({'error': f'Model for {disease} not found.'}), 404
            
        model = models[disease]
        
        # 1. Start with the hidden defaults for this disease
        input_dict = MODEL_DEFAULTS.get(disease, {}).copy()
        
        # 2. Add the User-Provided Important Parameters
        if disease == 'diabetes':
            input_dict.update({
                'Pregnancies': float(data.get('pregnancies', 3)),
                'Glucose': float(data.get('glucose', 117)),
                'BloodPressure': float(data.get('bp', 72)),
                'Insulin': float(data.get('insulin', 30)),
                'BMI': float(data.get('bmi', 32.0)),
                'Age': float(data.get('age', 29))
            })
            
        elif disease == 'heart':
            input_dict.update({
                'age': float(data.get('age', 54)),
                'sex': float(data.get('sex', 1.0)),
                'cp': float(data.get('cp', 3.0)),
                'chol': float(data.get('chol', 240.0)),
                'thalach': float(data.get('thalach', 150.0)),
                'exang': float(data.get('exang', 0.0))
            })
            
        elif disease == 'kidney':
            input_dict.update({
                'age': float(data.get('age', 51)),
                'bp': float(data.get('bp', 80)),
                'sg': float(data.get('sg', 1.020)),
                'bu': float(data.get('bu', 36.0)),
                'sc': float(data.get('sc', 1.2)),
                'hemo': float(data.get('hemo', 12.5))
            })
            
        elif disease == 'lung':
            input_dict.update({
                'AGE': float(data.get('age', 65)),
                'PackHistory': float(data.get('smoking_history', 20.0)),
                'COPDSEVERITY': float(data.get('copd_severity', 2.0)),
                'FEV1': float(data.get('fev1', 1.5)),
                'FVC': float(data.get('fvc', 2.5)),
                'CAT': float(data.get('cat_score', 15.0))
            })
            
        # Create DataFrame and ensure column order matches model
        input_df = pd.DataFrame([input_dict])
        if hasattr(model, 'feature_names_in_'):
            input_df = input_df[list(model.feature_names_in_)]
            
        # Prediction Logic
        # For lung (multi-class severity), >0 is High Risk. For others, 1 is High Risk.
        prediction_val = model.predict(input_df)[0]
        
        # Risk Score (Confidence) calculation
        try:
            if hasattr(model, 'predict_proba'):
                probs = model.predict_proba(input_df)[0]
                # Probability of "Not Healthy" is 1 minus prob of class 0
                risk_score = int((1.0 - probs[0]) * 100)
            else:
                risk_score = 90 if prediction_val > 0 else 10
        except:
            risk_score = 90 if prediction_val > 0 else 10
            
        # Format the human-readable response
        status = 'High Risk' if prediction_val > 0 else 'Low Risk'
        display_disease = disease.replace('_', ' ').capitalize()
        
        if prediction_val > 0:
            message = (f"Based on what you've shared, there appears to be a notable risk for {display_disease}. "
                       f"It's always best to get a professional check-up to understand these results better.")
        else:
            message = (f"Good news! Your results suggest a lower risk for {display_disease}. "
                       f"Keep taking good care of your health!")
            
        return jsonify({
            'status': status,
            'riskScore': max(0, min(100, risk_score)),
            'message': message,
            'disease': disease
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
