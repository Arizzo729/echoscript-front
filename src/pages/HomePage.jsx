import React, { useEffect, useState, useContext, useMemo, Suspense, memo } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import useVoiceInput from "../hooks/useVoiceInput";
import { GPTContext } from "../context/GPTContext";
import detectTone from "../utils/EmotionToneDetector";
import LiveGPTBubble from "../components/LiveGPTBubble";
import { FaDiscord, FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import "../styles/GlareTitle.css";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";

// Lazy-loaded heavy components
const AudioWaveform = React.lazy(() => import("../components/AudioWaveform"));
const HintCarousel = React.lazy(() => import("../components/HintCarousel"));
const NewsletterSignup = React.lazy(() => import("../components/NewsletterSignup"));

function HomePage() {
  const [time, setTime] = useState(new Date());
  const [gptResponse, setGptResponse] = useState(null);
  const [showBubble, setShowBubble] = useState(false);
  const { voiceLevel, micStatus, shortTranscript } = useVoiceInput();
  const { setContextMessage } = useContext(GPTContext);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (shortTranscript?.length) {
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

  const formattedTime = useMemo(
    () =>
      time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    [time]
  );

  const communityLinks = useMemo(
    () => [
      { name: "Discord", href: "https://discord.com/invite/echoscriptai", icon: FaDiscord, color: "bg-indigo-600" },
      { name: "Instagram", href: "https://instagram.com/echoscriptai", icon: FaInstagram, color: "bg-pink-500" },
      { name: "LinkedIn", href: "https://linkedin.com/company/echoscriptai", icon: FaLinkedin, color: "bg-blue-700" },
      { name: "TikTok", href: "https://tiktok.com/@echoscriptai", icon: FaTiktok, color: "bg-black" },
    ], []
  );

  return (
    <div className="relative min-h-screen font-sans text-white overflow-x-hidden overflow-y-auto bg-gradient-to-b from-black via-zinc-900 to-black">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={loadSlim}
        options={{
          background: { color: { value: "transparent" } },
          fullScreen: { enable: false },
          fpsLimit: 120,
          detectRetina: true,
          particles: {
            number: { value: 60, density: { enable: true, area: 1200 } },
            color: { value: ["#00f5d4", "#10b981"] },
            shape: { type: "circle" },
            opacity: { value: { min: 0.1, max: 0.3 } },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 0.2, outModes: { default: "out" } },
            links: { enable: true, distance: 140, color: "#00f5d4", opacity: 0.2, width: 1 },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="w-28 mx-auto mb-6 relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-teal-400 blur-xl opacity-20"
              animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <img src="/Icon.png" alt="EchoScript Icon" className="relative w-full drop-shadow-2xl" />
          </motion.div>

          <h1 className="glare-title text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            EchoScript.AI <Sparkles className="inline w-6 h-6 ml-2 animate-pulse" />
          </h1>

          <div className="mt-4">
            <TypeAnimation
              sequence={[
                "Crystal clear transcriptions.", 2500,
                "From voice to insight in seconds.", 2500,
                "Edit, summarize, translate — effortlessly.", 2500,
              ]}
              speed={60}
              repeat={Infinity}
              className="text-xl text-teal-300 font-medium"
            />
          </div>

          <p className="text-sm mt-2 text-zinc-400 font-mono tracking-wide">{formattedTime}</p>
        </motion.div>

        <motion.div
          className="w-full max-w-md mt-8 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <Suspense fallback={<div className="h-12" />}>
            <AudioWaveform voiceLevel={voiceLevel} />
          </Suspense>
          <div className="text-xs text-zinc-500 mt-2 font-medium">{t(micStatus)}</div>
        </motion.div>

        {gptResponse && (
          <LiveGPTBubble message={gptResponse} onClose={() => setShowBubble(false)} />
        )}

        <motion.div
          className="relative w-full max-w-2xl px-10 py-8 mb-16 rounded-3xl backdrop-blur-lg border border-teal-500/40 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <p className="text-lg sm:text-xl font-medium text-white leading-relaxed tracking-wide">
            <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              Built for creators, thinkers, and storytellers —
            </span> EchoScript.AI turns your voice into beautifully clear, accurate, and editable text in seconds.
          </p>
        </motion.div>

        <Suspense fallback={null}>
          <HintCarousel />
        </Suspense>
      </main>

      {/* Newsletter & Community */}
      <motion.footer
        className="relative z-10 bg-zinc-900 py-16 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <Suspense fallback={null}>
            <NewsletterSignup />
          </Suspense>
          <div className="flex justify-center space-x-8">
            {communityLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link.color} p-4 rounded-full shadow-lg transform transition-transform duration-200 ease-out hover:scale-110`}
              >
                <link.icon className="w-7 h-7 text-white" />
              </a>
            ))}
          </div>
        </div>
      </motion.footer>

      {/* Language toggle */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageToggle />
      </div>
    </div>
  );
}

export default memo(HomePage);

