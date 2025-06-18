import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import popSfx from "../assets/audio/pop-39222.mp3";
import ambientLoop from "../assets/audio/ambient-loop.mp3"; // Add your ambient track

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);
  const [ambientEnabled, setAmbientEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5); // shared volume control

  const popAudio = useRef(new Audio(popSfx));
  const ambientAudio = useRef(new Audio(ambientLoop));

  // Load saved preferences
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sound-settings") || "{}");
    if (saved) {
      setIsMuted(saved.isMuted ?? false);
      setAmbientEnabled(saved.ambientEnabled ?? true);
      setVolume(saved.volume ?? 0.5);
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem(
      "sound-settings",
      JSON.stringify({ isMuted, ambientEnabled, volume })
    );
  }, [isMuted, ambientEnabled, volume]);

  // Handle ambient audio playback
  useEffect(() => {
    const audio = ambientAudio.current;
    audio.loop = true;
    audio.volume = !isMuted && ambientEnabled ? volume * 0.3 : 0;

    if (!isMuted && ambientEnabled) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isMuted, ambientEnabled, volume]);

  // Handle pop click sound
  const playClickSound = () => {
    const audio = popAudio.current;
    if (!isMuted) {
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch(() => {});
    }
  };

  const toggleMute = () => setIsMuted((prev) => !prev);
  const toggleAmbient = () => setAmbientEnabled((prev) => !prev);

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        ambientEnabled,
        toggleAmbient,
        volume,
        setVolume,
        playClickSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);

