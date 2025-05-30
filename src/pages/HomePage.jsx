// EchoScript.AI HomePage.jsx — Premium AI Onboarding Experience

import React, { useEffect, useState, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";
import { FaMicrophoneAlt } from "react-icons/fa";
import { TbLanguage } from "react-icons/tb";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import SmartAIAssistant from "../components/SmartAIAssistant";
import AudioWaveform from "../components/AudioWaveform";
import useVoiceInput from "../components/hooks/useVoiceInput";
import useAmbientAudio from "../hooks/useAmbientAudio";
import ProgressTimeline from "../components/ProgressTimeline";
import AssistantOrb from "../components/AssistantOrb";
import LiveGPTBubble from "../components/LiveGPTBubble";
import { GPTContext } from "../context/GPTContext";
import detectTone from "../utils/EmotionToneDetector";

export default function HomePage() {
  const [time, setTime] = useState(new Date());
  const [language, setLanguage] = useState("en");
  const [introStep, setIntroStep] = useState(0);
  const [gptResponse, setGptResponse] = useState(null);
  const [showBubble, setShowBubble] = useState(false);
  const navigate = useNavigate();
  const { voiceLevel, transcriptLive, micStatus, shortTranscript } = useVoiceInput();
  const { isPlaying, toggleAudio } = useAmbientAudio("/ambient-loop.mp3");
  const { user, setUser, setContextMessage } = useContext(GPTContext);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const completed = localStorage.getItem("introComplete");
    if (completed) navigate("/dashboard");
  }, [navigate]);

  useEffect(() => {
    if (shortTranscript) {
      const tone = detectTone(shortTranscript);
      const gptMsg = tone === "positive"
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

  const handleSkip = () => {
    localStorage.setItem("introComplete", "true");
    navigate("/dashboard");
  };

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white overflow-hidden flex flex-col items-center justify-center text-center">
      {/* 🔮 Particle Effect */}
      <Particles
        id="tsparticles"
        init={loadFull}
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

      {/* 🌟 Animated Header */}
      <motion.div
        className="z-10 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <img src="/Logo.png" alt="EchoScript.AI" className="w-32 drop-shadow-xl mx-auto mb-4" />
        <h1 className="text-4xl sm:text-5xl font-bold">EchoScript.AI</h1>
        <TypeAnimation
          sequence={["The Best Listener", 1500, "Understanding everyone", 1500, shortTranscript ? `You said: ${shortTranscript}` : "Listening to you...", 2000]}
          speed={50}
          wrapper="span"
          repeat={Infinity}
          className="text-lg mt-3 text-teal-400"
        />
        <p className="text-sm mt-1 text-zinc-400">{formattedTime}</p>
      </motion.div>

      {/* 🔊 Audio Visualization */}
      <motion.div className="z-10 mt-2 mb-3">
        <AudioWaveform voiceLevel={voiceLevel} />
        <div className="text-xs text-zinc-500 mt-1">{micStatus}</div>
      </motion.div>

      {/* 💬 GPT Welcome Bubble */}
      {gptResponse && showBubble && <LiveGPTBubble message={gptResponse} onClose={() => setShowBubble(false)} />}

      {/* 📝 Assistant Message Box */}
      <motion.div
        className="max-w-xl mx-auto bg-zinc-800/80 p-5 rounded-xl border border-teal-700 backdrop-blur-md shadow-lg z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-lg leading-relaxed">
          Welcome to <span className="text-teal-400 font-semibold">EchoScript.AI</span>. This AI isn’t just listening — it’s learning your voice, your tone, and what matters to you.
        </p>
      </motion.div>

      {/* 🧭 Timeline Progress */}
      <ProgressTimeline currentStep={introStep} />

      {/* 🌐 Language & Audio Controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 z-20">
        <motion.button
          onClick={() => setLanguage(language === "en" ? "es" : "en")}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm text-white border border-zinc-600"
          whileTap={{ scale: 0.95 }}
        >
          <TbLanguage /> {language === "en" ? "Español" : "English"}
        </motion.button>
        <motion.button
          onClick={toggleAudio}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-teal-600 hover:bg-teal-500 text-sm text-white shadow-lg"
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? "Mute" : "Ambient"}
        </motion.button>
      </div>

      {/* ⏩ Skip Button */}
      <motion.button
        onClick={handleSkip}
        className="absolute bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-500 text-sm font-medium shadow-lg"
        whileTap={{ scale: 0.95 }}
      >
        Skip Intro <MdOutlineArrowForwardIos className="text-sm" />
      </motion.button>

      {/* 🧠 Assistant Orb */}
      <AssistantOrb status={introStep >= 2 ? "active" : "idle"} mood={shortTranscript ? detectTone(shortTranscript) : "neutral"} />

      {/* 🤖 GPT Assistant (Full Help) */}
      <SmartAIAssistant
        welcome={shortTranscript ? `You said: ${shortTranscript}` : "Need help getting started?"}
        position="bottom-right"
        autoOpenDelay={2500}
      />
    </div>
  );
}
