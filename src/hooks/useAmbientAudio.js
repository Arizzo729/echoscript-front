// ✅ useAmbientAudio.js — EchoScript.AI Ambient Audio Hook (Enhanced)
import { useEffect, useRef, useState } from "react";

export default function useAmbientAudio(audioFile, defaultVolume = 0.4) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const fadeInterval = useRef(null);

  useEffect(() => {
    // Setup audio
    audioRef.current = new Audio(audioFile);
    audioRef.current.loop = true;
    audioRef.current.volume = 0;

    return () => {
      clearInterval(fadeInterval.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioFile]);

  const fade = (targetVolume, duration = 500) => {
    const audio = audioRef.current;
    if (!audio) return;

    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = (targetVolume - audio.volume) / steps;

    clearInterval(fadeInterval.current);
    fadeInterval.current = setInterval(() => {
      let newVolume = audio.volume + volumeStep;
      if (
        (volumeStep > 0 && newVolume >= targetVolume) ||
        (volumeStep < 0 && newVolume <= targetVolume)
      ) {
        newVolume = targetVolume;
        clearInterval(fadeInterval.current);
      }
      audio.volume = Math.max(0, Math.min(1, newVolume));
    }, stepTime);
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      fade(0.0, 500);
      setTimeout(() => {
        audio.pause();
        setIsPlaying(false);
      }, 500);
    } else {
      audio.play().catch((e) => console.warn("Audio play error:", e));
      fade(defaultVolume, 500);
      setIsPlaying(true);
    }
  };

  return {
    isPlaying,
    toggleAudio,
    setVolume: (v) => {
      if (audioRef.current) {
        audioRef.current.volume = Math.max(0, Math.min(1, v));
      }
    },
    get volume() {
      return audioRef.current?.volume ?? 0;
    },
  };
}

