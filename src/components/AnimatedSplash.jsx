import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { gsap } from "gsap";
import animationData from "../assets/ai-waveform.json";

const AnimatedSplash = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const logoRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(logoRef.current, {
        backgroundPosition: "200% center",
        duration: 2.8,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(orbRef.current, {
        rotate: 360,
        duration: 22,
        ease: "linear",
        repeat: -1,
      });
    });

    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 2300);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-teal-100 dark:from-zinc-950 dark:to-zinc-900 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7 } }}
        >
          {/* 🌌 Orb Glow */}
          <div
            ref={orbRef}
            className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-teal-500 to-blue-500 opacity-10 blur-3xl"
          />

          {/* 🌀 Animated Logo Mask */}
          <div
            ref={logoRef}
            className="w-[160px] h-[160px] bg-[url('/Logo.png')] bg-no-repeat bg-center"
            style={{
              WebkitMaskImage: "url('/Logo.png')",
              maskImage: "url('/Logo.png')",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              backgroundSize: "250% auto",
              backgroundImage:
                "linear-gradient(90deg, #14b8a6, #0ea5e9, #14b8a6)",
            }}
          />

          {/* ✨ Brand Name */}
          <motion.div
            className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-800 dark:text-white"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            EchoScript.AI
          </motion.div>

          {/* 🔊 Lottie Visual Accent */}
          <div className="mt-4 w-20 h-20 sm:w-24 sm:h-24">
            <Lottie animationData={animationData} loop autoplay />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSplash;


