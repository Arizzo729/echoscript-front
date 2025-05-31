import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LogoLoader({ duration = 2500, onComplete }) {
  const [visible, setVisible] = useState(true);

  const close = () => {
    setVisible(false);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 500); // match fade-out
  };

  useEffect(() => {
    const timer = setTimeout(close, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="logo-loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6 text-center backdrop-blur-2xl bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-950 dark:to-zinc-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 🔄 Logo animation */}
          <motion.img
            src="/EchoScriptAI_Animated.svg"
            alt="EchoScript.AI Logo Animation"
            className="w-48 h-48 mb-4 object-contain"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* 🧠 Brand title */}
          <motion.h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-800 dark:text-white break-words"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            EchoScript<span className="text-teal-500">.AI</span>
          </motion.h1>

          {/* 🎧 Slogan */}
          <motion.p
            className="text-sm sm:text-base mt-2 text-zinc-500 dark:text-zinc-400 whitespace-pre-line"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            The Best Listener{"\n"}Understanding Everyone
          </motion.p>

          {/* 🔘 Bottom-right Skip Button */}
          <button
            onClick={close}
            className="absolute bottom-5 right-5 text-sm px-4 py-2 rounded-md bg-white/20 dark:bg-zinc-700/30 text-zinc-800 dark:text-white backdrop-blur hover:bg-white/30 hover:dark:bg-zinc-600/40 transition-all shadow-lg"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

