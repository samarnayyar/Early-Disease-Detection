import { useState, useEffect } from 'react';
import { ArrowLeft, User, History, Menu, X, LogIn, ActivitySquare, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Main Component Modules
import DiseaseSelection from './components/DiseaseSelection';
import AssessmentForm from './components/AssessmentForm';
import LoadingScreen from './components/LoadingScreen';
import ResultSummary from './components/ResultSummary';
import AuthModal from './components/AuthModal';
import HistoryView from './components/HistoryView';

import { LOADING_PHASES, DISEASES } from './constants/diseases';

export default function App() {
  const [step, setStep] = useState('selection');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
    
    // Ensure we scroll to top of the new form
    const container = document.getElementById('main-content-area');
    if (container) container.scrollTop = 0;
  };

  const handleBack = () => {
    if (step === 'form' || step === 'history') {
      setStep('selection');
      setSelectedDisease(null);
    } else if (step === 'result') {
      setStep('form');
      setResult(null);
    }
  };

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('wellcore_token');
    setUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasAge = formData.age && formData.age.trim() !== '';
    const otherParams = Object.keys(formData).filter(key => key !== 'age' && formData[key] && formData[key].toString().trim() !== '');

    if (!hasAge) {
      alert("Please provide the Patient Age to proceed.");
      return;
    }

    if (otherParams.length < 2) {
      alert("Please provide at least 2 additional clinical measurements (3 features total) for a valid assessment.");
      return;
    }

    setStep('loading');

    try {
      const token = localStorage.getItem('wellcore_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: headers,
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
    <div className="min-h-screen bg-linear-to-br from-[#f2ede4] via-[#e7dec8] to-[#dcd0b2] text-neutral-800 font-sans flex overflow-hidden selection:bg-blue-500/30">

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(userData) => setUser(userData)}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed ${isDesktopSidebarOpen ? 'lg:static lg:translate-x-0' : 'lg:hidden'} inset-y-0 left-0 w-72 bg-[#dccfb1] backdrop-blur-md border-r border-neutral-300/50 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out flex flex-col shadow-2xl`}>
        <div className="p-6 border-b border-neutral-300/50 flex items-center justify-between">
          <button
            onClick={() => { setStep('selection'); setSelectedDisease(null); setIsSidebarOpen(false); }}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <span className="text-3xl font-black text-neutral-900 tracking-tight">Wellcore</span>
          </button>
          <button className="lg:hidden text-neutral-600 hover:text-neutral-900 transition-colors" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-3 mb-4">Diagnostics</p>
            {DISEASES.map(disease => (
              <button
                key={disease.id}
                onClick={() => handleSelectDisease(disease.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${selectedDisease === disease.id && (step === 'form' || step === 'result') ? 'bg-neutral-800 text-white font-semibold border border-neutral-900 shadow-md' : 'text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-900'}`}
              >
                <disease.icon className="h-5 w-5" />
                <span className="font-semibold">{disease.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-3 mb-4">Account</p>
            <button
              onClick={() => {
                if (!user) {
                  setIsAuthModalOpen(true);
                  return;
                }
                setStep('history');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${step === 'history' ? 'bg-neutral-800 text-white font-semibold border border-neutral-900 shadow-md' : 'text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-900'}`}
            >
              <History className="h-5 w-5" />
              <span className="font-semibold">View History</span>
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-300/50">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-100/50 border border-neutral-300">
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-neutral-900 font-bold text-lg shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-neutral-900 truncate">{user.name}</p>
                  <p className="text-xs text-neutral-600 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 text-sm font-bold text-neutral-600 hover:text-red-400 bg-neutral-100/30 hover:bg-red-500/10 rounded-md transition-colors border border-transparent hover:border-red-500/20"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              <LogIn className="h-5 w-5" />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#ede7de]">
        {/* Universal Header */}
        <header className="flex items-center justify-between p-4 border-b border-neutral-200 bg-[#ede7de]/80 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-md bg-neutral-100 text-neutral-600 hidden lg:block hover:text-neutral-900 transition-colors"
              onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => { setStep('selection'); setSelectedDisease(null); }}
              className={`flex items-center space-x-2 focus:outline-none ${isDesktopSidebarOpen ? 'lg:hidden' : 'lg:flex'}`}
            >
              <span className="text-2xl font-black text-neutral-900 tracking-tight">Wellcore</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md bg-neutral-100 text-neutral-600 lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div id="main-content-area" className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            {/* Dynamic UI Panel */}
            <div className="bg-[#ede7de]/80 backdrop-blur-xl shadow-2xl rounded-md border border-neutral-300/50 overflow-hidden relative">

              {/* Decorative Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-linear-to-r from-transparent via-neutral-400/50 to-transparent"></div>

              {step !== 'selection' && step !== 'loading' && (
                <div className="px-8 py-4 border-b border-neutral-300/50 bg-[#ede7de]/50">
                  <button
                    onClick={handleBack}
                    className="flex items-center text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-all transform hover:-translate-x-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </button>
                </div>
              )}

              <div className="p-8 md:p-12 overflow-hidden">
                <AnimatePresence mode="wait">
                  {step === 'selection' && (
                    <motion.div key="selection" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                      <DiseaseSelection onSelect={handleSelectDisease} />
                    </motion.div>
                  )}

                  {step === 'history' && (
                    <motion.div key="history" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                      <HistoryView onBack={handleBack} />
                    </motion.div>
                  )}

                  {step === 'form' && (
                    <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                      <AssessmentForm
                        selectedDisease={selectedDisease}
                        formData={formData}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                      />
                    </motion.div>
                  )}

                  {step === 'loading' && (
                    <motion.div key="loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.2 }}>
                      <LoadingScreen loadingPhase={loadingPhase} />
                    </motion.div>
                  )}

                  {step === 'result' && (
                    <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                      <ResultSummary
                        result={result}
                        onReset={() => {
                          setStep('selection');
                          setSelectedDisease(null);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
