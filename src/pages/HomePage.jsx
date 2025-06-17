import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { TbLanguage } from "react-icons/tb";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
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

export default function HomePage() {
  const [time, setTime] = useState(new Date());
  const [introStep, setIntroStep] = useState(0);
  const [gptResponse, setGptResponse] = useState(null);
  const [showBubble, setShowBubble] = useState(false);
  const { voiceLevel, transcriptLive, micStatus, shortTranscript } = useVoiceInput();
  const { isPlaying, toggleAudio } = useAmbientAudio("/ambient-loop.mp3");
  const { setContextMessage } = useContext(GPTContext);
  const { t, i18n } = useTranslation();

  const particlesInit = async (main) => await loadFull(main);

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
      {/* Background Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          particles: {
            number: { value: 80 },
            size: { value: 1.5 },
            color: { value: "#00f5d4" },
            links: { enable: true, distance: 130, color: "#00f5d4", opacity: 0.1 },
            move: { enable: true, speed: 0.6 },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* Hero Section */}
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

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent animate-pulse z-20">
            EchoScript.AI
          </h1>

          <span className="text-lg mt-4 text-teal-400 z-20 font-medium">
            The Best Listeners
          </span>

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
            Built by one voice for many—EchoScript.AI was started by a solo creator aiming to make clear, accessible transcriptions for all. From students to podcasters to businesses, this service is for everyone who values their voice.
          </p>
        </motion.div>

        <ProgressTimeline currentStep={introStep} />
      </div>

      {/* About Section */}
      <section className="relative z-10 py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">ABOUT US</h2>
        <p className="max-w-3xl mx-auto text-zinc-400 text-lg">
          EchoScript.AI is a modern transcription platform driven by AI and inspired by human needs. We deliver accurate, fast, and user-friendly audio-to-text experiences—making communication accessible, archivable, and smart.
        </p>
      </section>

      {/* Community Section */}
      <section className="relative z-10 py-20 px-6 text-center border-t border-zinc-800 bg-transparent">
        <motion.div className="flex flex-col items-center mb-10">
          <Sparkles className="w-8 h-8 text-teal-400 mb-2 animate-pulse" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Check us out on social!</h2>
          <p className="text-zinc-400 mt-4 max-w-2xl">
            Follow us for updates, behind-the-scenes, product news, and other surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-center">
          {communityLinks.map(({ name, href, icon: Icon, color }) => (
            <motion.a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center p-4 rounded-xl text-white shadow-md hover:scale-[1.05] transition ${color}`}
              whileHover={{ scale: 1.1 }}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-sm font-semibold">{name}</span>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="relative z-10 py-20 px-6 text-center border-t border-zinc-800">
        <h2 className="text-3xl font-bold mb-4 text-white">What’s Next?</h2>
        <p className="max-w-3xl mx-auto text-zinc-400 text-lg">
          We’re building smarter features, better integrations, and new ways to understand your audio. Stay tuned—EchoScript is just getting started.
        </p>
      </section>

      {/* Newsletter Signup */}
      <section className="relative z-10 py-20 px-6 text-center border-t border-zinc-800">
        <h2 className="text-3xl font-bold text-white mb-4">Newsletter</h2>
        <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
          Subscribe for updates, feature announcements, and stories from behind the mic.
        </p>
        <NewsletterSignup />
      </section>

      {/* Controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 z-20">
        <motion.button
          onClick={() => i18n.changeLanguage(i18n.language === "en" ? "es" : "en")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-white border border-zinc-600 transition-all duration-300"
          whileTap={{ scale: 0.95 }}
        >
          <TbLanguage /> {i18n.language === "en" ? "Español" : "English"}
        </motion.button>

        <motion.button
          onClick={toggleAudio}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
            isPlaying
              ? "bg-teal-100/30 text-teal-300 border-teal-400 hover:bg-teal-200/40"
              : "bg-zinc-700/30 text-zinc-300 border-zinc-600 hover:bg-zinc-600/50"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? "🔊 Ambient On" : "🔈 Ambient Off"}
        </motion.button>
      </div>
    </div>
  );
}


