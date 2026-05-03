import React from 'react';
import { DISEASES } from '../constants/diseases';
import { ActivitySquare, ShieldCheck, Zap, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DiseaseSelection({ onSelect }) {
  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700 pb-10">
      
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden rounded-lg bg-[#f4f0e6] border border-neutral-200 p-8 md:p-10 shadow-sm">
        
        <div className="relative z-10 space-y-6">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight leading-tight">
              Welcome to <span className="italic border-b-[3px] border-neutral-900 pb-0.5">Wellcore</span>
            </h1>
            
            <p className="text-lg text-neutral-700 leading-relaxed font-medium">
              An early detection platform built to screen for common health conditions. Enter your medical data, and receive a detailed risk assessment — helping you and your doctor take action sooner, not later.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-3 pt-2">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutral-700 bg-neutral-50 px-3 py-1.5 rounded-md border border-neutral-200">
              <ActivitySquare className="w-4 h-4 text-neutral-700" />
              <span>Decision Support</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutral-700 bg-neutral-50 px-3 py-1.5 rounded-md border border-neutral-200">
              <ShieldCheck className="w-4 h-4 text-neutral-700" />
              <span>Evidence-Based</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutral-700 bg-neutral-50 px-3 py-1.5 rounded-md border border-neutral-200">
              <Database className="w-4 h-4 text-neutral-700" />
              <span>4 Modules</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutral-700 bg-neutral-50 px-3 py-1.5 rounded-md border border-neutral-200">
              <Zap className="w-4 h-4 text-neutral-700" />
              <span>Instant Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Values Notice */}
      <div className="relative rounded-lg bg-[#f4f0e6] border border-neutral-200 p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 left-0 w-1 h-full bg-neutral-400 rounded-l-lg"></div>
        <div className="pl-4 space-y-3">
          <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wider">Before You Begin</h3>
          <p className="text-sm text-neutral-700 leading-relaxed">
            The values used in each assessment — such as hemoglobin levels, serum creatinine, blood glucose, cholesterol, and lung function scores — are <strong>clinical measurements</strong> typically found in a blood test, urine test, or medical report. These are not values you can estimate or guess on your own.
          </p>
          <p className="text-sm text-neutral-700 leading-relaxed">
            For the most accurate results, we recommend having a recent <strong>lab report or health check-up summary</strong> on hand before starting an assessment. If you don't have exact values, you can still proceed — missing fields will be filled with clinical averages — but the prediction will be more reliable with real data.
          </p>
        </div>
      </div>

      {/* Disease Selection Grid */}
      <div className="space-y-6">
        <div className="flex items-end justify-between px-2">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Available Assessments</h2>
            <p className="text-neutral-600 text-sm mt-1">Select a module to begin your evaluation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DISEASES.map((disease) => {
            const Icon = disease.icon;
            return (
              <motion.button
                key={disease.id}
                onClick={() => onSelect(disease.id)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group p-8 rounded-md border-2 transition-colors duration-300 text-left flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 bg-neutral-100/40 hover:bg-neutral-100/80 border-neutral-300/50 hover:border-neutral-800 hover:shadow-2xl hover:shadow-black/20"
              >
                <div className={`p-4 rounded-lg ${disease.bg} group-hover:scale-110 transition-transform duration-300 flex items-center justify-center shrink-0 border border-black/10 shadow-lg`}>
                  {disease.image ? (
                    <img src={disease.image} alt={disease.name} className="h-20 w-20 object-contain drop-shadow-xl" />
                  ) : (
                    <Icon className={`h-14 w-14 ${disease.color}`} />
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-black transition-colors">{disease.name}</h3>
                  <p className="text-sm font-medium text-neutral-600 mt-2 leading-relaxed">
                    {disease.description}
                  </p>
                  <div className="mt-4 inline-flex items-center space-x-1 text-xs font-bold text-neutral-800 uppercase tracking-wider group-hover:text-black transition-colors">
                    <span>Start Assessment</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
      
    </div>
  );
}
