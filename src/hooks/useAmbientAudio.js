// ✅ EchoScript.AI — Unified Ambient Audio Hook (Fully Synced with SoundContext)
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

  const setupAudio = useCallback((index) => {
    if (index === 3) return;
    const src = ambientUrls[index];
    if (!src) return;

    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    audio.play()
      .then(() => fadeTo(defaultVolume))
      .catch(err => console.warn("Audio autoplay failed:", err));
  }, [ambientUrls, defaultVolume, fadeTo]);

  useEffect(() => {
    clearInterval(fadeRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setupAudio(trackIndex);

    return () => {
      clearInterval(fadeRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [trackIndex, setupAudio]);

  const nextTrack = useCallback(() => {
    setTrackIndex(prev => (prev + 1) % 4);
  }, []);

  const prevTrack = useCallback(() => {
    setTrackIndex(prev => (prev - 1 + 4) % 4);
  }, []);

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
    prevTrack,
    play,
    pause,
    setVolume,
    volume: audioRef.current?.volume ?? defaultVolume,
    trackIndex,
  };
}
