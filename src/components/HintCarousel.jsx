import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const hints = [
  {
    emoji: "🎙️",
    message: "Tap the mic to start live recording — we'll transcribe everything clearly in real time.",
  },
  {
    emoji: "📂",
    message: "Upload audio or video files and let EchoScript generate clean, timestamped transcripts.",
  },
  {
    emoji: "✨",
    message: "Turn long conversations into summaries with one click — powered by our smart AI assistant.",
  },
  {
    emoji: "🌐",
    message: "Switch between languages easily. We support English, Spanish, and more coming soon!",
  },
];

export default function HintCarousel() {
  const [index, setIndex] = useState(0);

  // Rotate every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % hints.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto mt-8 text-center px-6">
      <div className="h-20 sm:h-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="text-base sm:text-lg text-zinc-300 font-medium leading-relaxed px-4"
          >
            <span className="mr-2">{hints[index].emoji}</span>
            <span>{hints[index].message}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-3">
        {hints.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-teal-400 shadow-sm scale-110"
                : "bg-zinc-600 hover:bg-zinc-500"
            }`}
            aria-label={`Hint ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute top-0 left-4 sm:left-6 animate-pulse text-teal-400">
        <Sparkles className="w-5 h-5" />
      </div>
    </div>
  );
}
