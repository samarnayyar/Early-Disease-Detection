import { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Heart, HeartPulse, Wind, Droplets, Droplet, ArrowLeft, Loader2, Gauge, AlertCircle, CheckCircle2 } from 'lucide-react';

const DISEASES = [
  { 
    id: 'diabetes', 
    name: 'Diabetes', 
    icon: Droplet, 
    color: 'text-red-500', 
    bg: 'bg-red-50',
    description: 'Glucose & Metabolic Analysis'
  },
  { 
    id: 'heart', 
    name: 'Heart Disease', 
    icon: HeartPulse, 
    color: 'text-rose-500', 
    bg: 'bg-rose-50',
    description: 'Cardiovascular Health'
  },
  { 
    id: 'lung', 
    name: 'Lung Disease', 
    icon: Wind, 
    color: 'text-blue-500', 
    bg: 'bg-blue-50',
    description: 'Respiratory Function'
  },
  { 
    id: 'kidney', 
    name: 'Kidney Disease', 
    icon: Activity, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-50',
    description: 'Renal & Fluid Balance'
  }
];

const LOADING_PHASES = [
  "Checking your health details...",
  "Comparing with our medical data...",
  "Looking for any patterns...",
  "Finalizing your risk assessment..."
];

export default function App() {
  const [step, setStep] = useState('selection'); // 'selection', 'form', 'loading', 'result'
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loadingPhase, setLoadingPhase] = useState(0);

  // Cycle through loading phases when in loading step
  useEffect(() => {
    let interval;
    if (step === 'loading') {
      setLoadingPhase(0);
      interval = setInterval(() => {
        setLoadingPhase(prev => (prev < LOADING_PHASES.length - 1 ? prev + 1 : prev));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleSelectDisease = (diseaseId) => {
    setSelectedDisease(diseaseId);
    setFormData({});
    setStep('form');
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('selection');
      setSelectedDisease(null);
    } else if (step === 'result') {
      setStep('form');
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep('loading');

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disease: selectedDisease,
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Increased delay to show the nice loading points
      setTimeout(() => {
        setResult(data);
        setStep('result');
      }, 3000);

    } catch (error) {
      console.error("Error fetching prediction:", error);
      setTimeout(() => {
        setResult({
          riskScore: 'Error',
          message: 'Failed to connect to the prediction server. Please make sure the Flask backend is running.',
          status: 'Error'
        });
        setStep('result');
      }, 1000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getDiseaseDeets = () => DISEASES.find(d => d.id === selectedDisease);

  const getRiskSummary = (status, score) => {
    if (status === 'Low Risk') {
      return "Everything looks good! Your numbers are well within the healthy range, so there's no immediate cause for concern. Keep up the healthy habits!";
    } else if (score < 60) {
      return "We found some borderline results. While you're not in a high-risk zone yet, it might be a good idea to watch your habits and maybe mention these results to a doctor at your next check-up.";
    } else {
      return "Our system found some patterns that are often seen in people with this condition. Because some of your numbers are on the higher side, we really recommend talking to a doctor soon just to be safe.";
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            AI Health Risk Predictor
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
            Early Detection of Major Diseases Using Machine Learning
          </p>
        </div>

        {/* Main Content Area */}
        <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-4xl overflow-hidden border border-slate-200/10">

          {/* Back Navigation */}
          {step !== 'selection' && step !== 'loading' && (
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50">
              <button
                onClick={handleBack}
                className="flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all transform hover:-translate-x-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to {step === 'form' ? 'Type Selection' : 'Assessment'}
              </button>
            </div>
          )}

          <div className="p-8 md:p-10">
            {/* Step 1: Selection */}
            {step === 'selection' && (
              <div className="space-y-8">
                <div className="text-center space-y-1">
                  <h2 className="text-3xl font-bold text-slate-800">Choose Assessment Type</h2>
                  <p className="text-lg text-slate-500">Select the health category you wish to evaluate</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {DISEASES.map((disease) => {
                    const Icon = disease.icon;
                    return (
                      <button
                        key={disease.id}
                        onClick={() => handleSelectDisease(disease.id)}
                        className={`group p-8 rounded-3xl border-2 transition-all duration-300 text-left flex items-start space-x-6
                          bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 border-slate-100`}
                      >
                        <div className={`p-4 rounded-xl ${disease.bg} ${disease.color} group-hover:scale-110 transition-all`}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-800">{disease.name}</h3>
                          <p className="text-base text-slate-500 mt-2 leading-relaxed">
                            {disease.description}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Form */}
            {step === 'form' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
                  <div className={`p-3 rounded-xl ${getDiseaseDeets()?.bg} ${getDiseaseDeets()?.color} shadow-sm`}>
                    {getDiseaseDeets() && (() => { const Icon = getDiseaseDeets().icon; return <Icon className="h-6 w-6" /> })()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{getDiseaseDeets()?.name} Analysis</h2>
                    <p className="text-sm text-slate-500">Provide clinical measurements below</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Patient Age</label>
                      <input
                        required
                        type="number"
                        name="age"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                        placeholder="Years"
                      />
                    </div>

                    {selectedDisease === 'diabetes' && (
                      <>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Glucose Level</label>
                          <input required type="number" name="glucose" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="mg/dL" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">BMI</label>
                          <input required type="number" step="0.1" name="bmi" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="kg/m²" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Blood Pressure</label>
                          <input required type="number" name="bp" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="mmHg" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Insulin</label>
                          <input required type="number" name="insulin" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="mu U/ml" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Pregnancies</label>
                          <input required type="number" name="pregnancies" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="Count" />
                        </div>
                      </>
                    )}

                    {selectedDisease === 'heart' && (
                      <>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Gender</label>
                          <select required name="sex" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
                            <option value="">Select</option>
                            <option value="1">Male</option>
                            <option value="0">Female</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Chest Pain Type</label>
                          <input required type="number" min="1" max="4" name="cp" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="Rating" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Cholesterol</label>
                          <input required type="number" name="chol" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="mg/dl" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Max Heart Rate</label>
                          <input required type="number" name="thalach" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="BPM" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Exercise Angina</label>
                          <select required name="exang" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
                            <option value="">Select</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                        </div>
                      </>
                    )}

                    {selectedDisease === 'lung' && (
                      <>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Smoking History</label>
                          <input required type="number" name="smoking_history" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="Years" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">FEV1</label>
                          <input required type="number" step="0.01" name="fev1" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="Liters" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">FVC</label>
                          <input required type="number" step="0.01" name="fvc" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="Liters" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">COPD Severity</label>
                          <input required type="number" min="1" max="4" name="copd_severity" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="Level" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">CAT Score</label>
                          <input required type="number" name="cat_score" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="Score" />
                        </div>
                      </>
                    )}

                    {selectedDisease === 'kidney' && (
                      <>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Blood Pressure</label>
                          <input required type="number" name="bp" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="mmHg" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Blood Urea</label>
                          <input required type="number" name="bu" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="mg/dl" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Serum Creatinine</label>
                          <input required type="number" step="0.1" name="sc" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="mg/dl" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Hemoglobin</label>
                          <input required type="number" step="0.1" name="hemo" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="gms" />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Specific Gravity</label>
                          <input required type="number" step="0.001" name="sg" onChange={handleInputChange} className="w-full px-4 py-2 text-base rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" placeholder="1.0xx" />
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
            )}

            {/* Step 3: Loading */}
            {step === 'loading' && (
              <div className="py-8 flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800">Processing Assessment</h3>
                  <div className="space-y-2 text-left mx-auto inline-block">
                    {LOADING_PHASES.map((phase, idx) => (
                      <div key={idx} className={`flex items-center space-x-3 text-sm transition-all duration-200 ${idx === loadingPhase ? 'text-indigo-600 font-bold scale-[1.02]' : idx < loadingPhase ? 'text-green-500 opacity-60' : 'text-slate-300'}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${idx === loadingPhase ? 'bg-indigo-600 animate-pulse' : idx < loadingPhase ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                        <span>{phase}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Result */}
            {step === 'result' && (
              <div className="py-0 space-y-6 animate-in fade-in zoom-in-95 duration-700">
                <div className="text-center space-y-1">
                   <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Diagnostic Complete</p>
                   <h2 className="text-2xl font-bold text-slate-800">Risk Assessment Summary</h2>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Risk Meter Section */}
                  <div className="xl:col-span-12 2xl:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50/80 p-6 rounded-4xl border border-slate-100 relative overflow-hidden group">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-bold text-slate-500 uppercase">Calculated Level</span>
                         <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${result?.status === 'High Risk' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                           {result?.status}
                         </span>
                      </div>
                    
                    <div className="space-y-4">
                      <div className="relative h-8 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner flex p-1">
                          <div className="h-full bg-green-500 w-[30%] rounded-l-full"></div>
                          <div className="h-full bg-yellow-500 w-[40%]"></div>
                          <div className="h-full bg-red-500 w-[30%] rounded-r-full"></div>
                          
                          <div 
                            className="absolute top-0 bottom-0 w-2.5 bg-slate-900 border-x border-white/40 shadow-xl transition-all duration-[1.5s] ease-out-back z-10"
                            style={{ left: `${result?.riskScore}%`, transform: 'translateX(-50%)' }}
                          ></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                        <span>Low</span>
                        <span>Moderate</span>
                        <span>High</span>
                      </div>
                    </div>

                      <div className="text-center space-y-0">
                         <div className="text-6xl font-bold text-slate-800">
                            {result?.riskScore}<span className="text-xl text-slate-400 ml-1">%</span>
                         </div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Probability</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-xl shrink-0 ${result?.status === 'High Risk' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {result?.status === 'High Risk' ? <AlertCircle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">Summary</h3>
                          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            {getRiskSummary(result?.status, result?.riskScore)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/50 p-4 rounded-2xl border border-slate-100">
                         <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {result?.message}
                         </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setStep('selection')}
                    className="w-full flex justify-center py-3 px-4 border border-slate-200 rounded-2xl text-lg font-bold text-slate-500 bg-white hover:bg-slate-50 transition-all hover:text-indigo-600"
                  >
                    New Assessment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Space Filler */}
        <div className="h-4"></div>
      </div>
    </div>
  );
}

