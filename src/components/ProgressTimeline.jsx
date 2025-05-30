// 7. ProgressTimeline.jsx (Animated and responsive)
import React from "react";
import { motion } from "framer-motion";

export default function ProgressTimeline({ currentStep = 0 }) {
  const steps = ["Mic", "Voice", "AI", "Start"];

  return (
    <div className="flex justify-center gap-6 mt-8 z-10">
      {steps.map((label, index) => (
        <div key={index} className="flex flex-col items-center">
          <motion.div
            className={`w-5 h-5 rounded-full ${index <= currentStep ? "bg-teal-400" : "bg-zinc-700"}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: index === currentStep ? 1.3 : 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          ></motion.div>
          <span className="text-xs mt-1 text-zinc-400">{label}</span>
        </div>
      ))}
    </div>
  );
}
