// ✅ EchoScript.AI — Final useAmbientAudio Hook with Fade, Autoplay, and Proper Cycling
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const trackLabels = ["Music 1", "Music 2", "Music 3", "Off"];

export default function useAmbientAudio(defaultVolume = 0.4) {
  const [trackIndex, setTrackIndex] = useState(3); // Start at 'Off'
  const audioRef = useRef(null);
  const fadeRef = useRef(null);

  const ambientUrls = useMemo(() => [
    new URL("../assets/sounds/ambient-loop-1.mp3", import.meta.url).href,
    new URL("../assets/sounds/ambient-loop-2.mp3", import.meta.url).href,
    new URL("../assets/sounds/ambient-loop-3.mp3", import.meta.url).href,
  ], []);

  const isOff = trackIndex === ambientUrls.length;

  const fadeTo = useCallback((targetVol, duration = 600) => {
    const audio = audioRef.current;
    if (!audio) return;

    const steps = 20;
    const interval = duration / steps;
    const step = (targetVol - audio.volume) / steps;

    clearInterval(fadeRef.current);
    fadeRef.current = setInterval(() => {
      let vol = audio.volume + step;
      if ((step > 0 && vol >= targetVol) || (step < 0 && vol <= targetVol)) {
        vol = targetVol;
        clearInterval(fadeRef.current);
      }
      audio.volume = Math.max(0, Math.min(1, vol));
    }, interval);
  }, []);

  useEffect(() => {
    clearInterval(fadeRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (isOff) return;

    const audio = new Audio(ambientUrls[trackIndex]);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    audio.play()
      .then(() => fadeTo(defaultVolume))
      .catch((err) => console.warn("Ambient audio error:", err));

    return () => {
      clearInterval(fadeRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [trackIndex, ambientUrls, defaultVolume, fadeTo, isOff]);

  const nextTrack = useCallback(() => {
    setTrackIndex((prev) => (prev + 1) % (ambientUrls.length + 1)); // cycle to Off
  }, [ambientUrls.length]);

  return {
    isPlaying: !isOff,
    currentTrack: trackLabels[trackIndex],
    nextTrack,
    trackIndex,
  };
}

