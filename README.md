# Wellcore - Early Disease Detection Platform

Wellcore is a modern, AI-powered health screening platform designed to detect potential early-stage diseases including Diabetes, Heart Disease, Kidney Disease, and Lung Disease. Built for medical students and researchers, it provides transparent risk assessments using SHAP (SHapley Additive exPlanations) to explain the factors driving each prediction.

![Wellcore Dashboard](https://raw.githubusercontent.com/samarnayyar/Early-Disease-Detection/main/frontend/public/dashboard.png)

## 🚀 Features

- **Multi-Disease Screening**: Specialized modules for Diabetes, Heart Disease, Lung Disease, and Chronic Kidney Disease.
- **Explainable AI (XAI)**: Detailed clinical factor reports showing exactly which parameters (age, glucose, BP, etc.) are increasing or lowering the risk score.
- **Smart Assessment Forms**: Contextual tooltips providing medical ranges and definitions for every clinical input.
- **History Tracking**: Secure user accounts to save and review past diagnostic results.
- **Modern UI/UX**: A professional brownish-tan theme designed for clinical focus and visual comfort.
- **Responsive Design**: Works seamlessly across desktop and mobile devices.

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Flask (Python), Scikit-learn, SHAP.
- **Database**: MongoDB Atlas.
- **Machine Learning**: Multiple trained models for binary and multi-class disease classification.

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js & npm
- MongoDB Atlas Account

### 1. Clone the Repository
```bash
git clone https://github.com/samarnayyar/Early-Disease-Detection.git
cd Early-Disease-Detection
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

## 🧪 Machine Learning Models

The platform utilizes four distinct machine learning models:
1. **Heart Disease**: Multi-class classification (Stages 0-4).
2. **Diabetes**: Binary classification (Pima Indians Dataset).
3. **Lung Disease**: Multi-class staging for respiratory conditions.
4. **Kidney Disease**: Binary classification for CKD.

## ⚠️ Disclaimer
Wellcore is an educational and decision-support tool. It is **not** a replacement for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for clinical assessments.

## 📄 License
This project is licensed under the MIT License.