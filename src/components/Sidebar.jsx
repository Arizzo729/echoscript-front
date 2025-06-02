/// ✅ EchoScript.AI — Final Polished Sidebar.jsx
// ...Sidebar code remains unchanged


// ✅ EchoScript.AI — Final Polished HomePage.jsx
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
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white overflow-x-hidden">
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <div className="relative w-24 sm:w-28 mx-auto mb-4">
            <motion.div
              className="absolute inset-0 rounded-full bg-teal-400 blur-2xl opacity-30"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <img src="/Icon.png" alt="EchoScript Icon" className="relative w-full drop-shadow-xl" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
            EchoScript.AI
          </h1>

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
            className="text-lg mt-4 text-teal-400"
          />

          <p className="text-sm mt-1 text-zinc-400 font-mono">{formattedTime}</p>
        </motion.div>

        {/* Mic Status + Waveform */}
        <motion.div className="mt-2 mb-4">
          <AudioWaveform voiceLevel={voiceLevel} />
          <div className="text-xs text-zinc-500 mt-1 font-medium">{micStatus}</div>
        </motion.div>

        {gptResponse && showBubble && (
          <LiveGPTBubble message={gptResponse} onClose={() => setShowBubble(false)} />
        )}

        {/* Welcome Block */}
        <motion.div
          className="max-w-2xl mx-auto bg-zinc-800/80 p-6 rounded-2xl border border-teal-700 backdrop-blur-md shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-lg leading-relaxed">
            Welcome to <span className="text-teal-400 font-semibold">EchoScript.AI</span>. This AI isn’t just
            listening — it’s learning your voice, your tone, and what matters to you.
          </p>
        </motion.div>

        <ProgressTimeline currentStep={introStep} />
      </div>

      {/* About */}
      <section className="relative z-10 py-24 px-6 bg-zinc-900/80 backdrop-blur-xl text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">About EchoScript</h2>
        <p className="max-w-3xl mx-auto text-zinc-400 text-lg">
          We’re building the world’s most intelligent and empathetic transcription platform — one that adapts to
          accents, emotions, and even muffled voices. Our goal is to make voice truly accessible.
        </p>
      </section>

      {/* Coming Soon */}
      <section className="relative z-10 py-24 px-6 bg-zinc-950 border-t border-zinc-800 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">What’s Coming Soon</h2>
        <p className="max-w-3xl mx-auto text-zinc-400 text-lg">
          EchoScript is evolving — expect real-time collaboration, multi-language exports, GPT voice summarization,
          and seamless integrations with Google Drive, Slack, and Notion.
        </p>
      </section>

      {/* Newsletter Signup */}
      <section className="relative z-10 py-20 px-6 bg-zinc-900 text-center border-t border-zinc-800">
        <h2 className="text-3xl font-bold text-white mb-4">Join Our Newsletter</h2>
        <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
          Get updates on new features, AI improvements, and exclusive insights from EchoScript engineers.
        </p>
        <NewsletterSignup />
      </section>

      {/* Top-right controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 z-20">
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


