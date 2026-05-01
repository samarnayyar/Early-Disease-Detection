import { useState, useEffect } from 'react';
import { ArrowLeft, User, History, Menu, X, LogIn, ActivitySquare } from 'lucide-react';

// Main Component Modules
import DiseaseSelection from './components/DiseaseSelection';
import AssessmentForm from './components/AssessmentForm';
import LoadingScreen from './components/LoadingScreen';
import ResultSummary from './components/ResultSummary';

import { LOADING_PHASES, DISEASES } from './constants/diseases';

export default function App() {
  const [step, setStep] = useState('selection');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

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
    setIsSidebarOpen(false);
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

  const handleLogin = () => {
    setUser({ name: "Demo User" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasAge = formData.age && formData.age.trim() !== '';
    const otherParams = Object.keys(formData).filter(key => key !== 'age' && formData[key] && formData[key].toString().trim() !== '');

    if (!hasAge) {
      alert("Please provide the Patient Age to proceed.");
      return;
    }

    if (otherParams.length === 0) {
      alert("Please provide at least one clinical measurement for a valid assessment.");
      return;
    }

    setStep('loading');

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disease: selectedDisease, ...formData }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      setTimeout(() => {
        setResult(data);
        setStep('result');
      }, 3000);

    } catch (error) {
      console.error("Error fetching prediction:", error);
      setTimeout(() => {
        setResult({
          riskScore: '0',
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex overflow-hidden selection:bg-blue-500/30">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#1e293b]/95 backdrop-blur-md border-r border-slate-700/50 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl`}>
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <button 
            onClick={() => { setStep('selection'); setSelectedDisease(null); setIsSidebarOpen(false); }}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ActivitySquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">MedPredict</span>
          </button>
          <button className="lg:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-4">Diagnostics</p>
            {DISEASES.map(disease => (
              <button
                key={disease.id}
                onClick={() => handleSelectDisease(disease.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${selectedDisease === disease.id && step !== 'selection' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'}`}
              >
                <disease.icon className={`h-5 w-5 ${selectedDisease === disease.id && step !== 'selection' ? 'text-blue-400' : ''}`} />
                <span className="font-semibold">{disease.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-4">Account</p>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent transition-all duration-300">
              <History className="h-5 w-5" />
              <span className="font-semibold">View History</span>
              <span className="ml-auto text-[10px] py-1 px-2 rounded-full bg-slate-800 text-slate-500 font-bold border border-slate-700">SOON</span>
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700/50">
          {user ? (
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400">Free Tier</p>
              </div>
            </div>
          ) : (
            <button onClick={handleLogin} className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25">
              <LogIn className="h-5 w-5" />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800/40 via-[#0f172a] to-[#0f172a]">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md">
          <button onClick={() => { setStep('selection'); setSelectedDisease(null); }} className="flex items-center space-x-2 focus:outline-none">
            <ActivitySquare className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold text-white">MedPredict</span>
          </button>
          <button className="p-2 rounded-xl bg-slate-800 text-slate-400" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            {/* Dynamic UI Panel */}
            <div className="bg-[#1e293b]/80 backdrop-blur-xl shadow-2xl rounded-[2rem] border border-slate-700/50 overflow-hidden relative">
              
              {/* Decorative Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              
              {step !== 'selection' && step !== 'loading' && (
                <div className="px-8 py-4 border-b border-slate-700/50 bg-[#1e293b]/50">
                  <button
                    onClick={handleBack}
                    className="flex items-center text-sm font-bold text-slate-400 hover:text-white transition-all transform hover:-translate-x-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to {step === 'form' ? 'Dashboard' : 'Assessment'}
                  </button>
                </div>
              )}

              <div className="p-8 md:p-12">
                {step === 'selection' && (
                  <DiseaseSelection onSelect={handleSelectDisease} />
                )}

                {step === 'form' && (
                  <AssessmentForm
                    selectedDisease={selectedDisease}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                  />
                )}

                {step === 'loading' && (
                  <LoadingScreen loadingPhase={loadingPhase} />
                )}

                {step === 'result' && (
                  <ResultSummary
                    result={result}
                    onReset={() => {
                      setStep('selection');
                      setSelectedDisease(null);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
