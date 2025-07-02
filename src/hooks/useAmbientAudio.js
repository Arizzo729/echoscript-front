// ✅ EchoScript.AI — Optimized Ambient Audio Hook with Fade, Unlock, and Cycling
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const trackLabels = ["Music 1", "Music 2", "Music 3", "Off"];

export default function useAmbientAudio(defaultVolume = 0.4) {
  const [trackIndex, setTrackIndex] = useState(3); // 'Off'
  const audioRef = useRef(null);
  const fadeRef = useRef(null);
  const unlockAttempted = useRef(false);

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

  const setupAudio = useCallback(() => {
    if (isOff || !ambientUrls[trackIndex]) return;

    const audio = new Audio(ambientUrls[trackIndex]);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    const tryPlay = () => {
      if (unlockAttempted.current) return;
      unlockAttempted.current = true;

      audio.play()
        .then(() => fadeTo(defaultVolume))
        .catch(err => console.warn("Ambient audio blocked by browser:", err));
    };

    document.body.addEventListener("click", tryPlay, { once: true });
    document.body.addEventListener("touchstart", tryPlay, { once: true });

    return () => {
      document.body.removeEventListener("click", tryPlay);
      document.body.removeEventListener("touchstart", tryPlay);
    };
  }, [ambientUrls, trackIndex, defaultVolume, fadeTo, isOff]);

  useEffect(() => {
    clearInterval(fadeRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const cleanup = setupAudio();
    return () => {
      clearInterval(fadeRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      cleanup?.();
    };
  }, [trackIndex, setupAudio]);

  const nextTrack = useCallback(() => {
    setTrackIndex(prev => (prev + 1) % (ambientUrls.length + 1));
  }, [ambientUrls.length]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.play().catch(err => console.warn("Audio play error:", err));
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const setVolume = useCallback((v) => {
    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, v));
  }, []);

  return {
    isPlaying: !isOff,
    currentTrack: trackLabels[trackIndex],
    nextTrack,
    play,
    pause,
    setVolume,
    volume: audioRef.current?.volume ?? defaultVolume,
    trackIndex,
  };
}
