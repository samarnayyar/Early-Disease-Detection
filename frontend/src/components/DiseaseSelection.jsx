import React from 'react';
import { DISEASES } from '../constants/diseases';
import { ActivitySquare, ShieldCheck, Zap, Database } from 'lucide-react';

export default function DiseaseSelection({ onSelect }) {
  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700 pb-10">
      
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-900/40 to-slate-900/80 border border-blue-500/20 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <ActivitySquare className="w-64 h-64 text-blue-400 transform rotate-12" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30 text-sm font-bold tracking-wide uppercase">
            <ActivitySquare className="w-4 h-4" />
            <span>Clinical Decision Support</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">MedPredict</span>
          </h1>
          
          <p className="text-lg text-slate-300 leading-relaxed font-medium">
            A state-of-the-art predictive healthcare engine. We use statistical algorithms to analyze your clinical parameters and identify early risk patterns for major medical conditions.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-400 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Evidence-Based</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-400 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
              <Database className="w-5 h-5 text-blue-400" />
              <span>4 Clinical Modules</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Selection Grid */}
      <div className="space-y-6">
        <div className="flex items-end justify-between px-2">
          <div>
            <h2 className="text-2xl font-bold text-white">Available Assessments</h2>
            <p className="text-slate-400 text-sm mt-1">Select a module to begin your evaluation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DISEASES.map((disease) => {
            const Icon = disease.icon;
            return (
              <button
                key={disease.id}
                onClick={() => onSelect(disease.id)}
                className="group p-8 rounded-[2rem] border-2 transition-all duration-300 text-left flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <div className={`p-4 rounded-3xl ${disease.bg} group-hover:scale-110 transition-transform duration-300 flex items-center justify-center shrink-0 border border-white/10 shadow-lg`}>
                  {disease.image ? (
                    <img src={disease.image} alt={disease.name} className="h-20 w-20 object-contain drop-shadow-xl" />
                  ) : (
                    <Icon className={`h-14 w-14 ${disease.color}`} />
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{disease.name}</h3>
                  <p className="text-sm font-medium text-slate-400 mt-2 leading-relaxed">
                    {disease.description}
                  </p>
                  <div className="mt-4 inline-flex items-center space-x-1 text-xs font-bold text-blue-400 uppercase tracking-wider group-hover:text-blue-300 transition-colors">
                    <span>Start Assessment</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      
    </div>
  );
}
