// AssistantAvatar.jsx
import React from "react";
import { motion } from "framer-motion";
import { Mic, Bot, Loader2 } from "lucide-react";

const moodMap = {
  idle: {
    icon: <Bot className="w-8 h-8 text-zinc-500" />, label: "Echo is listening...",
  },
  thinking: {
    icon: <Loader2 className="w-8 h-8 animate-spin text-teal-500" />, label: "Echo is thinking...",
  },
  speaking: {
    icon: <Mic className="w-8 h-8 text-teal-600 animate-pulse" />, label: "Echo is responding...",
  },
};

export default function AssistantAvatar({ mood = "idle" }) {
  const current = moodMap[mood] || moodMap.idle;

  return (
    <motion.div
      className="flex items-center gap-2 p-3 border-b dark:border-zinc-700"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800">
        {current.icon}
      </div>
      <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">
        {current.label}
      </span>
    </motion.div>
  );
}
