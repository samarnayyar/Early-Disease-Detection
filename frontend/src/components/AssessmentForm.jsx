import React, { useState, useRef } from 'react';
import { DISEASES } from '../constants/diseases';
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INFO = {
  age: {
    text: "Your age in years. While age is naturally part of health assessments, lifestyle choices and clinical test results usually have a much bigger impact on your actual risk levels than just the number of years.",
    range: "Varies by individual"
  },
  glucose: {
    text: "This measures the sugar levels in your blood. High levels are a key sign that your body might be struggling to process sugar, which is how diabetes is usually identified.",
    range: "70 – 140 mg/dL"
  },
  bmi: {
    text: "Body Mass Index (BMI) is a simple way to see if your weight is in a healthy range for your height. A higher BMI can sometimes be linked to a higher risk of health issues like diabetes.",
    range: "18.5 – 24.9"
  },
  bp: {
    text: "This is the lower number in a blood pressure reading. High blood pressure can put extra strain on your heart and kidneys, so keeping it in a healthy range is very important.",
    range: "60 – 80 mmHg"
  },
  insulin: {
    text: "Insulin is a hormone that helps your body turn sugar into energy. If these levels are unusual, it might mean your body is having a hard time managing its energy and sugar levels.",
    range: "2 – 20 mIU/L"
  },
  skinthickness: {
    text: "This is a simple measurement of body fat. It helps provides a better picture of your overall body composition and how it might be affecting your metabolism.",
    range: "10 – 30 mm"
  },
  dpf: {
    text: "This score looks at your family's health history. It helps estimate if you might have a genetic tendency toward certain conditions like diabetes.",
    range: "0.08 – 0.50"
  },
  pregnancies: {
    text: "For women, the number of pregnancies can sometimes affect how the body processes sugar and manages long-term health and metabolism.",
    range: "0 – 4"
  },
  sex: {
    text: "Biological sex can influence how certain health conditions develop or how they show up in clinical tests at different stages of life.",
    range: "Male or Female"
  },
  cp: {
    text: "This describes the type of chest pain you might feel. It's important to note that some heart conditions can occur even if you don't feel 'classic' sharp pain.",
    range: "Type 1 or No Pain"
  },
  chol: {
    text: "Cholesterol is a type of fat in your blood. Having too much can lead to buildup in your arteries, which is a major factor in heart health.",
    range: "Below 200 mg/dL"
  },
  thalach: {
    text: "This is the highest your heart rate goes during physical activity. It's a great way to see how well your heart responds when you're moving and working hard.",
    range: "70 – 160 BPM"
  },
  trestbps: {
    text: "Your blood pressure reading while you are resting. Consistently high numbers are one of the most common things doctors look at when checking heart health.",
    range: "90 – 120 mmHg"
  },
  fbs: {
    text: "This is your blood sugar level after not eating for a while (like in the morning). It shows how well your body maintains its sugar levels when 'at rest'.",
    range: "Below 100 mg/dL"
  },
  restecg: {
    text: "A recording of your heart's electrical activity while you're resting. It helps identify if the heart muscle might be under any unusual stress.",
    range: "Normal (Type 0)"
  },
  exang: {
    text: "This refers to chest pain that happens specifically when you are physically active. It's often a sign that the heart is working hard and needs more oxygen.",
    range: "No (Type 0)"
  },
  oldpeak: {
    text: "A specific measurement from a heart monitor during exercise. It helps show if the heart is getting a steady supply of blood when it needs it most.",
    range: "Below 1.0"
  },
  smoking_history: {
    text: "This counts how much you have smoked over the years. It is the single most important factor for lung health. If you've never smoked, just enter 0.",
    range: "0 (Non-smoker)"
  },
  smoking: {
    text: "Whether you currently smoke. Quitting is the best thing you can do for your lungs, as active smoking can quickly damage lung tissue over time.",
    range: "No (Type 0)"
  },
  fev1: {
    text: "This measures how much air you can forcefully breathe out in one second. It's a standard way to see how clear and healthy your airways are.",
    range: "Above 80%"
  },
  fvc: {
    text: "This is the total amount of air you can breathe out in one full breath. It helps show your overall lung capacity and how much air your lungs can hold.",
    range: "Above 80%"
  },
  cat_score: {
    text: "A simple score based on how your lung symptoms affect your daily life. A lower score means you are feeling better and your symptoms are manageable.",
    range: "Below 10"
  },
  diabetes_lung: {
    text: "Having diabetes can sometimes make lung issues more complicated because it can affect how the body handles inflammation and healing.",
    range: "No (Type 0)"
  },
  gender_lung: {
    text: "Biological sex can play a role in lung size and how quickly certain lung conditions might progress or respond to treatment.",
    range: "Male or Female"
  },
  bp_kidney: {
    text: "High blood pressure is very closely linked to kidney health. Keeping your blood pressure in a good range helps protect the delicate filters in your kidneys.",
    range: "60 – 80 mmHg"
  },
  sg: {
    text: "This measures how concentrated your urine is. It's a simple way to see how well your kidneys are doing their job of filtering and balancing fluids in your body.",
    range: "1.005 – 1.030"
  },
  al: {
    text: "Albumin is a protein that should stay in your blood. If it shows up in your urine, it can be an early sign that the filters in your kidneys need some attention.",
    range: "0 (Negative)"
  },
  su: {
    text: "Sugar should normally be reabsorbed by your kidneys. Finding sugar in your urine can be a sign of diabetes or that the kidneys aren't filtering correctly.",
    range: "0 (Negative)"
  },
  bu: {
    text: "This measures waste products in your blood. If these levels are high, it usually means the kidneys aren't filtering out waste as efficiently as they should.",
    range: "7 – 20 mg/dL"
  },
  sc: {
    text: "Creatinine is a common waste product. Measuring it is one of the most reliable ways for doctors to see exactly how well your kidneys are functioning.",
    range: "0.6 – 1.2 mg/dL"
  },
  bgr: {
    text: "A blood sugar test taken at any time of day. Keeping sugar levels stable is one of the most important ways to protect your kidneys over the long term.",
    range: "70 – 140 mg/dL"
  },
  hemo: {
    text: "Hemoglobin carries oxygen in your blood. Healthy kidneys help produce this, so low levels can sometimes be a sign that the kidneys need support.",
    range: "12 – 17 g/dL"
  },
  pcv: {
    text: "This shows the percentage of your blood made of red cells. It's another way to check for anemia, which is very common when kidneys aren't at 100%.",
    range: "36% – 50%"
  },
  sod: {
    text: "Sodium is an essential salt that your kidneys balance. Keeping this in range is key for your nerves, muscles, and overall fluid balance.",
    range: "135 – 145 mEq/L"
  },
  pot: {
    text: "Potassium is a mineral that helps your heart and muscles work. Your kidneys are responsible for making sure you have just the right amount.",
    range: "3.5 – 5.0 mEq/L"
  },
  rbcc: {
    text: "The number of red blood cells you have. Since kidneys help create these, a lower count can sometimes be an indicator of kidney health issues.",
    range: "4.0 – 5.5 m/cmm"
  },
  wbcc: {
    text: "White blood cells help your body fight off problems. High levels can be a sign of inflammation or an infection that might be affecting your kidneys.",
    range: "4,500 – 11k"
  },
  pc: {
    text: "Finding certain cells in a urine test can sometimes point to a simple infection or inflammation that needs to be cleared up to protect your kidneys.",
    range: "Normal"
  },
  htn: {
    text: "Hypertension is just the medical term for high blood pressure. It's one of the main things to manage to keep your kidneys healthy and strong.",
    range: "No (Type 0)"
  },
  dm: {
    text: "Diabetes Mellitus (DM) is the most common cause of kidney issues. Managing your sugar levels is the best way to keep your kidneys working well.",
    range: "No (Type 0)"
  },
  cad: {
    text: "Heart and kidney health are very closely connected. Taking care of your heart through exercise and diet also does wonders for your kidney health.",
    range: "No (Type 0)"
  },
  appet: {
    text: "Your appetite can actually be a sign of how your kidneys are doing. If the body isn't filtering waste well, you might not feel like eating as much.",
    range: "Good (Type 1)"
  },
  pe: {
    text: "This refers to swelling in your feet or legs. It happens when the body holds onto too much fluid, which can sometimes be linked to kidney function.",
    range: "No (Type 0)"
  },
  ane: {
    text: "Anemia means having a low red blood cell count. It's a very common and manageable condition that often happens alongside kidney health changes.",
    range: "No (Type 0)"
  },
};

function InfoTooltip({ id, openTooltip, setOpenTooltip, side = 'left' }) {
  const isOpen = openTooltip === id;
  const info = INFO[id];
  if (!info) return null;

  const alignClass = side === 'right' ? 'right-0' : 'left-0';
  const arrowClass = side === 'right' ? 'right-1' : 'left-1';

  return (
    <span className="relative inline-block ml-1.5 align-middle">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpenTooltip(isOpen ? null : id); }}
        className="w-4 h-4 rounded-full bg-neutral-400 hover:bg-neutral-600 text-white text-[10px] font-black inline-flex items-center justify-center transition-colors"
        aria-label="More info"
      >i</button>
      {isOpen && (
        <div className={`absolute ${alignClass} top-6 z-50 w-[280px] sm:w-[320px] p-4 bg-[#ede7de] text-neutral-800 text-sm rounded-xl shadow-2xl leading-relaxed border border-neutral-300 normal-case font-normal`}>
          <div className={`absolute -top-1.5 ${arrowClass} w-3 h-3 bg-[#ede7de] border-l border-t border-neutral-300 rotate-45`} />
          <p>{info.text}</p>
          {info.range && (
            <div className="mt-3 pt-3 border-t border-neutral-300/50 flex items-center justify-between gap-2">
              <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest whitespace-nowrap">Normal Range:</span>
              <span className="text-neutral-900 font-bold text-[13px]">{info.range}</span>
            </div>
          )}
        </div>
      )}
    </span>
  );
}

export default function AssessmentForm({ selectedDisease, formData, setFormData, onInputChange, onSubmit }) {
  const disease = DISEASES.find(d => d.id === selectedDisease);
  const Icon = disease?.icon;
  const [openTooltip, setOpenTooltip] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState(null); 
  const [lastExtractedKeys, setLastExtractedKeys] = useState(new Set());
  const fileInputRef = useRef(null);

  // Reset scanner state when changing diseases
  React.useEffect(() => {
    setScanStatus(null);
    setLastExtractedKeys(new Set());
    setIsScanning(false);
  }, [selectedDisease]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsScanning(true);
    setScanStatus('scanning');
    setLastExtractedKeys(new Set());

    const formDataToUpload = new FormData();
    formDataToUpload.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/extract-report', {
        method: 'POST',
        body: formDataToUpload,
      });

      const data = await response.json();

      if (data.success) {
        // Merge extracted data with current form data
        setFormData(prev => ({
          ...prev,
          ...data.extractedData
        }));
        setLastExtractedKeys(new Set(Object.keys(data.extractedData)));
        setScanStatus('success');
        setTimeout(() => setScanStatus(null), 6000);
      } else {
        throw new Error(data.error || 'Failed to analyze report');
      }
    } catch (error) {
      console.error("Scanning Error:", error);
      setScanStatus('error');
      alert(error.message || "Could not analyze the report. Please make sure the backend dependencies are installed.");
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const ic = "w-full px-4 py-3 text-base rounded-lg bg-[#ede7de] border border-neutral-300 text-neutral-900 focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 outline-none transition-all placeholder:text-neutral-500";
  const lc = "block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2";

  const L = ({ id, children, req, side = 'left' }) => {
    const wasScanned = lastExtractedKeys.has(id) && formData[id] !== undefined && formData[id] !== null && formData[id] !== '';
    const needsManual = scanStatus === 'success' && !wasScanned;
    
    return (
      <label className={`${lc} flex items-center justify-between`}>
        <span className="flex items-center">
          {children}{req && <span className="text-red-500 ml-1 font-bold">*</span>}
          <InfoTooltip id={id} openTooltip={openTooltip} setOpenTooltip={setOpenTooltip} side={side} />
        </span>
        <AnimatePresence>
          {needsManual && (
            <motion.span 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-bold text-neutral-500 bg-[#ede7de] px-2 py-0.5 rounded border border-neutral-300 shadow-sm"
            >
              Enter manually
            </motion.span>
          )}
        </AnimatePresence>
      </label>
    );
  };

  const getInClass = (id, req) => {
    const wasScanned = lastExtractedKeys.has(id) && formData[id] !== undefined && formData[id] !== null && formData[id] !== '';
    const needsManual = scanStatus === 'success' && !wasScanned;
    
    return `${ic} ${
      wasScanned ? 'border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-50/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 
      needsManual ? 'border-rose-400 ring-4 ring-rose-400/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 
      'border-neutral-300'
    } transition-all duration-500`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700" onClick={() => setOpenTooltip(null)}>
      <div className="flex items-center space-x-5 pb-6 border-b border-neutral-300/50">
        <div className={`p-4 rounded-lg ${disease?.bg} shadow-lg flex items-center justify-center border border-black/10`}>
          {disease?.image ? <img src={disease?.image} alt={disease?.name} className="h-16 w-16 object-contain drop-shadow-xl" /> : Icon && <Icon className={`h-12 w-12 ${disease?.color}`} />}
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
            Please enter any information you are aware of. For a valid assessment, you must provide a minimum of <strong>3 features</strong> (including your Age). Missing fields will be estimated using clinical baselines.
          </p>
        </div>
      </div>

      {/* ── Smart Report Scanner ── */}
      <div className="bg-neutral-100 border border-neutral-300 rounded-xl p-6 transition-all shadow-sm group relative overflow-hidden">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*,application/pdf" 
          className="hidden" 
        />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`p-3 rounded-lg ${
                scanStatus === 'success' ? 'bg-[#e3eadf] text-[#3e4f3a]' : 
                'bg-neutral-200 text-neutral-700'
              } transition-colors shadow-sm`}>
                {scanStatus === 'scanning' ? <Loader2 className="w-6 h-6 animate-spin" /> : 
                 scanStatus === 'success' ? <CheckCircle2 className="w-6 h-6" /> : 
                 <FileText className="w-6 h-6" />}
</div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Smart Report Scanner</h3>
                <p className="text-xs font-medium text-neutral-600 mt-0.5">Upload a PDF or Photo to auto-fill clinical values</p>
              </div>
            </div>

            {/* Recommended Tests Guide */}
            <div className="bg-white/50 rounded-lg p-3 border border-neutral-200/60">
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 flex items-center">
                <span className="w-1 h-1 bg-neutral-400 rounded-full mr-2"></span>
                Required {disease?.name} Reports (Any one will work)
              </p>
              <div className="flex flex-wrap gap-2">
                {(disease?.id === 'diabetes' ? ['Fasting Sugar (FBS)', 'HbA1c Test', 'RBS', 'Oral Glucose (OGTT)'] :
                  disease?.id === 'heart' ? ['Lipid Profile', 'ECG Report', 'Blood Pressure', 'Echo / TMT'] :
                  disease?.id === 'lung' ? ['Spirometry / PFT', 'Chest X-ray', 'ABG Test', 'Chest CT Scan'] :
                  disease?.id === 'kidney' ? ['Serum Creatinine', 'BUN / GFR', 'Urinalysis', 'Renal Ultrasound'] : []
                ).map((test, i) => (
                  <span key={i} className="text-[11px] font-bold px-2 py-1 bg-white border border-neutral-200 rounded text-neutral-700 shadow-sm">
                    {test}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-black transition-all shadow-md ${
                isScanning ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' : 
                scanStatus === 'success' ? 'bg-[#3e4f3a] text-white' : 
                'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : scanStatus === 'success' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Report Scanned</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status indicator bar for scanning */}
        {isScanning && (
          <div className="absolute bottom-0 left-0 h-1 bg-neutral-900 animate-[shimmer_2s_infinite]" style={{ width: '100%', backgroundSize: '200% 100%' }}></div>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Age — all diseases */}
          <div>
            <L id="age" req side="left">Patient Age</L>
            <input required type="number" min="0" name="age" value={formData.age || ''} onChange={onInputChange} className={getInClass('age', true)} placeholder="e.g. 45" />
          </div>

          {/* ── DIABETES ── */}
          {selectedDisease === 'diabetes' && (<>
            <div>
              <L id="glucose" req side="right">Glucose Level</L>
              <input required type="number" min="0" step="any" name="glucose" value={formData.glucose || ''} onChange={onInputChange} className={getInClass('glucose', true)} placeholder="mg/dL" />
            </div>
            <div>
              <L id="bmi" side="left">BMI</L>
              <input type="number" min="0" step="0.1" name="bmi" value={formData.bmi || ''} onChange={onInputChange} className={getInClass('bmi')} placeholder="Body Mass Index" />
            </div>
            <div>
              <L id="bp" side="right">Blood Pressure</L>
              <input type="number" min="0" step="any" name="bp" value={formData.bp || ''} onChange={onInputChange} className={getInClass('bp')} placeholder="mmHg" />
            </div>
            <div>
              <L id="insulin" side="left">Insulin</L>
              <input type="number" min="0" step="any" name="insulin" value={formData.insulin || ''} onChange={onInputChange} className={getInClass('insulin')} placeholder="U/ml" />
            </div>
            <div>
              <L id="skinthickness" side="right">Skin Thickness</L>
              <input type="number" min="0" step="any" name="skinthickness" value={formData.skinthickness || ''} onChange={onInputChange} className={getInClass('skinthickness')} placeholder="mm" />
            </div>
            <div>
              <L id="dpf" side="left">Diabetes Pedigree Func</L>
              <input type="number" min="0" step="0.01" name="dpf" value={formData.dpf || ''} onChange={onInputChange} className={getInClass('dpf')} placeholder="e.g. 0.5" />
            </div>
            <div>
              <L id="pregnancies" req side="right">Pregnancies</L>
              <select required name="pregnancies" value={formData.pregnancies || ''} onChange={onInputChange} className={getInClass('pregnancies', true)}>
                <option value="" className="bg-neutral-100">Select Count</option>
                <option value="0" className="bg-neutral-100">0 (Male / Never Pregnant)</option>
                <option value="1" className="bg-neutral-100">1</option>
                <option value="2" className="bg-neutral-100">2</option>
                <option value="3" className="bg-neutral-100">3</option>
                <option value="4" className="bg-neutral-100">4</option>
                <option value="6" className="bg-neutral-100">5+</option>
              </select>
            </div>
          </>)}

          {/* ── HEART ── */}
          {selectedDisease === 'heart' && (<>
            <div>
              <L id="sex" req side="right">Gender</L>
              <select required name="sex" value={formData.sex || ''} onChange={onInputChange} className={getInClass('sex', true)}>
                <option value="" className="bg-neutral-100">Select</option>
                <option value="1" className="bg-neutral-100">Male</option>
                <option value="0" className="bg-neutral-100">Female</option>
              </select>
            </div>
            <div>
              <L id="cp" side="left">Chest Pain Type</L>
              <select name="cp" value={formData.cp || ''} onChange={onInputChange} className={getInClass('cp')}>
                <option value="" className="bg-neutral-100">Select Type</option>
                <option value="1" className="bg-neutral-100">1: Standard Heart Pain</option>
                <option value="2" className="bg-neutral-100">2: Unusual Heart Pain</option>
                <option value="3" className="bg-neutral-100">3: Non-Heart Related Pain</option>
                <option value="4" className="bg-neutral-100">4: No Pain (Asymptomatic)</option>
              </select>
            </div>
            <div>
              <L id="chol" side="right">Cholesterol</L>
              <input type="number" min="0" step="any" name="chol" value={formData.chol || ''} onChange={onInputChange} className={getInClass('chol')} placeholder="mg/dl" />
            </div>
            <div>
              <L id="thalach" side="left">Max Heart Rate (thalach)</L>
              <input type="number" min="0" step="any" name="thalach" value={formData.thalach || ''} onChange={onInputChange} className={getInClass('thalach')} placeholder="BPM" />
            </div>
            <div>
              <L id="trestbps" side="right">Resting BP (trestbps)</L>
              <input type="number" min="0" step="any" name="trestbps" value={formData.trestbps || ''} onChange={onInputChange} className={getInClass('trestbps')} placeholder="mmHg" />
            </div>
            <div>
              <L id="fbs" side="left">Fasting Blood Sugar &gt; 120</L>
              <select name="fbs" value={formData.fbs || ''} onChange={onInputChange} className={getInClass('fbs')}>
                <option value="" className="bg-neutral-100">Select</option>
                <option value="1" className="bg-neutral-100">Yes</option>
                <option value="0" className="bg-neutral-100">No</option>
              </select>
            </div>
            <div>
              <L id="restecg" side="right">Resting ECG</L>
              <select name="restecg" value={formData.restecg || ''} onChange={onInputChange} className={getInClass('restecg')}>
                <option value="" className="bg-neutral-100">Select</option>
                <option value="0" className="bg-neutral-100">0: Normal</option>
                <option value="1" className="bg-neutral-100">1: ST-T Abnormality</option>
                <option value="2" className="bg-neutral-100">2: LVH</option>
              </select>
            </div>
            <div>
              <L id="exang" side="left">Exercise Angina</L>
              <select name="exang" value={formData.exang || ''} onChange={onInputChange} className={getInClass('exang')}>
                <option value="" className="bg-neutral-100">Select</option>
                <option value="1" className="bg-neutral-100">Yes</option>
                <option value="0" className="bg-neutral-100">No</option>
              </select>
            </div>
            <div>
              <L id="oldpeak" side="right">ST Depression (oldpeak)</L>
              <input type="number" min="0" step="0.1" name="oldpeak" value={formData.oldpeak || ''} onChange={onInputChange} className={getInClass('oldpeak')} placeholder="e.g. 1.5" />
            </div>
          </>)}

          {/* ── LUNG ── */}
          {selectedDisease === 'lung' && (<>
            <div>
              <L id="smoking_history" req side="right">Smoking History (Pack-years)</L>
              <input required type="number" min="0" name="smoking_history" value={formData.smoking_history || ''} onChange={onInputChange} className={getInClass('smoking_history', true)} placeholder="0 for non-smoker" />
            </div>
            <div>
              <L id="smoking" side="left">Currently Smoking</L>
              <select name="smoking" value={formData.smoking || ''} onChange={onInputChange} className={getInClass('smoking')}>
                <option value="" className="bg-neutral-100">Select</option>
                <option value="1" className="bg-neutral-100">Yes</option>
                <option value="0" className="bg-neutral-100">No</option>
              </select>
            </div>
            <div>
              <L id="fev1" side="right">FEV1 (Airflow in 1 sec)</L>
              <input type="number" min="0" step="0.01" name="fev1" value={formData.fev1 || ''} onChange={onInputChange} className={getInClass('fev1')} placeholder="Liters" />
            </div>
            <div>
              <L id="fvc" side="left">FVC (Total Lung Capacity)</L>
              <input type="number" min="0" step="0.01" name="fvc" value={formData.fvc || ''} onChange={onInputChange} className={getInClass('fvc')} placeholder="Liters" />
            </div>
            <div>
              <L id="cat_score" side="right">CAT Score (Symptoms Impact)</L>
              <input type="number" min="0" name="cat_score" value={formData.cat_score || ''} onChange={onInputChange} className={getInClass('cat_score')} placeholder="Range: 0-40" />
            </div>
            <div>
              <L id="diabetes_lung" side="left">Has Diabetes?</L>
              <select name="diabetes" value={formData.diabetes || ''} onChange={onInputChange} className={getInClass('diabetes')}>
                <option value="" className="bg-neutral-100">Select</option>
                <option value="1" className="bg-neutral-100">Yes</option>
                <option value="0" className="bg-neutral-100">No</option>
              </select>
            </div>
            <div>
              <L id="gender_lung" req side="right">Gender</L>
              <select required name="gender" value={formData.gender || ''} onChange={onInputChange} className={getInClass('gender', true)}>
                <option value="" className="bg-neutral-100">Select</option>
                <option value="1" className="bg-neutral-100">Male</option>
                <option value="0" className="bg-neutral-100">Female</option>
              </select>
            </div>
          </>)}

          {/* ── KIDNEY ── */}
          {selectedDisease === 'kidney' && (<>
            <div>
              <L id="bp" req side="right">Blood Pressure</L>
              <input required type="number" min="0" step="any" name="bp" value={formData.bp || ''} onChange={onInputChange} className={getInClass('bp', true)} placeholder="mmHg" />
            </div>
            <div>
              <L id="sg" side="left">Specific Gravity</L>
              <input type="number" min="1.000" step="0.001" name="sg" value={formData.sg || ''} onChange={onInputChange} className={getInClass('sg')} placeholder="1.005 - 1.025" />
            </div>
            <div>
              <L id="al" side="right">Albumin</L>
              <select name="al" value={formData.al || ''} onChange={onInputChange} className={getInClass('al')}>
                <option value="" className="bg-neutral-100">Select</option>
                {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n} className="bg-neutral-100">{n}</option>)}
              </select>
            </div>
            <div>
              <L id="su" side="left">Sugar</L>
              <select name="su" value={formData.su || ''} onChange={onInputChange} className={getInClass('su')}>
                <option value="" className="bg-neutral-100">Select</option>
                {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n} className="bg-neutral-100">{n}</option>)}
              </select>
            </div>
            <div>
              <L id="bu" side="right">Blood Urea</L>
              <input type="number" min="0" step="any" name="bu" value={formData.bu || ''} onChange={onInputChange} className={getInClass('bu')} placeholder="mgs/dl" />
            </div>
            <div>
              <L id="sc" side="left">Serum Creatinine</L>
              <input type="number" min="0" step="any" name="sc" value={formData.sc || ''} onChange={onInputChange} className={getInClass('sc')} placeholder="mgs/dl" />
            </div>
            <div>
              <L id="bgr" side="right">Blood Glucose Random</L>
              <input type="number" min="0" step="any" name="bgr" value={formData.bgr || ''} onChange={onInputChange} className={getInClass('bgr')} placeholder="mgs/dl" />
            </div>
            <div>
              <L id="hemo" side="left">Hemoglobin</L>
              <input type="number" min="0" step="any" name="hemo" value={formData.hemo || ''} onChange={onInputChange} className={getInClass('hemo')} placeholder="gms" />
            </div>
            <div>
              <L id="pcv" side="right">Packed Cell Volume</L>
              <input type="number" min="0" step="any" name="pcv" value={formData.pcv || ''} onChange={onInputChange} className={getInClass('pcv')} placeholder="%" />
            </div>
            <div>
              <L id="sod" side="left">Sodium</L>
              <input type="number" min="0" step="0.1" name="sod" value={formData.sod || ''} onChange={onInputChange} className={getInClass('sod')} placeholder="mEq/L" />
            </div>
            <div>
              <L id="pot" side="right">Potassium</L>
              <input type="number" min="0" step="0.1" name="pot" value={formData.pot || ''} onChange={onInputChange} className={getInClass('pot')} placeholder="mEq/L" />
            </div>
            <div>
              <L id="rbcc" side="left">RBC Count</L>
              <input type="number" min="0" step="0.1" name="rbcc" value={formData.rbcc || ''} onChange={onInputChange} className={getInClass('rbcc')} placeholder="millions/cmm" />
            </div>
            <div>
              <L id="wbcc" side="right">WBC Count</L>
              <input type="number" min="0" step="any" name="wbcc" value={formData.wbcc || ''} onChange={onInputChange} className={getInClass('wbcc')} placeholder="cells/cumm" />
            </div>
            <div>
              <L id="pc" side="left">Pus Cells</L>
              <select name="pc" value={formData.pc || ''} onChange={onInputChange} className={getInClass('pc')}>
                <option value="" className="bg-neutral-100">Select</option>
                <option value="1" className="bg-neutral-100">Normal</option>
                <option value="0" className="bg-neutral-100">Abnormal</option>
              </select>
            </div>
            <div>
              <L id="htn" side="right">Hypertension</L>
              <select name="htn" value={formData.htn || ''} onChange={onInputChange} className={getInClass('htn')}>
                <option value="" className="bg-neutral-100">Select</option>
                <option value="1" className="bg-neutral-100">Yes</option>
                <option value="0" className="bg-neutral-100">No</option>
              </select>
            </div>
            <div>
              <L id="dm" side="left">Diabetes Mellitus</L>
              <select name="dm" value={formData.dm || ''} onChange={onInputChange} className={getInClass('dm')}>
                <option value="" className="bg-neutral-100">Select</option>
                <option value="1" className="bg-neutral-100">Yes</option>
                <option value="0" className="bg-neutral-100">No</option>
              </select>
            </div>
            <div>
              <L id="cad" side="right">Coronary Artery Disease</L>
              <select name="cad" value={formData.cad || ''} onChange={onInputChange} className={getInClass('cad')}>
                <option value="" className="bg-neutral-100">Select</option>
                <option value="1" className="bg-neutral-100">Yes</option>
                <option value="0" className="bg-neutral-100">No</option>
              </select>
            </div>
            <div>
              <L id="appet" side="left">Appetite</L>
              <select name="appet" value={formData.appet || ''} onChange={onInputChange} className={getInClass('appet')}>
                <option value="" className="bg-neutral-100">Select</option>
                <option value="1" className="bg-neutral-100">Good</option>
                <option value="0" className="bg-neutral-100">Poor</option>
              </select>
            </div>
            <div>
              <L id="pe" side="right">Pedal Edema</L>
              <select name="pe" value={formData.pe || ''} onChange={onInputChange} className={getInClass('pe')}>
                <option value="" className="bg-neutral-100">Select</option>
                <option value="1" className="bg-neutral-100">Yes</option>
                <option value="0" className="bg-neutral-100">No</option>
              </select>
            </div>
            <div>
              <L id="ane" side="left">Anemia</L>
              <select name="ane" value={formData.ane || ''} onChange={onInputChange} className={getInClass('ane')}>
                <option value="" className="bg-neutral-100">Select</option>
                <option value="1" className="bg-neutral-100">Yes</option>
                <option value="0" className="bg-neutral-100">No</option>
              </select>
            </div>
          </>)}

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
