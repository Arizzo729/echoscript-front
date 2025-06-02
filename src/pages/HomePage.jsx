// ✅ EchoScript.AI — Enhanced HomePage with Scroll Sections & Newsletter
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

export default function HomePage() {
  const [time, setTime] = useState(new Date());
  const [language, setLanguage] = useState("en");
  const [introStep, setIntroStep] = useState(0);
  const [gptResponse, setGptResponse] = useState(null);
  const [showBubble, setShowBubble] = useState(false);
  const { voiceLevel, transcriptLive, micStatus, shortTranscript } = useVoiceInput();
  const { isPlaying, toggleAudio } = useAmbientAudio("/ambient-loop.mp3");
  const { setContextMessage } = useContext(GPTContext);

  const particlesInit = async (main) => await loadFull(main);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (shortTranscript) {
      const tone = detectTone(shortTranscript);
      const gptMsg =
        tone === "positive"
          ? `You sound excited! You said: “${shortTranscript}.” Let’s make something great.`
          : tone === "neutral"
          ? `Got it — you said: “${shortTranscript}.” Let’s begin.`
          : `You said: “${shortTranscript}.” Don’t worry, I’ve got your back.`;
      setGptResponse(gptMsg);
      setIntroStep(2);
      setShowBubble(true);
      setContextMessage(shortTranscript);
    }
  }, [shortTranscript, setContextMessage]);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white overflow-x-hidden overflow-y-auto flex flex-col items-center px-4">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          particles: {
            number: { value: 40 },
            size: { value: 2 },
            color: { value: "#00f5d4" },
            links: { enable: true, distance: 150, color: "#00f5d4", opacity: 0.2 },
            move: { enable: true, speed: 1 },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* Hero Section */}
      <motion.div className="z-10 mt-24 mb-6 text-center">
        <div className="relative w-24 sm:w-28 mx-auto mb-4">
          <motion.div
            className="absolute inset-0 rounded-full bg-teal-400 blur-2xl opacity-30"
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <img src="/Icon.png" alt="EchoScript Icon" className="relative w-full drop-shadow-xl" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">EchoScript.AI</h1>
        <TypeAnimation
          sequence={[
            "The Best Listener",
            1500,
            "Understanding everyone",
            1500,
            shortTranscript ? `You said: ${shortTranscript}` : "Listening to you...",
            2000,
          ]}
          speed={50}
          wrapper="span"
          repeat={Infinity}
          className="text-lg mt-3 text-teal-400"
        />
        <p className="text-sm mt-1 text-zinc-400 font-mono">{formattedTime}</p>
      </motion.div>

      <motion.div className="z-10 mt-2 mb-3">
        <AudioWaveform voiceLevel={voiceLevel} />
        <div className="text-xs text-zinc-500 mt-1 font-medium">{micStatus}</div>
      </motion.div>

      {gptResponse && showBubble && (
        <LiveGPTBubble message={gptResponse} onClose={() => setShowBubble(false)} />
      )}

      <ProgressTimeline currentStep={introStep} />

      {/* About Section */}
      <section className="mt-20 max-w-3xl text-center space-y-4 z-10">
        <h2 className="text-3xl font-bold text-teal-400">About EchoScript</h2>
        <p className="text-zinc-300 text-lg leading-relaxed">
          EchoScript.AI is an intelligent transcription and voice understanding platform that helps you convert speech into clean, structured, and smart text. Designed to be inclusive, adaptive, and insightful.
        </p>
      </section>

      {/* Features Section */}
      <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 z-10">
        {["Dashboard", "Upload & Mic", "Smart Assistant", "User Account", "Settings", "Transcripts"].map((feature, idx) => (
          <div key={idx} className="bg-zinc-800/70 p-6 rounded-xl border border-zinc-700 text-center hover:scale-105 transition-transform duration-300">
            <h3 className="text-lg font-semibold text-white mb-2">{feature}</h3>
            <p className="text-sm text-zinc-400">Explore the {feature.toLowerCase()} page to customize, interact, and get the most out of your voice data.</p>
          </div>
        ))}
      </section>

      {/* Newsletter Signup */}
      <section className="mt-20 mb-24 max-w-xl w-full bg-zinc-800/80 border border-teal-700 backdrop-blur-md shadow-lg p-6 rounded-2xl z-10 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Stay Updated</h3>
        <p className="text-zinc-400 mb-4">Subscribe to our newsletter for updates, releases, and AI tips.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Subscribed! (placeholder)");
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="px-4 py-2 w-full sm:w-auto rounded-md text-black"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-blue-500 transition-all"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* Top Controls */}
      <div className="fixed top-6 right-6 flex flex-col gap-3 z-20">
        <motion.button
          onClick={() => setLanguage(language === "en" ? "es" : "en")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-white border border-zinc-600 transition-all duration-300"
          whileTap={{ scale: 0.95 }}
        >
          <TbLanguage /> {language === "en" ? "Español" : "English"}
        </motion.button>
        <motion.button
          onClick={toggleAudio}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-600 hover:bg-blue-500 text-sm text-white shadow-md transition-all duration-500"
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? "Mute" : "Ambient"}
        </motion.button>
      </div>
    </div>
  );
}
