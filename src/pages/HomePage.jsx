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
import { FaDiscord, FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  const [time, setTime] = useState(new Date());
  const [introStep, setIntroStep] = useState(0);
  const [gptResponse, setGptResponse] = useState(null);
  const [showBubble, setShowBubble] = useState(false);
  const { voiceLevel, micStatus, shortTranscript } = useVoiceInput();
  const { isPlaying, toggleAudio } = useAmbientAudio("/ambient-loop.mp3");
  const { setContextMessage } = useContext(GPTContext);
  const { t, i18n } = useTranslation();

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (shortTranscript?.length > 0) {
      const tone = detectTone(shortTranscript);
      const gptMsg = t(`gpt.${tone}`, { transcript: shortTranscript });
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
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          fullScreen: { enable: false },
          fpsLimit: 60,
          detectRetina: true,
          particles: {
            number: { value: 75, density: { enable: true, area: 800 } },
            color: { value: "#00f5d4" },
            shape: { type: "circle" },
            opacity: {
              value: 0.25,
              random: true,
              animation: {
                enable: true,
                speed: 0.4,
                minimumValue: 0.1,
                sync: false,
              },
            },
            size: {
              value: { min: 1, max: 2 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.3,
                sync: false,
              },
            },
            move: {
              enable: true,
              speed: 0.15,
              direction: "none",
              random: false,
              straight: false,
              outModes: { default: "out" },
              attract: { enable: false },
            },
            links: {
              enable: true,
              distance: 130,
              color: "#00f5d4",
              opacity: 0.1,
              width: 1,
            },
          },
          interactivity: {
            events: {
              onHover: { enable: false },
              onClick: { enable: false },
              resize: true,
            },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* Remaining content continues exactly the same (Hero section, waveform, GPT bubble, sections, controls) */}
    </div>
  );
}


