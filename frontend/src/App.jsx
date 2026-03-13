import { useState } from 'react';
import { Activity, Beaker, HeartPulse, Stethoscope, Droplet, ArrowLeft, Loader2 } from 'lucide-react';

const DISEASES = [
  { id: 'diabetes', name: 'Diabetes', icon: Droplet, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' },
  { id: 'lung', name: 'Lung Disease', icon: Activity, color: 'text-gray-500', bg: 'bg-gray-100', border: 'border-gray-200' },
  { id: 'heart', name: 'Heart Disease', icon: HeartPulse, color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-200' },
  { id: 'kidney', name: 'Kidney Disease', icon: Beaker, color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-200' },
];

export default function App() {
  const [step, setStep] = useState('selection'); // 'selection', 'form', 'loading', 'result'
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);

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

      // Add artificial delay just for the UI loading effect
      setTimeout(() => {
        setResult(data);
        setStep('result');
      }, 1500);

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Health Risk Predictor</h1>
          <p className="mt-2 text-lg text-gray-600">
            Powered by Machine Learning Models
          </p>
        </div>

        {/* Main Content Area */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">

          {/* Back Navigation */}
          {step !== 'selection' && step !== 'loading' && (
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <button
                onClick={handleBack}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to {step === 'form' ? 'Selection' : 'Form'}
              </button>
            </div>
          )}

          <div className="p-8">
            {/* Step 1: Selection */}
            {step === 'selection' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Select a Model</h2>
                  <p className="text-gray-500 mt-1">Choose which disease risk you want to predict</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {DISEASES.map((disease) => {
                    const Icon = disease.icon;
                    return (
                      <button
                        key={disease.id}
                        onClick={() => handleSelectDisease(disease.id)}
                        className={`group p-6 rounded-xl border-2 transition-all duration-200 text-left flex items-start space-x-4
                          bg-white hover:${disease.bg} border-gray-200 hover:${disease.border} hover:shadow-md`}
                      >
                        <div className={`p-3 rounded-xl ${disease.bg} ${disease.color} group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{disease.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Analyze health parameters to predict {disease.name.toLowerCase()} risk.
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
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center space-x-4 pb-6 border-b border-gray-100">
                  <div className={`p-3 rounded-xl ${getDiseaseDeets()?.bg} ${getDiseaseDeets()?.color}`}>
                    {getDiseaseDeets() && (() => { const Icon = getDiseaseDeets().icon; return <Icon className="h-6 w-6" /> })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{getDiseaseDeets()?.name} Assessment</h2>
                    <p className="text-gray-500 mt-1">Enter your health parameters below</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dynamic Form Fields based on Disease */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
                      <input
                        required
                        type="number"
                        name="age"
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="e.g. 45"
                      />
                    </div>

                    {selectedDisease === 'diabetes' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Glucose Level</label>
                          <input required type="number" name="glucose" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 120" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">BMI</label>
                          <input required type="number" step="0.1" name="bmi" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 25.5" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Blood Pressure</label>
                          <input required type="number" name="bp" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 80" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Insulin</label>
                          <input required type="number" name="insulin" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 30" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Pregnancies</label>
                          <input required type="number" name="pregnancies" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 2" />
                        </div>
                      </>
                    )}

                    {selectedDisease === 'heart' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                          <select required name="sex" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                            <option value="">Select Gender</option>
                            <option value="1">Male</option>
                            <option value="0">Female</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Chest Pain Type (1-4)</label>
                          <input required type="number" min="1" max="4" name="cp" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 2" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Cholesterol</label>
                          <input required type="number" name="chol" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 200" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Max Heart Rate</label>
                          <input required type="number" name="thalach" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 150" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Exercise Angina</label>
                          <select required name="exang" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                            <option value="">Select Option</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                        </div>
                      </>
                    )}

                    {selectedDisease === 'lung' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Smoking History (Years)</label>
                          <input required type="number" name="smoking_history" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 10" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">FEV1</label>
                          <input required type="number" step="0.01" name="fev1" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 1.5" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">FVC</label>
                          <input required type="number" step="0.01" name="fvc" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 2.5" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">COPD Severity (1-4)</label>
                          <input required type="number" min="1" max="4" name="copd_severity" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 2" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">CAT Score</label>
                          <input required type="number" name="cat_score" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 15" />
                        </div>
                      </>
                    )}

                    {selectedDisease === 'kidney' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Blood Pressure</label>
                          <input required type="number" name="bp" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 80" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Blood Urea</label>
                          <input required type="number" name="bu" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 35" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Serum Creatinine</label>
                          <input required type="number" step="0.1" name="sc" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 1.2" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Hemoglobin</label>
                          <input required type="number" step="0.1" name="hemo" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 12.5" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Specific Gravity</label>
                          <input required type="number" step="0.001" name="sg" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 1.020" />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5"
                    >
                      Analyze Risk
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Loading */}
            {step === 'loading' && (
              <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {getDiseaseDeets() && (() => { const Icon = getDiseaseDeets().icon; return <Icon className={`h-8 w-8 ${getDiseaseDeets().color}`} /> })()}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Analyzing Data...</h3>
                  <p className="text-gray-500 mt-2">Our ML model is crunching the numbers.</p>
                </div>
              </div>
            )}

            {/* Step 4: Result */}
            {step === 'result' && (
              <div className="py-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center space-y-4">
                  <div className={`mx-auto h-24 w-24 rounded-full flex items-center justify-center ${result?.status === 'High Risk' ? 'bg-red-100' : 'bg-green-100'}`}>
                    {getDiseaseDeets() && (() => { const Icon = getDiseaseDeets().icon; return <Icon className={`h-12 w-12 ${result?.status === 'High Risk' ? 'text-red-600' : 'text-green-600'}`} /> })()}
                  </div>
                  <h2 className="text-3xl font-extrabold text-gray-900">Assessment Complete</h2>
                </div>

                <div className={`p-8 rounded-2xl border-2 ${result?.status === 'High Risk' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left text-gray-800">
                      <p className="text-sm font-semibold tracking-wider uppercase opacity-80 mb-1">Risk Level</p>
                      <h3 className={`text-4xl font-black ${result?.status === 'High Risk' ? 'text-red-700' : 'text-green-700'}`}>
                        {result?.status}
                      </h3>
                      <p className="mt-2 text-lg opacity-90 max-w-md">
                        {result?.message}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <span className="text-5xl font-black text-gray-900">{result?.riskScore}<span className="text-2xl text-gray-400">%</span></span>
                      <span className="text-sm font-medium text-gray-500 mt-1">Confidence Score</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setStep('selection')}
                    className="w-full flex justify-center py-4 px-4 border-2 border-gray-200 rounded-xl shadow-sm text-lg font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
                  >
                    Start New Assessment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center opacity-60 text-sm">
          <p>Demo purpose only. Do not use for medical diagnosis.</p>
        </div>
      </div>
    </div>
  );
}
