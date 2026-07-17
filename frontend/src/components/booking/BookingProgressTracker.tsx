"use client";

import React from "react";
import { Check } from "lucide-react";

interface TrackerProps {
  currentStep: number; // 1 to 5
}

const STEPS = [
  { step: 1, label: "Search" },
  { step: 2, label: "Select Flight" },
  { step: 3, label: "Passenger Details" },
  { step: 4, label: "Payment" },
  { step: 5, label: "Confirmation" }
];

export default function BookingProgressTracker({ currentStep }: TrackerProps) {
  return (
    <div className="max-w-3xl mx-auto mb-12 mt-6 px-4 relative z-10">
      <div className="flex items-center justify-between relative">
        {/* Background track */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 -translate-y-1/2 z-0" />
        
        {/* Active track fill */}
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-[#C5A880] -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((s) => {
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;

          return (
            <div key={s.step} className="flex flex-col items-center z-10 relative">
              <div 
                className={`h-8 w-8 rounded-full flex items-center justify-center font-space text-xs font-bold border transition-all duration-300 ${
                  isCompleted 
                    ? "bg-[#C5A880] text-black border-[#C5A880]" 
                    : isActive 
                    ? "bg-[#020B1E] text-[#C5A880] border-[#C5A880] shadow-[0_0_10px_rgba(197,168,128,0.3)]" 
                    : "bg-[#020B1E] text-slate-500 border-white/10"
                }`}
              >
                {isCompleted ? <Check className="h-4.5 w-4.5 stroke-[3]" /> : s.step}
              </div>
              <span 
                className={`text-[9px] uppercase tracking-widest font-space mt-2 transition-colors duration-300 font-bold ${
                  isActive ? "text-[#C5A880]" : isCompleted ? "text-white font-medium" : "text-slate-500"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
