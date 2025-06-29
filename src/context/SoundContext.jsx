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
  const [isMuted, setIsMuted] = useState(true);           // Default = muted
  const [sfxMuted, setSfxMuted] = useState(false);        // Separate toggle for button clicks
  const [trackIndex, setTrackIndex] = useState(0);        // 0 = Off
  const [volume, setVolume] = useState(initialVolume);
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
    });
  }, [ambientTracks, trackIndex, isMuted, isUnlocked, volume, fadeTo]);

  const enableSound = () => {
    setIsMuted(false);
    setIsUnlocked(true);
    playAmbient();
  };

  const disableSound = () => {
    setIsMuted(true);
    setTrackIndex(0); // Force ambient to "Off"
    setNowPlaying("Off");
    fadeTo(mainAudioRef.current, 0);
    setTimeout(() => mainAudioRef.current.pause(), 600);
  };

  const toggleAmbient = () => {
    setTrackIndex((prev) => {
      const next = (prev + 1) % ambientTracks.length;
      setNowPlaying(next === 0 ? "Off" : `Music ${next}`);
      if (next === 0) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
      }
      return next;
    });
  };

  const toggleMute = () => {
    if (isMuted) {
      enableSound();
    } else {
      disableSound();
    }
  };

  const playClick = () => {
    if (!clickRef.current || sfxMuted || !isUnlocked) return;
    const click = clickRef.current;
    click.currentTime = 0;
    click.volume = volume;
    click.play().catch(err => console.warn("Click sound error", err));
  };

  // Load saved settings
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sound-settings") || "{}");
    setIsMuted(saved.isMuted ?? true);
    setSfxMuted(saved.sfxMuted ?? false);
    setVolume(saved.volume ?? initialVolume);
    setTrackIndex(saved.trackIndex ?? 0);
  }, [initialVolume]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem("sound-settings", JSON.stringify({
      isMuted, sfxMuted, volume, trackIndex
    }));
  }, [isMuted, sfxMuted, volume, trackIndex]);

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
        sfxMuted,
        volume,
        setVolume,
        playClick,
        toggleAmbient,
        enableSound,
        disableSound,
        toggleMute,
        nowPlaying,
        trackIndex,
        setSfxMuted,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);

