import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Lottie from "lottie-react";
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6 text-center backdrop-blur-xl bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-950 dark:to-zinc-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          {/* Ambient background orb */}
          <div
            ref={orbRef}
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-500 to-blue-500 opacity-10 blur-3xl animate-pulse"
          />

          {/* Logo icon only */}
          <div
            ref={logoRef}
            className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] bg-no-repeat bg-center"
            style={{
              WebkitMaskImage: "url('/Logo.png')",
              maskImage: "url('/Logo.png')",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              backgroundImage:
                "linear-gradient(90deg, #14b8a6, #0ea5e9, #14b8a6)",
              backgroundSize: "300% auto",
            }}
          />

          {/* Brand title */}
          <motion.div
            className="mt-6 text-4xl font-extrabold text-zinc-800 dark:text-white tracking-tight"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            EchoScript<span className="text-teal-400">.AI</span>
          </motion.div>

          {/* Waveform animation */}
          <div className="mt-6 w-24 h-24 sm:w-28 sm:h-28">
            <Lottie animationData={animationData} loop autoplay />
          </div>

          {/* Skip Button (ghost variant style) */}
          <button
            onClick={closeSplash}
            className="absolute bottom-6 right-6 text-sm px-4 py-2 rounded-lg bg-white/20 dark:bg-zinc-800/40 text-zinc-800 dark:text-white backdrop-blur hover:bg-white/30 hover:dark:bg-zinc-700/50 transition-all shadow-lg"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSplash;




