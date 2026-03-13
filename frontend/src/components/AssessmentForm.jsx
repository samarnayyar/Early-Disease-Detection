import React from 'react';
import { DISEASES } from '../constants/diseases';

export default function AssessmentForm({ selectedDisease, formData, onInputChange, onSubmit }) {
  const disease = DISEASES.find(d => d.id === selectedDisease);
  const Icon = disease?.icon;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
        <div className={`p-3 rounded-xl ${disease?.bg} ${disease?.color} shadow-sm`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{disease?.name} Analysis</h2>
          <p className="text-sm text-slate-500">Provide clinical measurements below</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* General Parameters */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">Patient Age</label>
            <input
              required
              type="number"
              min="0"
              name="age"
              value={formData.age || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300"
              placeholder="Years"
            />
          </div>

          {/* Diabetes specific inputs */}
          {selectedDisease === 'diabetes' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Glucose Level</label>
                <input required type="number" min="0" name="glucose" value={formData.glucose || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="mg/dL" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">BMI</label>
                <input required type="number" min="0" step="0.1" name="bmi" value={formData.bmi || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="kg/m²" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Blood Pressure</label>
                <input required type="number" min="0" name="bp" value={formData.bp || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="mmHg" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Insulin</label>
                <input required type="number" min="0" name="insulin" value={formData.insulin || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="mu U/ml" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Pregnancies</label>
                <select 
                  required 
                  name="pregnancies" 
                  value={formData.pregnancies || ''} 
                  onChange={onInputChange} 
                  className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all"
                >
                  <option value="">Select Count</option>
                  {[...Array(14).keys()].map(num => (
                    <option key={num} value={num}>{num}{num === 13 ? '+' : ''}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Heart specific inputs */}
          {selectedDisease === 'heart' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Gender</label>
                <select required name="sex" value={formData.sex || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all">
                  <option value="">Select</option>
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Chest Pain Type</label>
                <select required name="cp" value={formData.cp || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all">
                  <option value="">Select Type</option>
                  <option value="1">1: Standard Heart Pain</option>
                  <option value="2">2: Unusual Heart Pain</option>
                  <option value="3">3: Non-Heart Related Pain</option>
                  <option value="4">4: No Pain (Asymptomatic)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Cholesterol</label>
                <input required type="number" min="0" name="chol" value={formData.chol || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="mg/dl" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Max Heart Rate</label>
                <input required type="number" min="0" name="thalach" value={formData.thalach || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="BPM" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Chest Pain during Exercise</label>
                <select required name="exang" value={formData.exang || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all">
                  <option value="">Select</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </>
          )}

          {/* Lung specific inputs */}
          {selectedDisease === 'lung' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Smoking History (Pack-years)</label>
                <input required type="number" min="0" name="smoking_history" value={formData.smoking_history || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="Years" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">FEV1 (Airflow in 1 sec)</label>
                <input required type="number" min="0" step="0.01" name="fev1" value={formData.fev1 || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="Liters" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">FVC (Total Lung Capacity)</label>
                <input required type="number" min="0" step="0.01" name="fvc" value={formData.fvc || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="Liters" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">COPD Severity (Progression Stage)</label>
                <select required name="copd_severity" value={formData.copd_severity || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all">
                  <option value="">Select Stage</option>
                  <option value="1">Stage 1: Mild</option>
                  <option value="2">Stage 2: Moderate</option>
                  <option value="3">Stage 3: Severe</option>
                  <option value="4">Stage 4: Very Severe</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">CAT Score (Symptoms Impact)</label>
                <input required type="number" min="0" name="cat_score" value={formData.cat_score || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="Enter Score" />
              </div>
            </>
          )}

          {/* Kidney specific inputs */}
          {selectedDisease === 'kidney' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Blood Pressure</label>
                <input required type="number" min="0" name="bp" value={formData.bp || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="mmHg" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Blood Urea</label>
                <input required type="number" min="0" name="bu" value={formData.bu || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="mg/dl" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Serum Creatinine</label>
                <input required type="number" min="0" step="0.1" name="sc" value={formData.sc || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="mg/dl" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Hemoglobin</label>
                <input required type="number" min="0" step="0.1" name="hemo" value={formData.hemo || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="gms" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Specific Gravity</label>
                <input required type="number" min="1.000" step="0.001" name="sg" value={formData.sg || ''} onChange={onInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-black/10 focus:border-black outline-none transition-all placeholder:text-slate-300" placeholder="1.0xx" />
              </div>
            </>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-2xl shadow-xl shadow-indigo-600/10 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-1"
          >
            Process Assessment
          </button>
        </div>
      </form>
    </div>
  );
}
