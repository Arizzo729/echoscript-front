// 1. AssistantOrb.jsx (Advanced)
import React from "react";
import { motion } from "framer-motion";

const moodMap = {
  positive: "from-green-400 to-emerald-500",
  neutral: "from-blue-400 to-cyan-500",
  negative: "from-red-400 to-pink-500"
};

export default function AssistantOrb({ status = "idle", mood = "neutral" }) {
  const gradient = moodMap[mood] || moodMap.neutral;
  return (
    <motion.div
      className={`fixed bottom-24 right-8 z-40 w-14 h-14 bg-gradient-to-br ${gradient} rounded-full shadow-xl border-2 border-white/30`}
      animate={{ scale: status === "active" ? [1, 1.15, 1] : 1 }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <motion.div
        className="w-full h-full rounded-full backdrop-blur-sm"
        animate={{ rotate: status === "active" ? 360 : 0 }}
        transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
      />
    </motion.div>
  );
}
