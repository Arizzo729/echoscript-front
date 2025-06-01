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

    const timer = setTimeout(closeSplash, 3000);
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
          {/* Animated Orb Background */}
          <div
            ref={orbRef}
            className="absolute w-[480px] h-[480px] rounded-full bg-gradient-to-br from-teal-500 via-blue-500 to-teal-400 opacity-20 blur-3xl"
          />

          {/* EchoScript Logo Icon */}
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

          {/* Brand Name */}
          <motion.div
            className="mt-6 text-4xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            EchoScript<span className="text-teal-400">.AI</span>
          </motion.div>

          {/* Lottie Waveform */}
          <div className="mt-6 w-24 h-24 sm:w-28 sm:h-28 opacity-80">
            <Lottie animationData={animationData} loop autoplay />
          </div>

          {/* Subtle "Skip" Link */}
          <button
            onClick={closeSplash}
            className="absolute bottom-6 right-6 text-sm text-teal-400 hover:text-teal-300 transition"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSplash;




