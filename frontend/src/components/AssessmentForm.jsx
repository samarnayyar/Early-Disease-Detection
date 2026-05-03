import React from 'react';
import { DISEASES } from '../constants/diseases';

export default function AssessmentForm({ selectedDisease, formData, onInputChange, onSubmit }) {
  const disease = DISEASES.find(d => d.id === selectedDisease);
  const Icon = disease?.icon;

  const inputClass = "w-full px-4 py-3 text-base rounded-lg bg-[#f4f0e6] border border-neutral-300 text-neutral-900 focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 outline-none transition-all placeholder:text-neutral-500";
  const labelClass = "block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center space-x-5 pb-6 border-b border-neutral-300/50">
        <div className={`p-4 rounded-lg ${disease?.bg} shadow-lg flex items-center justify-center border border-black/10`}>
          {disease?.image ? (
            <img src={disease?.image} alt={disease?.name} className="h-16 w-16 object-contain drop-shadow-xl" />
          ) : (
            Icon && <Icon className={`h-12 w-12 ${disease?.color}`} />
          )}
        </div>
        <div>
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">{disease?.name} Analysis</h2>
          <p className="text-sm font-medium text-neutral-600 mt-1">Provide clinical measurements below</p>
        </div>
      </div>

      <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-4 flex items-start space-x-3 shadow-sm">
        <div className="p-2 bg-neutral-200 rounded-lg shrink-0">
          <svg className="w-5 h-5 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-neutral-900">Clinical Guidelines</p>
          <p className="text-xs font-medium text-neutral-700 mt-0.5 leading-relaxed">
            Please enter any information you are aware of. For a valid assessment, you must provide a minimum of <strong>3 features</strong> (including your Age). Missing fields will be securely estimated using clinical baselines.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Parameters */}
          <div>
            <label className={labelClass}>
              Patient Age <span className="text-red-400 ml-1">*</span>
            </label>
            <input required type="number" min="0" name="age" value={formData.age || ''} onChange={onInputChange} className={inputClass} placeholder="e.g. 45" />
          </div>

          {/* Diabetes specific inputs */}
          {selectedDisease === 'diabetes' && (
            <>
              <div>
                <label className={labelClass}>Glucose Level <span className="text-red-400 ml-1">*</span></label>
                <input required type="number" min="0" name="glucose" value={formData.glucose || ''} onChange={onInputChange} className={inputClass} placeholder="mg/dL" />
              </div>
              <div>
                <label className={labelClass}>BMI</label>
                <input type="number" min="0" step="0.1" name="bmi" value={formData.bmi || ''} onChange={onInputChange} className={inputClass} placeholder="Body Mass Index" />
              </div>
              <div>
                <label className={labelClass}>Blood Pressure</label>
                <input type="number" min="0" name="bp" value={formData.bp || ''} onChange={onInputChange} className={inputClass} placeholder="mmHg" />
              </div>
              <div>
                <label className={labelClass}>Insulin</label>
                <input type="number" min="0" name="insulin" value={formData.insulin || ''} onChange={onInputChange} className={inputClass} placeholder="U/ml" />
              </div>
              <div>
                <label className={labelClass}>Skin Thickness</label>
                <input type="number" min="0" name="skinthickness" value={formData.skinthickness || ''} onChange={onInputChange} className={inputClass} placeholder="mm" />
              </div>
              <div>
                <label className={labelClass}>Diabetes Pedigree Func</label>
                <input type="number" min="0" step="0.01" name="dpf" value={formData.dpf || ''} onChange={onInputChange} className={inputClass} placeholder="e.g. 0.5" />
              </div>
              <div>
                <label className={labelClass}>Pregnancies <span className="text-red-400 ml-1">*</span></label>
                <select required name="pregnancies" value={formData.pregnancies || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select Count</option>
                  {[...Array(15).keys()].map(num => (
                    <option key={num} value={num} className="bg-neutral-100">{num}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Heart specific inputs */}
          {selectedDisease === 'heart' && (
            <>
              <div>
                <label className={labelClass}>Gender <span className="text-red-400 ml-1">*</span></label>
                <select required name="sex" value={formData.sex || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  <option value="1" className="bg-neutral-100">Male</option>
                  <option value="0" className="bg-neutral-100">Female</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Chest Pain Type</label>
                <select name="cp" value={formData.cp || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select Type</option>
                  <option value="1" className="bg-neutral-100">1: Standard Heart Pain</option>
                  <option value="2" className="bg-neutral-100">2: Unusual Heart Pain</option>
                  <option value="3" className="bg-neutral-100">3: Non-Heart Related Pain</option>
                  <option value="4" className="bg-neutral-100">4: No Pain (Asymptomatic)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Cholesterol</label>
                <input type="number" min="0" name="chol" value={formData.chol || ''} onChange={onInputChange} className={inputClass} placeholder="mg/dl" />
              </div>
              <div>
                <label className={labelClass}>Max Heart Rate (thalach)</label>
                <input type="number" min="0" name="thalach" value={formData.thalach || ''} onChange={onInputChange} className={inputClass} placeholder="BPM" />
              </div>
              <div>
                <label className={labelClass}>Resting BP (trestbps)</label>
                <input type="number" min="0" name="trestbps" value={formData.trestbps || ''} onChange={onInputChange} className={inputClass} placeholder="mmHg" />
              </div>
              <div>
                <label className={labelClass}>Fasting Blood Sugar &gt; 120</label>
                <select name="fbs" value={formData.fbs || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  <option value="1" className="bg-neutral-100">Yes</option>
                  <option value="0" className="bg-neutral-100">No</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Resting ECG</label>
                <select name="restecg" value={formData.restecg || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  <option value="0" className="bg-neutral-100">0: Normal</option>
                  <option value="1" className="bg-neutral-100">1: ST-T Abnormality</option>
                  <option value="2" className="bg-neutral-100">2: LVH</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Exercise Angina</label>
                <select name="exang" value={formData.exang || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  <option value="1" className="bg-neutral-100">Yes</option>
                  <option value="0" className="bg-neutral-100">No</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>ST Depression (oldpeak)</label>
                <input type="number" min="0" step="0.1" name="oldpeak" value={formData.oldpeak || ''} onChange={onInputChange} className={inputClass} placeholder="e.g. 1.5" />
              </div>
            </>
          )}

          {/* Lung specific inputs */}
          {selectedDisease === 'lung' && (
            <>
              <div>
                <label className={labelClass}>Smoking History (Pack-years) <span className="text-red-400 ml-1">*</span></label>
                <input required type="number" min="0" name="smoking_history" value={formData.smoking_history || ''} onChange={onInputChange} className={inputClass} placeholder="0 for non-smoker" />
              </div>
              <div>
                <label className={labelClass}>Currently Smoking</label>
                <select name="smoking" value={formData.smoking || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  <option value="1" className="bg-neutral-100">Yes</option>
                  <option value="0" className="bg-neutral-100">No</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>FEV1 (Airflow in 1 sec)</label>
                <input type="number" min="0" step="0.01" name="fev1" value={formData.fev1 || ''} onChange={onInputChange} className={inputClass} placeholder="Liters" />
              </div>
              <div>
                <label className={labelClass}>FVC (Total Lung Capacity)</label>
                <input type="number" min="0" step="0.01" name="fvc" value={formData.fvc || ''} onChange={onInputChange} className={inputClass} placeholder="Liters" />
              </div>
              <div>
                <label className={labelClass}>CAT Score (Symptoms Impact)</label>
                <input type="number" min="0" name="cat_score" value={formData.cat_score || ''} onChange={onInputChange} className={inputClass} placeholder="Range: 0-40" />
              </div>
              <div>
                <label className={labelClass}>Has Diabetes?</label>
                <select name="diabetes" value={formData.diabetes || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  <option value="1" className="bg-neutral-100">Yes</option>
                  <option value="0" className="bg-neutral-100">No</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Gender <span className="text-red-400 ml-1">*</span></label>
                <select required name="gender" value={formData.gender || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  <option value="1" className="bg-neutral-100">Male</option>
                  <option value="0" className="bg-neutral-100">Female</option>
                </select>
              </div>
            </>
          )}

          {/* Kidney specific inputs */}
          {selectedDisease === 'kidney' && (
            <>
              <div>
                <label className={labelClass}>Blood Pressure <span className="text-red-400 ml-1">*</span></label>
                <input required type="number" min="0" name="bp" value={formData.bp || ''} onChange={onInputChange} className={inputClass} placeholder="mmHg" />
              </div>
              <div>
                <label className={labelClass}>Specific Gravity</label>
                <input type="number" min="1.000" step="0.001" name="sg" value={formData.sg || ''} onChange={onInputChange} className={inputClass} placeholder="1.005 - 1.025" />
              </div>
              <div>
                <label className={labelClass}>Albumin</label>
                <select name="al" value={formData.al || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  {[0, 1, 2, 3, 4, 5].map(num => <option key={num} value={num} className="bg-neutral-100">{num}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Sugar</label>
                <select name="su" value={formData.su || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  {[0, 1, 2, 3, 4, 5].map(num => <option key={num} value={num} className="bg-neutral-100">{num}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Blood Urea</label>
                <input type="number" min="0" name="bu" value={formData.bu || ''} onChange={onInputChange} className={inputClass} placeholder="mgs/dl" />
              </div>
              <div>
                <label className={labelClass}>Serum Creatinine</label>
                <input type="number" min="0" step="0.1" name="sc" value={formData.sc || ''} onChange={onInputChange} className={inputClass} placeholder="mgs/dl" />
              </div>
              <div>
                <label className={labelClass}>Blood Glucose Random</label>
                <input type="number" min="0" name="bgr" value={formData.bgr || ''} onChange={onInputChange} className={inputClass} placeholder="mgs/dl" />
              </div>
              <div>
                <label className={labelClass}>Hemoglobin</label>
                <input type="number" min="0" step="0.1" name="hemo" value={formData.hemo || ''} onChange={onInputChange} className={inputClass} placeholder="gms" />
              </div>
              <div>
                <label className={labelClass}>Packed Cell Volume</label>
                <input type="number" min="0" name="pcv" value={formData.pcv || ''} onChange={onInputChange} className={inputClass} placeholder="%" />
              </div>
              <div>
                <label className={labelClass}>Sodium</label>
                <input type="number" min="0" step="0.1" name="sod" value={formData.sod || ''} onChange={onInputChange} className={inputClass} placeholder="mEq/L" />
              </div>
              <div>
                <label className={labelClass}>Potassium</label>
                <input type="number" min="0" step="0.1" name="pot" value={formData.pot || ''} onChange={onInputChange} className={inputClass} placeholder="mEq/L" />
              </div>
              <div>
                <label className={labelClass}>RBC Count</label>
                <input type="number" min="0" step="0.1" name="rbcc" value={formData.rbcc || ''} onChange={onInputChange} className={inputClass} placeholder="millions/cmm" />
              </div>
              <div>
                <label className={labelClass}>WBC Count</label>
                <input type="number" min="0" name="wbcc" value={formData.wbcc || ''} onChange={onInputChange} className={inputClass} placeholder="cells/cumm" />
              </div>
              <div>
                <label className={labelClass}>Pus Cells</label>
                <select name="pc" value={formData.pc || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  <option value="1" className="bg-neutral-100">Normal</option>
                  <option value="0" className="bg-neutral-100">Abnormal</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Hypertension</label>
                <select name="htn" value={formData.htn || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  <option value="1" className="bg-neutral-100">Yes</option>
                  <option value="0" className="bg-neutral-100">No</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Diabetes Mellitus</label>
                <select name="dm" value={formData.dm || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  <option value="1" className="bg-neutral-100">Yes</option>
                  <option value="0" className="bg-neutral-100">No</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Coronary Artery Disease</label>
                <select name="cad" value={formData.cad || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  <option value="1" className="bg-neutral-100">Yes</option>
                  <option value="0" className="bg-neutral-100">No</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Appetite</label>
                <select name="appet" value={formData.appet || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  <option value="1" className="bg-neutral-100">Good</option>
                  <option value="0" className="bg-neutral-100">Poor</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Pedal Edema</label>
                <select name="pe" value={formData.pe || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  <option value="1" className="bg-neutral-100">Yes</option>
                  <option value="0" className="bg-neutral-100">No</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Anemia</label>
                <select name="ane" value={formData.ane || ''} onChange={onInputChange} className={inputClass}>
                  <option value="" className="bg-neutral-100">Select</option>
                  <option value="1" className="bg-neutral-100">Yes</option>
                  <option value="0" className="bg-neutral-100">No</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-6 rounded-lg shadow-sm text-lg font-semibold text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900/50 transition-colors"
          >
            Process Assessment
          </button>
        </div>
      </form>
    </div>
  );
}
