// ✅ EchoScript.AI — Optimized SoundContext with Track Cycling, Fade, Autoplay Fix
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

const SoundContext = createContext();

export function SoundProvider({ children, initialVolume = 0.4 }) {
  const [isMuted, setIsMuted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(1); // 0 = Off
  const [volume, setVolume] = useState(initialVolume);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [nowPlaying, setNowPlaying] = useState("Off");

  const mainAudioRef = useRef(null);
  const fadeRef = useRef(null);
  const clickRef = useRef(null);

  const ambientTracks = useMemo(() => [
    null,
    new URL("../assets/sounds/ambient-loop-1.mp3", import.meta.url).href,
    new URL("../assets/sounds/ambient-loop-2.mp3", import.meta.url).href,
    new URL("../assets/sounds/ambient-loop-3.mp3", import.meta.url).href,
  ], []);

  const clickSoundUrl = useMemo(() =>
    new URL("../assets/sounds/playPop.mp3", import.meta.url).href, []);

  useEffect(() => {
    mainAudioRef.current = new Audio();
    mainAudioRef.current.loop = true;
    mainAudioRef.current.volume = 0;

    clickRef.current = new Audio(clickSoundUrl);
    clickRef.current.preload = "auto";

    return () => {
      mainAudioRef.current.pause();
      cancelAnimationFrame(fadeRef.current);
    };
  }, [clickSoundUrl]);

  const fadeTo = useCallback((audio, targetVol, duration = 800) => {
    cancelAnimationFrame(fadeRef.current);
    const start = audio.volume;
    const delta = targetVol - start;
    const startTime = performance.now();

    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      audio.volume = start + delta * t;
      if (t < 1) fadeRef.current = requestAnimationFrame(step);
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const playAmbient = useCallback(() => {
    const audio = mainAudioRef.current;
    const src = ambientTracks[trackIndex];

    if (!src || isMuted || !isUnlocked) {
      setNowPlaying("Off");
      fadeTo(audio, 0);
      setTimeout(() => audio.pause(), 600);
      return;
    }

    if (audio.src !== src) {
      audio.pause();
      audio.src = src;
      audio.currentTime = 0;
    }

    audio.play().then(() => {
      fadeTo(audio, volume * 0.2);
      setNowPlaying(`Music ${trackIndex}`);
    }).catch(err => {
      console.warn("Autoplay blocked", err);
      setShowPrompt(true);
    });
  }, [ambientTracks, trackIndex, isMuted, isUnlocked, volume, fadeTo]);

  const enableSound = () => {
    setIsMuted(false);
    setIsUnlocked(true);
    setShowPrompt(false);
    playAmbient();
  };

  const disableSound = () => {
    setIsMuted(true);
    setNowPlaying("Off");
    fadeTo(mainAudioRef.current, 0);
    setTimeout(() => mainAudioRef.current.pause(), 600);
    setShowPrompt(false);
  };

  const toggleAmbient = () => {
    setTrackIndex((prev) => {
      const next = (prev + 1) % ambientTracks.length;
      setNowPlaying(next === 0 ? "Off" : `Music ${next}`);
      return next;
    });
  };

  const playClick = () => {
    if (!clickRef.current || isMuted || !isUnlocked) return;
    const click = clickRef.current;
    click.currentTime = 0;
    click.volume = volume;
    click.play().catch(err => console.warn("Click sound error", err));
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sound-settings") || "{}");
    setIsMuted(saved.isMuted ?? false);
    setVolume(saved.volume ?? initialVolume);
    setTrackIndex(saved.trackIndex ?? 1);
  }, [initialVolume]);

  useEffect(() => {
    localStorage.setItem("sound-settings", JSON.stringify({
      isMuted, volume, trackIndex
    }));
  }, [isMuted, volume, trackIndex]);

  useEffect(() => {
    const unlock = () => {
      setIsUnlocked(true);
      playAmbient();
    };
    window.addEventListener("click", unlock, { once: true });
    return () => window.removeEventListener("click", unlock);
  }, [playAmbient]);

  useEffect(() => {
    if (isUnlocked) playAmbient();
  }, [isUnlocked, playAmbient]);

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        volume,
        setVolume,
        playClick,
        toggleAmbient,
        enableSound,
        disableSound,
        nowPlaying,
        trackIndex,
      }}
    >
      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-xl text-white text-center max-w-sm">
            <h2 className="text-lg font-bold mb-2">🔈 Enable Audio</h2>
            <p className="mb-4 text-sm text-zinc-400">
              Click anywhere to enable sound playback and ambient music.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={enableSound}
                className="px-4 py-2 bg-teal-500 rounded hover:bg-teal-600 transition"
              >
                Enable
              </button>
              <button
                onClick={disableSound}
                className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600 transition"
              >
                Disable
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



