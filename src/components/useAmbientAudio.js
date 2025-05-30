// 4. useAmbientAudio.js (Enhanced for fade-in/out)
import { useEffect, useState } from "react";

export default function useAmbientAudio(audioFile) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(() => new Audio(audioFile));

  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.4;
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  const toggleAudio = () => {
    if (isPlaying) {
      audio.volume = 0.2;
      setTimeout(() => audio.pause(), 200);
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  return { isPlaying, toggleAudio };
}
