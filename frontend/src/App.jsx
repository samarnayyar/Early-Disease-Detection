import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

// Main Component Modules
import Header from './components/Header';
import DiseaseSelection from './components/DiseaseSelection';
import AssessmentForm from './components/AssessmentForm';
import LoadingScreen from './components/LoadingScreen';
import ResultSummary from './components/ResultSummary';

// Core Data Configurations
import { LOADING_PHASES } from './constants/diseases';

export default function App() {
  //App State: step tracks the current diagnostic phase ('selection', 'form', 'loading', 'result')
  const [step, setStep] = useState('selection');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loadingPhase, setLoadingPhase] = useState(0);

  //loading text transitions
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

      //loading state for smoother transition
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
    <div className="min-h-screen bg-[#111827] py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto space-y-6">

        <Header />

        {/* Main Content Area */}
        <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-4xl overflow-hidden border border-slate-200/10">

          {/* Diagnostic Navigation Control */}
          {step !== 'selection' && step !== 'loading' && (
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50">
              <button
                onClick={handleBack}
                className="flex items-center text-sm font-bold text-slate-500 hover:text-black transition-all transform hover:-translate-x-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to {step === 'form' ? 'Type Selection' : 'Assessment'}
              </button>
            </div>
          )}

          <div className="p-8 md:p-10">
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
                onReset={() => setStep('selection')}
              />
            )}
          </div>
        </div>


        <div className="h-4"></div>
      </div>
    </div>
  );
}
