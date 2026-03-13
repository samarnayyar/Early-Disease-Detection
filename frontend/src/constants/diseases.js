import { Activity, Wind, Droplet, HeartPulse } from 'lucide-react';

export const DISEASES = [
  {
    id: 'diabetes',
    name: 'Diabetes',
    icon: Droplet,
    color: 'text-red-500',
    bg: 'bg-red-50',
    description: 'Glucose & Metabolic Analysis'
  },
  {
    id: 'heart',
    name: 'Heart Disease',
    icon: HeartPulse,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    description: 'Cardiovascular Health'
  },
  {
    id: 'lung',
    name: 'Lung Disease',
    icon: Wind,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    description: 'Respiratory Function'
  },
  {
    id: 'kidney',
    name: 'Kidney Disease',
    icon: Activity,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    description: 'Renal & Fluid Balance'
  }
];

export const LOADING_PHASES = [
  "Checking your health details...",
  "Comparing with our medical data...",
  "Looking for any patterns...",
  "Finalizing your risk assessment..."
];
