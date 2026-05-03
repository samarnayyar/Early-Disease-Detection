import React from 'react';
import { LOADING_PHASES } from '../constants/diseases';

export default function LoadingScreen({ loadingPhase }) {
  return (
    <div className="py-8 flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="h-16 w-16 rounded-full border-4 border-neutral-300 border-t-neutral-900 animate-spin"></div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-neutral-800">Processing Assessment</h3>
        <div className="space-y-2 text-left mx-auto inline-block">
          {LOADING_PHASES.map((phase, idx) => (
            <div key={idx} className={`flex items-center space-x-3 text-sm transition-all duration-200 ${idx === loadingPhase ? 'text-neutral-900 font-bold scale-[1.02]' : idx < loadingPhase ? 'text-neutral-500 opacity-60' : 'text-neutral-400'}`}>
              <div className={`h-1.5 w-1.5 rounded-full ${idx === loadingPhase ? 'bg-neutral-900 animate-pulse' : idx < loadingPhase ? 'bg-neutral-500' : 'bg-neutral-300'}`}></div>
              <span>{phase}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
