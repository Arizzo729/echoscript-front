import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import AudioWaveform from "../components/AudioWaveform";
import useVoiceInput from "../hooks/useVoiceInput";
import LiveGPTBubble from "../components/LiveGPTBubble";
import { GPTContext } from "../context/GPTContext";
import detectTone from "../utils/EmotionToneDetector";
import NewsletterSignup from "../components/NewsletterSignup";
import { FaDiscord, FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import HintCarousel from "../components/HintCarousel";
import "../styles/GlareTitle.css";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";

export default function HomePage() {
  const [time, setTime] = useState(new Date());
  const [gptResponse, setGptResponse] = useState(null);
  const [showBubble, setShowBubble] = useState(false);
  const { voiceLevel, micStatus, shortTranscript } = useVoiceInput();
  const { setContextMessage } = useContext(GPTContext);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ((shortTranscript?.length ?? 0) > 0) {
      const tone = detectTone(shortTranscript);
      const gptMsg =
        tone === "positive"
          ? t("gpt.positive", { transcript: shortTranscript })
          : tone === "neutral"
          ? t("gpt.neutral", { transcript: shortTranscript })
          : t("gpt.negative", { transcript: shortTranscript });
      setGptResponse(gptMsg);
      setShowBubble(true);
      setContextMessage(shortTranscript);
    }
  }, [shortTranscript, setContextMessage, t]);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const communityLinks = [
    {
      name: "Discord",
      href: "https://discord.com/invite/echoscriptai",
      icon: FaDiscord,
      color: "bg-indigo-600",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/echoscriptai",
      icon: FaInstagram,
      color: "bg-pink-500",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/echoscriptai",
      icon: FaLinkedin,
      color: "bg-blue-700",
    },
    {
      name: "TikTok",
      href: "https://tiktok.com/@echoscriptai",
      icon: FaTiktok,
      color: "bg-black",
    },
  ];

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <Particles
        id="tsparticles"
        init={loadSlim}
        options={{
          background: { color: { value: "transparent" } },
          fullScreen: { enable: false },
          fpsLimit: 120,
          detectRetina: true,
          particles: {
            number: { value: 70, density: { enable: true, area: 1000 } },
            color: { value: "#00f5d4" },
            shape: { type: "circle" },
            opacity: { value: 0.2 },
            size: { value: { min: 1, max: 2 } },
            move: {
              enable: true,
              speed: 0.15,
              direction: "none",
              outModes: { default: "out" },
            },
            links: {
              enable: true,
              distance: 120,
              color: "#00f5d4",
              opacity: 0.1,
              width: 1,
            },
          },
        }}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <div className="w-24 sm:w-28 mx-auto mb-4 relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-teal-400 blur-2xl opacity-30"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <img
              src="/Icon.png"
              alt="EchoScript Icon"
              className="relative w-full drop-shadow-xl"
            />
          </div>

          <h1 className="glare-title text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            EchoScript.AI
          </h1>

          <div className="mt-3">
            <TypeAnimation
              sequence={[
                "Crystal clear transcriptions.",
                2000,
                "From voice to insight in seconds.",
                2000,
                "Edit, summarize, translate — effortlessly.",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-lg text-teal-400 font-medium"
            />
          </div>

          <p className="text-sm mt-1 text-zinc-400 font-mono">
            {formattedTime}
          </p>
        </motion.div>

        <motion.div className="mt-2 mb-4">
          <AudioWaveform voiceLevel={voiceLevel} />
          <div className="text-xs text-zinc-500 mt-1 font-medium">
            {t(micStatus)}
          </div>
        </motion.div>

        {gptResponse && showBubble && (
          <LiveGPTBubble message={gptResponse} onClose={() => setShowBubble(false)} />
        )}

        <motion.div
          className="relative max-w-3xl mx-auto px-8 py-6 mt-10 rounded-2xl overflow-hidden backdrop-blur-xl border border-teal-600/50 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-blue-500/10 pointer-events-none animate-pulse-slow" />
          <div className="absolute -inset-1 rounded-[2rem] border border-teal-500/30 blur-[3px] z-0" />
          <p className="relative z-10 text-lg sm:text-xl font-medium text-white leading-relaxed text-center tracking-wide">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent"
            >
              Built for creators, thinkers, and storytellers —
            </motion.span>{" "}
            EchoScript.AI turns your voice into beautifully clear, accurate, and editable text in seconds.
          </p>
        </motion.div>

        <HintCarousel />
      </div>

      {/* ... (rest of the sections remain unchanged) */}

      {/* Language toggle only */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageToggle />
      </div>
    </div>
  );
}