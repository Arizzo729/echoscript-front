import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import popSfx from "../assets/sounds/playPop.mp3";

// Ambient Playlist
import ambient1 from "../assets/sounds/ambient-loop-1.mp3";
import ambient2 from "../assets/sounds/ambient-loop-2.mp3";
import ambient3 from "../assets/sounds/ambient-loop-3.mp3";

const ambientPlaylist = [ambient1, ambient2, ambient3];
const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);
  const [ambientEnabled, setAmbientEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showSoundPrompt, setShowSoundPrompt] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const popAudio = useRef(new Audio(popSfx));
  const ambientAudio = useRef(new Audio(ambientPlaylist[0]));
  const fadeInterval = useRef(null);

  // === Load saved settings
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sound-settings") || "{}");
    if (saved) {
      setIsMuted(saved.isMuted ?? false);
      setAmbientEnabled(saved.ambientEnabled ?? true);
      setVolume(saved.volume ?? 0.5);
      setTrackIndex(saved.trackIndex ?? 0);
    }
  }, []);

  // === Save settings
  useEffect(() => {
    localStorage.setItem(
      "sound-settings",
      JSON.stringify({ isMuted, ambientEnabled, volume, trackIndex })
    );
  }, [isMuted, ambientEnabled, volume, trackIndex]);

  // === Smooth volume transition
  const fadeAudio = (targetVolume, fadeTime = 800) => {
    const audio = ambientAudio.current;
    clearInterval(fadeInterval.current);
    const steps = 30;
    const stepTime = fadeTime / steps;
    const volumeStep = (targetVolume - audio.volume) / steps;

    fadeInterval.current = setInterval(() => {
      const newVol = audio.volume + volumeStep;
      if (
        (volumeStep > 0 && newVol >= targetVolume) ||
        (volumeStep < 0 && newVol <= targetVolume)
      ) {
        audio.volume = targetVolume;
        clearInterval(fadeInterval.current);
      } else {
        audio.volume = newVol;
      }
    }, stepTime);
  };

  // === Ambient control
  useEffect(() => {
    const audio = ambientAudio.current;

    const playTrack = () => {
      const newSrc = ambientPlaylist[trackIndex];
      if (audio.src !== newSrc) {
        audio.src = newSrc;
        audio.load();
      }

      audio.loop = true;

      if (!isMuted && ambientEnabled) {
        audio.volume = 0;
        audio
          .play()
          .then(() => fadeAudio(volume * 0.3))
          .catch(() => setShowSoundPrompt(true));
      } else {
        fadeAudio(0);
        setTimeout(() => audio.pause(), 600);
      }
    };

    playTrack();
    return () => {
      fadeAudio(0);
      setTimeout(() => audio.pause(), 600);
    };
  }, [ambientEnabled, isMuted, trackIndex]);

  // === Toggle between ambient tracks
  const toggleAmbient = () => {
    const nextIndex = (trackIndex + 1) % ambientPlaylist.length;
    setTrackIndex(nextIndex);
    setAmbientEnabled(true);
  };

  // === Click sound
  const playClickSound = () => {
    if (!isMuted) {
      const audio = popAudio.current;
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch(() => {});
    }
  };

  // === Mute toggle
  const toggleMute = () => setIsMuted((prev) => !prev);

  // === Manual user confirmation fallback
  const enableSoundManually = () => {
    setIsMuted(false);
    setAmbientEnabled(true);
    setShowSoundPrompt(false);
    ambientAudio.current.play().catch(() => {});
  };

  const disableSoundManually = () => {
    setIsMuted(true);
    setAmbientEnabled(false);
    setShowSoundPrompt(false);
    ambientAudio.current.pause();
  };

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
        showSoundPrompt,
        enableSoundManually,
        disableSoundManually,
      }}
    >
      {showSoundPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-xl text-white text-center max-w-md space-y-4">
            <h2 className="text-xl font-semibold">🔈 Enable Audio</h2>
            <p className="text-sm text-zinc-300">
              Your browser blocked autoplay. Choose below to set your audio preferences.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={enableSoundManually}
                className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded"
              >
                Enable Sound
              </button>
              <button
                onClick={disableSoundManually}
                className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-2 px-4 rounded"
              >
                Disable Sound
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);

