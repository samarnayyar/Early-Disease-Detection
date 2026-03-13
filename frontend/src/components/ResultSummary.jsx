import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResultSummary({ result, onReset }) {
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
    <div className="py-0 space-y-6 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">Risk Assessment Summary</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Risk Analysis Card */}
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
          onClick={onReset}
          className="w-full flex justify-center py-3 px-4 border border-slate-200 rounded-2xl text-lg font-bold text-slate-500 bg-white hover:bg-slate-50 transition-all hover:text-black hover:border-black"
        >
          New Assessment
        </button>
      </div>
    </div>
  );
}
