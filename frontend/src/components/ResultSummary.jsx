import React from 'react';
import { AlertCircle, CheckCircle2, TrendingUp, TrendingDown, ArrowRight, ActivitySquare } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURE_LABELS = {
  'cp_2.0': 'Chest Pain (Type 2)',
  'cp_3.0': 'Chest Pain (Type 3)',
  'cp_4.0': 'Chest Pain (Type 4 – Asymptomatic)',
  'restecg_1.0': 'Resting ECG (ST-T Abnormality)',
  'restecg_2.0': 'Resting ECG (LVH)',
  'slope_2.0': 'ST Slope (Flat)',
  'slope_3.0': 'ST Slope (Downsloping)',
  'thal_6.0': 'Thalassemia (Fixed Defect)',
  'thal_7.0': 'Thalassemia (Reversible Defect)',
  'age': 'Age', 'Age': 'Age', 'AGE': 'Age',
  'thalach': 'Max Heart Rate', 'trestbps': 'Resting BP',
  'chol': 'Cholesterol', 'fbs': 'Fasting Blood Sugar',
  'exang': 'Exercise Angina', 'oldpeak': 'ST Depression',
  'sex': 'Gender', 'ca': 'Major Vessels',
  'Glucose': 'Glucose', 'BMI': 'BMI', 'BloodPressure': 'Blood Pressure',
  'Insulin': 'Insulin', 'SkinThickness': 'Skin Thickness',
  'DiabetesPedigreeFunction': 'Diabetes Pedigree', 'Pregnancies': 'Pregnancies',
  'Glucose_BMI': 'Glucose × BMI', 'Age_BMI': 'Age × BMI', 'Preg_Age': 'Pregnancies × Age',
  'AGE': 'Age', 'PackHistory': 'Smoking History', 'FEV1': 'FEV1',
  'FVC': 'FVC', 'CAT': 'CAT Score', 'Diabetes': 'Has Diabetes', 'gender': 'Gender',
  'bp': 'Blood Pressure', 'sg': 'Specific Gravity', 'al': 'Albumin', 'su': 'Sugar',
  'bu': 'Blood Urea', 'sc': 'Serum Creatinine', 'bgr': 'Blood Glucose',
  'hemo': 'Hemoglobin', 'pcv': 'Packed Cell Volume', 'sod': 'Sodium', 'pot': 'Potassium',
  'rbcc': 'RBC Count', 'wbcc': 'WBC Count', 'htn': 'Hypertension', 'dm': 'Diabetes Mellitus',
  'cad': 'Coronary Artery Disease', 'appet': 'Appetite', 'pe': 'Pedal Edema', 'ane': 'Anemia',
};

const featureLabel = (feature) =>
  FEATURE_LABELS[feature] || feature.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');

const valueLabel = (feature, value) => {
  if (/_\d+\.0$/.test(feature)) return value === 1.0 ? 'Present' : 'Absent';
  if (['sex', 'gender'].includes(feature)) return value === 1.0 ? 'Male' : 'Female';
  if (['exang', 'fbs', 'htn', 'dm', 'cad', 'pe', 'ane', 'Diabetes'].includes(feature)) return value === 1.0 ? 'Yes' : 'No';
  return value.toFixed(1);
};

export default function ResultSummary({ result, onReset }) {
  const getRiskSummary = (status, score) => {
    if (status === 'Low Risk') {
      return "Everything looks good! Your numbers are well within the healthy range, so there's no immediate cause for concern. Keep up the healthy habits!";
    } else if (score < 60) {
      return "We found the results okay. While you're not in any risk zone yet, it might be a good idea to watch as well as stay fit and fine.";
    } else {
      return "Our system found some patterns that are often seen in people with this condition. Because some of your numbers are on the higher side, we really recommend talking to a doctor soon just to be safe.";
    }
  };

  const isHighRisk = result?.status === 'High Risk';

  const getShapExplanation = (breakdown) => {
    if (!breakdown || breakdown.length === 0) return null;
    
    const AGE_FEATURES = ['age', 'Age', 'AGE'];

    const sorted = [...breakdown].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
    // Exclude age from text bullets — it's capped and not actionable
    const topFactors = sorted.filter(item => !AGE_FEATURES.includes(item.feature)).slice(0, 6);
    
    const riskIncreasers = topFactors.filter(item => item.contribution > 0);
    const riskDecreasers = topFactors.filter(item => item.contribution < 0);
    
    return (
      <div className="space-y-6">
        <p className="text-neutral-700 leading-relaxed text-lg font-medium">
          Based on your clinical parameters, your risk profile is influenced by specific factors. Here is a detailed breakdown of what is currently driving your assessment:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {riskIncreasers.length > 0 && (
            <div className="space-y-3 bg-neutral-200/50 p-6 rounded-lg border border-neutral-300/30">
              <h4 className="text-red-600 font-bold uppercase tracking-wider text-sm flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" /> Factors Increasing Risk
              </h4>
              <ul className="space-y-3">
                {riskIncreasers.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-neutral-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 mr-3 shrink-0"></span>
                    <span>Your <strong>{featureLabel(item.feature)}</strong> ({valueLabel(item.feature, item.value)}) is a significant factor in your current risk assessment.</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {riskDecreasers.length > 0 && (
            <div className="space-y-3 bg-neutral-200/50 p-6 rounded-lg border border-neutral-300/30">
              <h4 className="text-emerald-600 font-bold uppercase tracking-wider text-sm flex items-center">
                <TrendingDown className="h-5 w-5 mr-2" /> Factors Lowering Risk
              </h4>
              <ul className="space-y-3">
                {riskDecreasers.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-neutral-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 mr-3 shrink-0"></span>
                    <span>Your <strong>{featureLabel(item.feature)}</strong> ({valueLabel(item.feature, item.value)}) is currently contributing to a lower relative risk in this assessment.</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-neutral-900 tracking-tight">Assessment Results</h2>
        <p className="text-lg font-medium text-neutral-600">Detailed breakdown of your clinical parameters</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Risk Analysis Card */}
        <div className="bg-neutral-100/60 p-8 rounded-md border border-neutral-300/50 relative overflow-hidden shadow-xl">
          <div className={`absolute top-0 left-0 w-full h-2 ${isHighRisk ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
          
          <div className="space-y-8 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-neutral-600 uppercase tracking-wider">Calculated Level</span>
              <span className={`px-4 py-1.5 rounded-md text-sm font-black uppercase tracking-wide ${isHighRisk ? 'bg-red-600/10 text-red-600 border border-red-600/20' : 'bg-emerald-600/10 text-emerald-600 border border-emerald-600/20'}`}>
                {result?.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="relative h-6 w-full bg-neutral-200 rounded-full overflow-hidden flex p-1 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                <div className="h-full bg-emerald-500 w-[40%] rounded-l-full"></div>
                <div className="h-full bg-yellow-500 w-[20%]"></div>
                <div className="h-full bg-red-500 w-[40%] rounded-r-full"></div>

                <motion.div
                  className="absolute top-0 bottom-0 w-3 bg-[#f4f0e6] border border-neutral-300 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10"
                  initial={{ left: "0%", transform: 'translateX(-50%)' }}
                  animate={{ left: `${result?.riskScore}%`, transform: 'translateX(-50%)' }}
                  transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.2 }}
                ></motion.div>
              </div>
              <div className="flex justify-between text-xs font-black text-neutral-500 uppercase tracking-widest px-2">
                <span>Low</span>
                <span>Mod</span>
                <span>High</span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <div className="text-7xl font-black text-neutral-900 tracking-tighter">
                {result?.riskScore}<span className="text-3xl text-neutral-500 ml-1">%</span>
              </div>
              <p className="text-sm font-bold text-neutral-600 uppercase tracking-widest">Probability Score</p>
            </div>
            
            <div className="bg-neutral-200/50 p-5 rounded-lg border border-neutral-300/50">
               <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-md shrink-0 ${isHighRisk ? 'bg-red-600/10 text-red-600' : 'bg-emerald-600/10 text-emerald-600'}`}>
                    {isHighRisk ? <AlertCircle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">Clinical Summary</h3>
                    <p className="text-sm font-medium text-neutral-600 leading-relaxed">
                      {getRiskSummary(result?.status, result?.riskScore)}
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Feature Breakdown Card */}
        <div className="bg-neutral-100/60 p-8 rounded-md border border-neutral-300/50 shadow-xl flex flex-col h-full">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-neutral-900">Parameter Contributions</h3>
            <p className="text-sm font-medium text-neutral-600 mt-1">Factors driving your risk score (SHAP Analysis)</p>
          </div>
          
          <div className="flex-1 space-y-4">
            {result?.breakdown && result.breakdown.length > 0 ? (() => {
              const totalAbsShap = result.breakdown.reduce((sum, item) => sum + Math.abs(item.contribution), 0);
              return (
              <>
                <div className="space-y-3">
                  {result.breakdown.map((item, idx) => {
                    const isRiskFactor = item.contribution > 0;
                    const relativeImpact = totalAbsShap > 0 ? (Math.abs(item.contribution) / totalAbsShap * 100) : 0;
                    return (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-md bg-neutral-200/50 border border-neutral-300/30">
                        <div className="flex flex-col min-w-0 flex-1 mr-4">
                          <span className="text-sm font-bold text-neutral-800 capitalize truncate">
                            {featureLabel(item.feature)}
                          </span>
                          <span className="text-xs font-medium text-neutral-500">Value: {valueLabel(item.feature, item.value)}</span>
                        </div>
                        <div className={`flex items-center space-x-2 font-black shrink-0 ${isRiskFactor ? 'text-red-600' : 'text-emerald-600'}`}>
                          <span>{isRiskFactor ? '↑' : '↓'} {relativeImpact.toFixed(0)}% influence</span>
                          {isRiskFactor ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {/* Explanation moved to bottom section */}
              </>
              )
            })() : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-3 p-8 border-2 border-dashed border-neutral-300 rounded-lg">
                <ActivitySquare className="h-10 w-10 opacity-50" />
                <p className="text-sm font-medium text-center">Detailed parameter breakdown is not available for this assessment.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Width AI Insights Card */}
      {result?.breakdown && result.breakdown.length > 0 && (
        <div className="bg-neutral-100/60 border border-neutral-300/50 p-8 md:p-10 rounded-md shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-neutral-500"></div>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-neutral-900 tracking-tight flex items-center">
              <ActivitySquare className="h-6 w-6 mr-3 text-neutral-500" /> Clinical Risk Factors Report
            </h3>
          </div>
          {getShapExplanation(result.breakdown)}
        </div>
      )}

      <div className="pt-4">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-lg bg-neutral-100 hover:bg-neutral-700 border border-neutral-300 text-lg font-bold text-neutral-900 transition-all transform hover:-translate-y-1"
        >
          <span>Start New Assessment</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
