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
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(orbRef.current, {
        rotate: 360,
        duration: 30,
        ease: "linear",
        repeat: -1,
      });
    });

    const timer = setTimeout(closeSplash, 3200);
    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6 text-center bg-zinc-950 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          {/* 🔵 Ambient Orb */}
          <div
            ref={orbRef}
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-500 via-blue-500 to-teal-400 opacity-20 blur-3xl pointer-events-none"
          />

          {/* 🔊 Logo Mask with Gradient Motion */}
          <div
            ref={logoRef}
            className="w-[200px] h-[200px] bg-no-repeat bg-center"
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

          {/* 🧠 Brand Name */}
          <motion.h1
            className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            EchoScript<span className="text-teal-400">.AI</span>
          </motion.h1>

          {/* 📶 AI Pulse Lottie */}
          <div className="mt-6 w-24 h-24 sm:w-28 sm:h-28 opacity-80 pointer-events-none">
            <Lottie animationData={animationData} loop autoplay />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSplash;

