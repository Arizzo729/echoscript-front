import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Lottie from "lottie-react";
import { X } from "lucide-react";
import animationData from "../assets/ai-waveform.json";

const AnimatedSplash = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const logoRef = useRef(null);
  const orbRef = useRef(null);

  const closeSplash = () => {
    setVisible(false);
    setTimeout(() => onComplete?.(), 500);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(logoRef.current, {
        backgroundPosition: "200% center",
        duration: 3,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(orbRef.current, {
        rotate: 360,
        duration: 20,
        ease: "linear",
        repeat: -1,
      });
    });

    const timer = setTimeout(closeSplash, 2500);
    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6 text-center backdrop-blur-2xl bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-950 dark:to-zinc-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          {/* Background orb */}
          <div
            ref={orbRef}
            className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-teal-500 to-blue-500 opacity-10 blur-3xl"
          />

          {/* Top-right close */}
          <button
            onClick={closeSplash}
            className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition"
            aria-label="Close splash"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Animated logo */}
          <div
            ref={logoRef}
            className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] bg-no-repeat bg-center"
            style={{
              WebkitMaskImage: "url('/Logo.png')",
              maskImage: "url('/Logo.png')",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              backgroundImage: "linear-gradient(90deg, #14b8a6, #0ea5e9, #14b8a6)",
              backgroundSize: "300% auto",
            }}
          />

          {/* Site title */}
          <motion.div
            className="mt-6 text-3xl font-bold text-zinc-800 dark:text-white tracking-tight"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            EchoScript.AI
          </motion.div>

          {/* Lottie waveform */}
          <div className="mt-6 w-20 h-20 sm:w-24 sm:h-24">
            <Lottie animationData={animationData} loop autoplay />
          </div>

          {/* Skip button */}
          <button
            onClick={closeSplash}
            className="absolute bottom-5 right-5 text-sm px-4 py-2 rounded-md bg-white/20 dark:bg-zinc-700/30 text-zinc-800 dark:text-white backdrop-blur hover:bg-white/30 hover:dark:bg-zinc-600/40 transition-all shadow-lg"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSplash;



