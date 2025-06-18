// src/pages/HomePage.jsx
import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { TbLanguage } from "react-icons/tb";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import AudioWaveform from "../components/AudioWaveform";
import useVoiceInput from "../hooks/useVoiceInput";
import useAmbientAudio from "../hooks/useAmbientAudio";
import ProgressTimeline from "../components/ProgressTimeline";
import LiveGPTBubble from "../components/LiveGPTBubble";
import { GPTContext } from "../context/GPTContext";
import detectTone from "../utils/EmotionToneDetector";
import NewsletterSignup from "../components/NewsletterSignup";
import { useTranslation } from "react-i18next";
import {
  FaDiscord,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
} from "react-icons/fa";
import { Sparkles } from "lucide-react";
import "../styles/GlareTitle.css";

export default function HomePage() {
  const [time, setTime] = useState(new Date());
  const [introStep, setIntroStep] = useState(0);
  const [gptResponse, setGptResponse] = useState(null);
  const [showBubble, setShowBubble] = useState(false);
  const { voiceLevel, micStatus, shortTranscript } = useVoiceInput();
  const { isPlaying, toggleAudio } = useAmbientAudio("/ambient-loop.mp3");
  const { setContextMessage } = useContext(GPTContext);
  const { t, i18n } = useTranslation();

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
      setIntroStep(2);
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
    { name: "Discord", href: "https://discord.com/invite/echoscriptai", icon: FaDiscord, color: "bg-indigo-600" },
    { name: "Instagram", href: "https://instagram.com/echoscriptai", icon: FaInstagram, color: "bg-pink-500" },
    { name: "LinkedIn", href: "https://linkedin.com/company/echoscriptai", icon: FaLinkedin, color: "bg-blue-700" },
    { name: "TikTok", href: "https://tiktok.com/@echoscriptai", icon: FaTiktok, color: "bg-black" },
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
              random: false,
              straight: false,
              outModes: { default: "out" }
            },
            links: {
              enable: true,
              distance: 120,
              color: "#00f5d4",
              opacity: 0.1,
              width: 1
            }
          },
          interactivity: {
            detectsOn: "canvas",
            events: { resize: true }
          }
        }}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.div className="mb-6" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
          <div className="relative w-24 sm:w-28 mx-auto mb-4 z-20">
            <motion.div
              className="absolute inset-0 rounded-full bg-teal-400 blur-2xl opacity-30"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <img src="/Icon.png" alt="EchoScript Icon" className="relative w-full drop-shadow-xl z-20" />
          </div>

          <h1 className="glare-title text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent z-20">
            EchoScript.AI
          </h1>

          {/* Typewriter line placed BELOW title now */}
          <div className="mt-3">
            <TypeAnimation
              sequence={["Crystal clear transcriptions.", 2000, "Real-time audio intelligence.", 2000, "AI that actually listens.", 2000]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-lg text-teal-400 z-20 font-medium"
            />
          </div>

          <p className="text-sm mt-1 text-zinc-400 font-mono z-20">{formattedTime}</p>
        </motion.div>

        <motion.div className="mt-2 mb-4">
          <AudioWaveform voiceLevel={voiceLevel} />
          <div className="text-xs text-zinc-500 mt-1 font-medium">{micStatus}</div>
        </motion.div>

        {gptResponse && showBubble && (
          <LiveGPTBubble message={gptResponse} onClose={() => setShowBubble(false)} />
        )}

        <motion.div
          className="max-w-2xl mx-auto bg-zinc-800/80 p-6 rounded-2xl border border-teal-700 backdrop-blur-md shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-lg leading-relaxed">
            Built by one voice for many—EchoScript.AI was started by a solo creator aiming to make clear, accessible transcriptions for all.
          </p>
        </motion.div>

        <ProgressTimeline currentStep={introStep} />
      </div>

      {/* About, Community, Newsletter, Controls sections stay unchanged */}
      {/* (Omitted here for brevity, as you've already reviewed them) */}
    </div>
  );
}

