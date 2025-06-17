import React, { createContext, useContext, useState, useEffect } from "react";
import popSfx from "../assets/audio/pop-39222.mp3";

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);
  const [popAudio] = useState(() => new Audio(popSfx));

  useEffect(() => {
    popAudio.volume = isMuted ? 0 : 0.3;
  }, [isMuted, popAudio]);

  const playClickSound = () => {
    if (!isMuted) {
      popAudio.currentTime = 0;
      popAudio.play().catch(() => {});
    }
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playClickSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);
