import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** LogoLoader: fullscreen animated logo loader */
export default function LogoLoader({ duration = 2000, onComplete }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDone(true);
      if (onComplete) onComplete();
    }, duration);
    return () => clearTimeout(timeout);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 px-6 text-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src="/EchoScriptAI_Animated.svg"
            alt="EchoScript.AI Logo Animation"
            className="w-48 h-48 mb-4 object-contain"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <motion.h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-800 dark:text-white break-words"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            EchoScript<span className="text-teal-500">.AI</span>
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base mt-2 text-zinc-500 dark:text-zinc-400 whitespace-pre-line"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            The Best Listener{"\n"}Understanding Everyone
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
}
