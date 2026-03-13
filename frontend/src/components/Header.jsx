import React from 'react';

export default function Header() {
  return (
    <div className="text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-1000">
      <h1 className="text-4xl md:text-5xl font-bold text-white">
        AI Health Risk Predictor
      </h1>
      <p className="text-lg md:text-xl text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
        Early Detection of Diseases Using Machine Learning
      </p>
    </div>
  );
}
