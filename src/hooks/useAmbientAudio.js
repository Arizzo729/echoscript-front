// ✅ useAmbientAudio.js — EchoScript Enhanced Ambient Audio Hook (with Fade In/Out)
import { useEffect, useRef, useState } from "react";

export default function useAmbientAudio(audioFile) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const fadeInterval = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(audioFile);
    audioRef.current.loop = true;
    audioRef.current.volume = 0;

    return () => {
      clearInterval(fadeInterval.current);
      audioRef.current.pause();
      audioRef.current = null;
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
      if ((volumeStep > 0 && newVolume >= targetVolume) || (volumeStep < 0 && newVolume <= targetVolume)) {
        newVolume = targetVolume;
        clearInterval(fadeInterval.current);
      }
      audio.volume = Math.max(0, Math.min(1, newVolume));
    }, stepTime);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (isPlaying) {
      fade(0.0, 500);
      setTimeout(() => {
        audio.pause();
        setIsPlaying(false);
      }, 500);
    } else {
      audio.play();
      fade(0.4, 500);
      setIsPlaying(true);
    }
  };

  return { isPlaying, toggleAudio };
}
