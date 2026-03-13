from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
# Enable CORS for the frontend Vite server
CORS(app, resources={r"/*": {"origins": "*"}})

# Directory where models are stored
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')

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
                print(f"Successfully loaded {key} model from {filename}")
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
        print("Received data from frontend:", data)
        
        disease = data.get('disease')
        if not disease:
            return jsonify({'error': 'No disease type specified'}), 400
            
        if disease not in models:
            return jsonify({'error': f'Model for {disease} is not available on the server.'}), 500
            
        model = models[disease]
        
        # Prepare feature columns based on what the specific model expects
        # We use data from frontend if available, otherwise fallback to medians/defaults
        
        if disease == 'heart':
            # Features: age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal
            input_df = pd.DataFrame([{
                'age': float(data.get('age', 54)),
                'sex': float(data.get('sex', 1.0)),
                'cp': float(data.get('cp', 4.0)),
                'trestbps': float(data.get('trestbps', 130)),
                'chol': float(data.get('chol', 223)),
                'fbs': float(data.get('fbs', 0.0)),
                'restecg': float(data.get('restecg', 0.0)),
                'thalach': float(data.get('thalach', 140)),
                'exang': float(data.get('exang', 0.0)),
                'oldpeak': float(data.get('oldpeak', 0.5)),
                'slope': float(data.get('slope', 2.0)),
                'ca': float(data.get('ca', 0.0)),
                'thal': float(data.get('thal', 6.0))
            }])
            
        elif disease == 'diabetes':
            # Features: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age
            input_df = pd.DataFrame([{
                'Pregnancies': float(data.get('pregnancies', 3)),
                'Glucose': float(data.get('glucose', 117)),
                'BloodPressure': float(data.get('bp', 72)),
                'SkinThickness': float(data.get('skin', 23)),
                'Insulin': float(data.get('insulin', 30)),
                'BMI': float(data.get('bmi', 32)),
                'DiabetesPedigreeFunction': float(data.get('dpf', 0.37)),
                'Age': float(data.get('age', 29))
            }])
            
        elif disease == 'kidney':
            # Features: age, bp, sg, al, su, rbc, pc, pcc, ba, bgr, bu, sc, sod, pot, hemo, pcv, wbcc, rbcc, htn, dm, cad, appet, pe, ane
            input_df = pd.DataFrame([{
                'age': float(data.get('age', 51)),
                'bp': float(data.get('bp', 80)),
                'sg': float(data.get('sg', 1.02)),
                'al': float(data.get('al', 0.0)),
                'su': float(data.get('su', 0.0)),
                'rbc': float(data.get('rbc', 1.0)),
                'pc': float(data.get('pc', 1.0)),
                'pcc': float(data.get('pcc', 0.0)),
                'ba': float(data.get('ba', 0.0)),
                'bgr': float(data.get('bgr', 121)),
                'bu': float(data.get('bu', 42)),
                'sc': float(data.get('sc', 1.3)),
                'sod': float(data.get('sod', 138)),
                'pot': float(data.get('pot', 4.4)),
                'hemo': float(data.get('hemo', 12.5)),
                'pcv': float(data.get('pcv', 40)),
                'wbcc': float(data.get('wbcc', 8000)),
                'rbcc': float(data.get('rbcc', 4.8)),
                'htn': float(data.get('htn', 0.0)),
                'dm': float(data.get('dm', 0.0)),
                'cad': float(data.get('cad', 0.0)),
                'appet': float(data.get('appet', 1.0)),
                'pe': float(data.get('pe', 0.0)),
                'ane': float(data.get('ane', 0.0))
            }])
            
        elif disease == 'lung':
            # Features: AGE, PackHistory, COPDSEVERITY, MWT1, MWT2, MWT1Best, FEV1, FEV1PRED, FVC, FVCPRED, CAT, HAD, SGRQ, AGEquartiles, gender, smoking, Diabetes, muscular, hypertension, AtrialFib, IHD
            input_df = pd.DataFrame([{
                'AGE': float(data.get('age', 65)),
                'PackHistory': float(data.get('smoking_history', 20)),
                'COPDSEVERITY': float(data.get('copd_severity', 2)),
                'MWT1': float(data.get('mwt1', 300)),
                'MWT2': float(data.get('mwt2', 300)),
                'MWT1Best': float(data.get('mwt_best', 300)),
                'FEV1': float(data.get('fev1', 1.5)),
                'FEV1PRED': float(data.get('fev1_pred', 60)),
                'FVC': float(data.get('fvc', 2.5)),
                'FVCPRED': float(data.get('fvc_pred', 70)),
                'CAT': float(data.get('cat_score', 15)),
                'HAD': float(data.get('had', 10)),
                'SGRQ': float(data.get('sgrq', 40)),
                'AGEquartiles': float(data.get('age_q', 3)),
                'gender': float(data.get('gender', 1)),
                'smoking': float(data.get('smoking', 1)),
                'Diabetes': float(data.get('diabetes', 0)),
                'muscular': float(data.get('muscular', 0)),
                'hypertension': float(data.get('hypertension', 0)),
                'AtrialFib': float(data.get('atrial_fib', 0)),
                'IHD': float(data.get('ihd', 0))
            }])
        
        # Predict using the model
        prediction = model.predict(input_df)[0]
        
        # Calculate risk score (probability)
        try:
            if hasattr(model, 'predict_proba'):
                risk_prob = model.predict_proba(input_df)[0][1]
                risk_score = int(risk_prob * 100)
            else:
                risk_score = 90 if prediction == 1 else 10
        except Exception as e:
            print(f"Probability estimation failed: {e}")
            risk_score = 90 if prediction == 1 else 10
            
        # Format response
        if prediction == 1:
            status = 'High Risk'
            message = f'Based on the provided health parameters, the model indicates a high level of {disease.replace("_", " ")} risk. Please consult a medical professional.'
        else:
            status = 'Low Risk'
            message = f'Your health parameters reflect a low {disease.replace("_", " ")} risk according to the model. Continue maintaining a healthy lifestyle.'
            
        return jsonify({
            'status': status,
            'riskScore': risk_score,
            'message': message,
            'disease': disease
        })

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
