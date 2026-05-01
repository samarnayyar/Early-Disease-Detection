import React from 'react';
import { AlertCircle, CheckCircle2, TrendingUp, TrendingDown, ArrowRight, ActivitySquare } from 'lucide-react';

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
    
    const sorted = [...breakdown].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
    const topFactors = sorted.slice(0, 4);
    
    const riskIncreasers = topFactors.filter(item => item.contribution > 0);
    const riskDecreasers = topFactors.filter(item => item.contribution < 0);
    
    return (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed text-lg">
          Based on a comprehensive algorithmic analysis of your clinical parameters, your risk profile is influenced by specific factors. Machine learning models evaluate not just single values, but how multiple metrics interact with each other. Here is a detailed breakdown of what is currently driving your assessment:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {riskIncreasers.length > 0 && (
            <div className="space-y-3 bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
              <h4 className="text-red-400 font-bold uppercase tracking-wider text-sm flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" /> Factors Increasing Risk
              </h4>
              <ul className="space-y-3">
                {riskIncreasers.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 mr-3 shrink-0"></span>
                    <span>Your <strong>{item.feature.replace(/_/g, ' ')}</strong> (recorded as {item.value.toFixed(1)}) is significantly contributing to a higher risk probability.</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {riskDecreasers.length > 0 && (
            <div className="space-y-3 bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/10">
              <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-sm flex items-center">
                <TrendingDown className="h-5 w-5 mr-2" /> Factors Lowering Risk
              </h4>
              <ul className="space-y-3">
                {riskDecreasers.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-3 shrink-0"></span>
                    <span>Your <strong>{item.feature.replace(/_/g, ' ')}</strong> (recorded as {item.value.toFixed(1)}) is within optimal ranges, helping to stabilize your health profile.</span>
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
        <h2 className="text-4xl font-black text-white tracking-tight">Assessment Results</h2>
        <p className="text-lg font-medium text-slate-400">Detailed breakdown of your clinical parameters</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Risk Analysis Card */}
        <div className="bg-slate-800/60 p-8 rounded-[2rem] border border-slate-700/50 relative overflow-hidden shadow-xl">
          <div className={`absolute top-0 left-0 w-full h-2 ${isHighRisk ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
          
          <div className="space-y-8 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Calculated Level</span>
              <span className={`px-4 py-1.5 rounded-xl text-sm font-black uppercase tracking-wide ${isHighRisk ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                {result?.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="relative h-6 w-full bg-slate-900 rounded-full overflow-hidden flex p-1 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                <div className="h-full bg-emerald-500 w-[40%] rounded-l-full"></div>
                <div className="h-full bg-yellow-500 w-[20%]"></div>
                <div className="h-full bg-red-500 w-[40%] rounded-r-full"></div>

                <div
                  className="absolute top-0 bottom-0 w-3 bg-white border border-slate-300 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-[1.5s] ease-out-back z-10"
                  style={{ left: `${result?.riskScore}%`, transform: 'translateX(-50%)' }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-widest px-2">
                <span>Low</span>
                <span>Mod</span>
                <span>High</span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <div className="text-7xl font-black text-white tracking-tighter">
                {result?.riskScore}<span className="text-3xl text-slate-500 ml-1">%</span>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Probability Score</p>
            </div>
            
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-700/50">
               <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl shrink-0 ${isHighRisk ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {isHighRisk ? <AlertCircle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Clinical Summary</h3>
                    <p className="text-sm font-medium text-slate-400 leading-relaxed">
                      {getRiskSummary(result?.status, result?.riskScore)}
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Feature Breakdown Card */}
        <div className="bg-slate-800/60 p-8 rounded-[2rem] border border-slate-700/50 shadow-xl flex flex-col h-full">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Parameter Contributions</h3>
            <p className="text-sm font-medium text-slate-400 mt-1">Factors driving your risk score (SHAP Analysis)</p>
          </div>
          
          <div className="flex-1 space-y-4">
            {result?.breakdown && result.breakdown.length > 0 ? (
              <>
                <div className="space-y-3">
                  {result.breakdown.map((item, idx) => {
                    const isRiskFactor = item.contribution > 0;
                    return (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/30">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-200 capitalize flex items-center space-x-2">
                            <span>{item.feature.replace(/_/g, ' ')}</span>
                          </span>
                          <span className="text-xs font-medium text-slate-500">Value: {item.value.toFixed(1)}</span>
                        </div>
                        <div className={`flex items-center space-x-2 font-black ${isRiskFactor ? 'text-red-400' : 'text-emerald-400'}`}>
                          <span>{isRiskFactor ? '+' : ''}{(item.contribution * 10).toFixed(1)}% impact</span>
                          {isRiskFactor ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {/* Explanation moved to bottom section */}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 p-8 border-2 border-dashed border-slate-700 rounded-2xl">
                <ActivitySquare className="h-10 w-10 opacity-50" />
                <p className="text-sm font-medium text-center">Detailed parameter breakdown is not available for this assessment.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Width AI Insights Card */}
      {result?.breakdown && result.breakdown.length > 0 && (
        <div className="bg-blue-500/5 border border-blue-500/20 p-8 md:p-10 rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <div className="mb-6">
            <h3 className="text-2xl font-black text-blue-400 tracking-tight flex items-center">
              <ActivitySquare className="h-6 w-6 mr-3" /> Clinical Risk Factors Report
            </h3>
          </div>
          {getShapExplanation(result.breakdown)}
        </div>
      )}

      <div className="pt-4">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-lg font-bold text-white transition-all transform hover:-translate-y-1"
        >
          <span>Start New Assessment</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
