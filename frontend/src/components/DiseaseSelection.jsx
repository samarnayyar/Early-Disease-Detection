import React from 'react';
import { DISEASES } from '../constants/diseases';

export default function DiseaseSelection({ onSelect }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-bold text-slate-800">Choose Assessment Type</h2>
        <p className="text-lg text-slate-500">Select the health category you wish to evaluate</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DISEASES.map((disease) => {
          const Icon = disease.icon;
          return (
            <button
              key={disease.id}
              onClick={() => onSelect(disease.id)}
              className={`group p-8 rounded-3xl border-2 transition-all duration-300 text-left flex items-start space-x-6
                bg-white hover:border-black hover:shadow-xl hover:shadow-black/10 border-slate-100`}
            >
              <div className={`p-4 rounded-xl ${disease.bg} ${disease.color} group-hover:scale-110 transition-all`}>
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{disease.name}</h3>
                <p className="text-base text-slate-500 mt-2 leading-relaxed">
                  {disease.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
}
