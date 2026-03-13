import React from 'react';
import { LOADING_PHASES } from '../constants/diseases';

export default function LoadingScreen({ loadingPhase }) {
  return (
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
  );
}
