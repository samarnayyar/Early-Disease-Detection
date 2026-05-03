from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os
import sys
import shap
import jwt
import datetime

# Add the parent directory to sys path so we can import the external database folder
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
sys.path.append(BASE_DIR)
MODELS_DIR = os.path.join(BASE_DIR, 'models')

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Register Auth & History Blueprints
from database.auth_routes import auth_bp
from database.history_routes import history_bp
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(history_bp, url_prefix='/api')

from database.db import predictions_collection
from database.auth_middleware import JWT_SECRET

# Default features used for median imputation if values are not provided
MODEL_DEFAULTS = {
    'diabetes': {
        'Pregnancies': 3.0, 'Glucose': 117.0, 'BloodPressure': 72.0, 'SkinThickness': 23.0,
        'Insulin': 30.0, 'BMI': 32.0, 'DiabetesPedigreeFunction': 0.37, 'Age': 29.0,
        'Glucose_BMI': 117.0 * 32.0, 'Age_BMI': 29.0 * 32.0, 'Preg_Age': 3.0 * 29.0
    },
    'heart': {
        'age': 54.0, 'sex': 1.0, 'trestbps': 130.0, 'chol': 240.0, 'fbs': 0.0, 'thalach': 150.0,
        'exang': 0.0, 'oldpeak': 1.0, 'ca': 0.0,
        'cp_2.0': 0.0, 'cp_3.0': 0.0, 'cp_4.0': 0.0,
        'restecg_1.0': 0.0, 'restecg_2.0': 0.0,
        'slope_2.0': 0.0, 'slope_3.0': 0.0,
        'thal_6.0': 0.0, 'thal_7.0': 0.0
    },
    'kidney': {
        'age': 51.0, 'bp': 80.0, 'sg': 1.020, 'al': 0.0, 'su': 0.0, 'rbc': 1.0, 'pc': 1.0, 'pcc': 0.0,
        'ba': 0.0, 'bgr': 121.0, 'bu': 36.0, 'sc': 1.2, 'sod': 138.0, 'pot': 4.4, 'hemo': 12.5,
        'pcv': 44.0, 'wbcc': 8400.0, 'rbcc': 4.7, 'htn': 0.0, 'dm': 0.0, 'cad': 0.0,
        'appet': 1.0, 'pe': 0.0, 'ane': 0.0
    },
    'lung': {
        'AGE': 65.0, 'PackHistory': 20.0, 'MWT1': 300.0, 'MWT2': 300.0, 'MWT1Best': 300.0,
        'FEV1': 1.5, 'FEV1PRED': 60.0, 'FVC': 2.5, 'FVCPRED': 70.0, 'CAT': 15.0, 'HAD': 10.0,
        'SGRQ': 40.0, 'gender': 1.0, 'smoking': 1.0, 'Diabetes': 0.0, 'muscular': 0.0, 'AtrialFib': 0.0
    }
}

models = {}

#loading model
def load_models():
    model_files = {
        'heart': 'Heart.pkl',
        'diabetes': 'Diabetes.pkl',
        'kidney': 'Kidney.pkl',
        'lung': 'Lung.pkl'
    }
    
    #reading pkl files from models
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

# final loading models on server
load_models()

def safe_float(val, default):
    """Safely convert value to float, or return default if empty/invalid."""
    if val is None or str(val).strip() == '':
        return float(default)
    try:
        return float(val)
    except (ValueError, TypeError):
        return float(default)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        disease = data.get('disease')
        
        # Optional: Identify if a user is logged in
        auth_header = request.headers.get('Authorization')
        user_id = None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(" ")[1]
            try:
                decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
                user_id = decoded.get("user_id")
            except Exception:
                pass # Ignore invalid tokens, just run prediction as guest

        if not disease or disease not in models:
            return jsonify({'error': f'Model for {disease} not found.'}), 404
            
        model = models[disease]
        
        #models using specific defaults
        input_dict = MODEL_DEFAULTS.get(disease, {}).copy()
        
        #Merging with user-provided parameters
        #Defaults here match MODEL_DEFAULTS, basically the medians
        if disease == 'diabetes':
            preg = safe_float(data.get('pregnancies'), 3)
            gluc = safe_float(data.get('glucose'), 117)
            bmi = safe_float(data.get('bmi'), 32.0)
            age = safe_float(data.get('age'), 29)
            
            input_dict.update({
                'Pregnancies': preg,
                'Glucose': gluc,
                'BloodPressure': safe_float(data.get('bp'), 72),
                'SkinThickness': safe_float(data.get('skinthickness'), 23.0),
                'Insulin': safe_float(data.get('insulin'), 30),
                'BMI': bmi,
                'DiabetesPedigreeFunction': safe_float(data.get('dpf'), 0.37),
                'Age': age,
                'Glucose_BMI': gluc * bmi,
                'Age_BMI': age * bmi,
                'Preg_Age': preg * age
            })
            
        elif disease == 'heart':
            cp_val = safe_float(data.get('cp'), 3.0)
            restecg_val = safe_float(data.get('restecg'), 1.0)
            slope_val = safe_float(data.get('slope'), 2.0)
            thal_val = safe_float(data.get('thal'), 3.0)

            input_dict.update({
                'age': safe_float(data.get('age'), 54),
                'sex': safe_float(data.get('sex'), 1.0),
                'trestbps': safe_float(data.get('trestbps'), 130.0),
                'chol': safe_float(data.get('chol'), 240.0),
                'fbs': safe_float(data.get('fbs'), 0.0),
                'thalach': safe_float(data.get('thalach'), 150.0),
                'exang': safe_float(data.get('exang'), 0.0),
                'oldpeak': safe_float(data.get('oldpeak'), 1.0),
                'ca': safe_float(data.get('ca'), 0.0),
                'cp_2.0': 1.0 if cp_val == 2.0 else 0.0,
                'cp_3.0': 1.0 if cp_val == 3.0 else 0.0,
                'cp_4.0': 1.0 if cp_val == 4.0 else 0.0,
                'restecg_1.0': 1.0 if restecg_val == 1.0 else 0.0,
                'restecg_2.0': 1.0 if restecg_val == 2.0 else 0.0,
                'slope_2.0': 1.0 if slope_val == 2.0 else 0.0,
                'slope_3.0': 1.0 if slope_val == 3.0 else 0.0,
                'thal_6.0': 1.0 if thal_val == 6.0 else 0.0,
                'thal_7.0': 1.0 if thal_val == 7.0 else 0.0
            })
            
        elif disease == 'kidney':
            input_dict.update({
                'age': safe_float(data.get('age'), 51),
                'bp': safe_float(data.get('bp'), 80),
                'sg': safe_float(data.get('sg'), 1.020),
                'al': safe_float(data.get('al'), 0.0),
                'su': safe_float(data.get('su'), 0.0),
                'rbc': safe_float(data.get('rbc'), 1.0),
                'pc': safe_float(data.get('pc'), 1.0),
                'pcc': safe_float(data.get('pcc'), 0.0),
                'ba': safe_float(data.get('ba'), 0.0),
                'bgr': safe_float(data.get('bgr'), 121.0),
                'bu': safe_float(data.get('bu'), 36.0),
                'sc': safe_float(data.get('sc'), 1.2),
                'sod': safe_float(data.get('sod'), 138.0),
                'pot': safe_float(data.get('pot'), 4.4),
                'hemo': safe_float(data.get('hemo'), 12.5),
                'pcv': safe_float(data.get('pcv'), 44.0),
                'wbcc': safe_float(data.get('wbcc'), 8400.0),
                'rbcc': safe_float(data.get('rbcc'), 4.7),
                'htn': safe_float(data.get('htn'), 0.0),
                'dm': safe_float(data.get('dm'), 0.0),
                'cad': safe_float(data.get('cad'), 0.0),
                'appet': safe_float(data.get('appet'), 1.0),
                'pe': safe_float(data.get('pe'), 0.0),
                'ane': safe_float(data.get('ane'), 0.0)
            })
            
        elif disease == 'lung':
            input_dict.update({
                'AGE': safe_float(data.get('age'), 65),
                'PackHistory': safe_float(data.get('smoking_history'), 20.0),
                'MWT1': safe_float(data.get('mwt1'), 300.0),
                'MWT2': safe_float(data.get('mwt2'), 300.0),
                'MWT1Best': safe_float(data.get('mwt1best'), 300.0),
                'FEV1': safe_float(data.get('fev1'), 1.5),
                'FEV1PRED': safe_float(data.get('fev1pred'), 60.0),
                'FVC': safe_float(data.get('fvc'), 2.5),
                'FVCPRED': safe_float(data.get('fvcpred'), 70.0),
                'CAT': safe_float(data.get('cat_score'), 15.0),
                'HAD': safe_float(data.get('had'), 10.0),
                'SGRQ': safe_float(data.get('sgrq'), 40.0),
                'gender': safe_float(data.get('gender'), 1.0),
                'smoking': safe_float(data.get('smoking'), 1.0),
                'Diabetes': safe_float(data.get('diabetes'), 0.0),
                'muscular': safe_float(data.get('muscular'), 0.0),
                'AtrialFib': safe_float(data.get('atrialfib'), 0.0)
            })
            
        #matching model paramaters
        input_df = pd.DataFrame([input_dict])
        if hasattr(model, 'feature_names_in_'):
            input_df = input_df[list(model.feature_names_in_)]
            
        # Track which inputs were actually provided
        provided_keys = [k.lower() for k, v in data.items() if v is not None and str(v).strip() != '']
        
        feature_mapping = {
            'pregnancies': ['Pregnancies'],
            'glucose': ['Glucose'],
            'bp': ['BloodPressure', 'bp', 'trestbps'],
            'skinthickness': ['SkinThickness'],
            'insulin': ['Insulin'],
            'bmi': ['BMI'],
            'dpf': ['DiabetesPedigreeFunction'],
            'age': ['Age', 'age', 'AGE'],
            'sex': ['sex', 'gender'],
            'cp': ['cp_1.0', 'cp_2.0', 'cp_3.0', 'cp_4.0', 'cp'],
            'chol': ['chol'],
            'fbs': ['fbs'],
            'thalach': ['thalach'],
            'exang': ['exang'],
            'oldpeak': ['oldpeak'],
            'restecg': ['restecg_0.0', 'restecg_1.0', 'restecg_2.0', 'restecg'],
            'slope': ['slope_1.0', 'slope_2.0', 'slope_3.0', 'slope'],
            'thal': ['thal_3.0', 'thal_6.0', 'thal_7.0', 'thal'],
            'ca': ['ca'],
            'smoking_history': ['PackHistory'],
            'smoking': ['smoking'],
            'fev1': ['FEV1'],
            'fvc': ['FVC'],
            'cat_score': ['CAT'],
            'diabetes': ['Diabetes', 'dm'],
            'gender': ['gender'],
            'sg': ['sg'],
            'al': ['al'],
            'su': ['su'],
            'bu': ['bu'],
            'sc': ['sc'],
            'bgr': ['bgr'],
            'hemo': ['hemo'],
            'htn': ['htn'],
            'dm': ['dm'],
            'pcv': ['pcv'],
            'sod': ['sod'],
            'pot': ['pot'],
            'rbcc': ['rbcc'],
            'wbcc': ['wbcc'],
            'pc': ['pc'],
            'cad': ['cad'],
            'appet': ['appet'],
            'pe': ['pe'],
            'ane': ['ane']
        }
        
        provided_model_features = set()
        for k in provided_keys:
            if k in feature_mapping:
                for mf in feature_mapping[k]:
                    provided_model_features.add(mf)
                    
        # Explicit interaction term logic for Diabetes
        if 'glucose' in provided_keys and 'bmi' in provided_keys:
            provided_model_features.add('Glucose_BMI')
        if 'age' in provided_keys and 'bmi' in provided_keys:
            provided_model_features.add('Age_BMI')
        if 'pregnancies' in provided_keys and 'age' in provided_keys:
            provided_model_features.add('Preg_Age')
                    
        #calculating risk probability
        prediction_val = model.predict(input_df)[0]
        try:
            if hasattr(model, "predict_proba"):
                probs = model.predict_proba(input_df)[0]
                if len(probs) == 3:
                    # For 3-class models (like Lung): 0=Low, 1=Moderate, 2=High
                    # Weighted sum: Mod risk adds 65% severity, High risk adds 100% severity
                    risk_score = int((probs[1] * 0.65 + probs[2] * 1.0) * 100)
                elif len(probs) == 5:
                    # For 5-class models (like Heart): 0=Healthy, 1,2,3,4=Heart Disease
                    # Sum all disease classes to get overall risk of any heart disease
                    risk_score = int(sum(probs[1:]) * 100)
                else:
                    risk_score = int(probs[-1] * 100)

            elif hasattr(model, "decision_function"):
                import numpy as np
                score = model.decision_function(input_df)[0]
                risk_score = int((1 / (1 + np.exp(-score))) * 100)

            else:
                risk_score = int(prediction_val * 100)

        except Exception as e:
            print("Risk calculation error:", e)
            risk_score = int(prediction_val * 100)
            
        status = 'High Risk' if risk_score >= 40 else 'Low Risk'
        display_disease = disease.replace('_', ' ').capitalize()
        
        if risk_score > 40:
            message = (f"Based on what you've shared, there appears to be a notable risk for {display_disease}. "
                       f"It's always best to get a professional check-up to understand these results better.")
        else:
            message = (f"Good news! Your results suggest no risk for {display_disease}. "
                       f"Keep taking good care of your health!")
            
        breakdown = []
        try:
            explainer = shap.Explainer(model)
            shap_values = explainer(input_df)
            
            if len(shap_values.values.shape) == 3:
                vals = shap_values.values[0, :, 1]
            else:
                vals = shap_values.values[0]
                
            for i, col in enumerate(input_df.columns):
                val = float(input_df[col].iloc[0])
                contrib = float(vals[i])
                is_provided = col in provided_model_features
                
                # Always include features the user explicitly provided, even if impact is 0
                if is_provided:
                    breakdown.append({
                        "feature": col,
                        "value": val,
                        "contribution": contrib,
                        "is_provided": is_provided
                    })
            breakdown.sort(key=lambda x: abs(x["contribution"]), reverse=True)
            breakdown = breakdown[:8] # Send top 8 impactful features
        except Exception as e:
            print("SHAP Error:", e)

        final_risk = max(0, min(100, risk_score))

        # Save to database if user is logged in
        if user_id:
            try:
                predictions_collection.insert_one({
                    "user_id": user_id,
                    "disease": disease,
                    "input_data": data,
                    "risk_score": final_risk,
                    "status": status,
                    "created_at": datetime.datetime.utcnow()
                })
            except Exception as e:
                print("DB Save Error:", e)

        return jsonify({
            'status': status,
            'riskScore': final_risk,
            'message': message,
            'disease': disease,
            'breakdown': breakdown
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
