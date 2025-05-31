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
        duration: 3,
        ease: "power2.inOut",
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

    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 2000); // 2 seconds

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-zinc-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7 } }}
        >
          {/* 🌀 Orb Glow */}
          <div
            ref={orbRef}
            className="absolute w-[340px] h-[340px] rounded-full bg-gradient-to-tr from-teal-500 to-blue-500 opacity-10 blur-2xl"
          />

          {/* 🔄 Animated Logo */}
          <div
            ref={logoRef}
            className="w-40 h-40 bg-[url('/Logo.png')] bg-contain bg-no-repeat bg-center"
            style={{
              WebkitMaskImage: "url('/Logo.png')",
              maskImage: "url('/Logo.png')",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              backgroundSize: "200% auto",
              backgroundImage: "linear-gradient(90deg, #14b8a6, #0ea5e9, #14b8a6)",
            }}
          />

          {/* 💬 Updated Tagline */}
          <motion.div
            className="mt-6 text-xl font-semibold text-zinc-700 dark:text-zinc-300"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            EchoScript.AI
          </motion.div>

          {/* 🔊 Lottie Pulse */}
          <div className="mt-4 w-24 h-24">
            <Lottie animationData={animationData} loop autoplay />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSplash;

