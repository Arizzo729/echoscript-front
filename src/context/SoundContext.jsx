// src/context/SoundContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';

const SoundContext = createContext();

export function SoundProvider({ children, initialVolume = 0.4 }) {
  const [isMuted, setIsMuted] = useState(true);
  const [sfxMuted, setSfxMuted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [nowPlaying, setNowPlaying] = useState('Off');

  const mainAudioRef = useRef(null);
  const fadeRef = useRef(null);
  const clickRef = useRef(null);

  const ambientTracks = useMemo(
    () => [
      null,
      new URL('../assets/sounds/ambient-loop-1.mp3', import.meta.url).href,
      new URL('../assets/sounds/ambient-loop-2.mp3', import.meta.url).href,
      new URL('../assets/sounds/ambient-loop-3.mp3', import.meta.url).href,
    ],
    []
  );

  const clickSoundUrl = useMemo(
    () => new URL('../assets/sounds/playPop.mp3', import.meta.url).href,
    []
  );

  // Initialize audio elements
  useEffect(() => {
    const mainAudio = new Audio();
    mainAudio.loop = true;
    mainAudio.volume = 0;
    mainAudioRef.current = mainAudio;

    const clickAudio = new Audio(clickSoundUrl);
    clickAudio.preload = 'auto';
    clickRef.current = clickAudio;

    return () => {
      mainAudio.pause();
      cancelAnimationFrame(fadeRef.current);
    };
  }, [clickSoundUrl]);

  // Fade helper
  const fadeTo = useCallback((audio, targetVol, duration = 800) => {
    cancelAnimationFrame(fadeRef.current);
    const startVol = audio.volume;
    const diff = targetVol - startVol;
    const startTime = performance.now();

    const step = (time) => {
      const t = Math.min((time - startTime) / duration, 1);
      audio.volume = startVol + diff * t;
      if (t < 1) fadeRef.current = requestAnimationFrame(step);
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  // Play or pause ambient based on state
  const playAmbient = useCallback(() => {
    const audio = mainAudioRef.current;
    const src = ambientTracks[trackIndex];

    if (!src || isMuted || !isUnlocked) {
      setNowPlaying('Off');
      fadeTo(audio, 0);
      setTimeout(() => audio.pause(), 600);
      return;
    }

    if (audio.src !== src) {
      audio.pause();
      audio.src = src;
      audio.currentTime = 0;
    }

    audio
      .play()
      .then(() => {
        fadeTo(audio, volume * 0.2);
        setNowPlaying(`Music ${trackIndex}`);
      })
      .catch((err) => console.warn('Autoplay blocked', err));
  }, [ambientTracks, trackIndex, isMuted, isUnlocked, volume, fadeTo]);

  // Cycle through tracks on each click
  const toggleAmbient = () => {
    setTrackIndex((prev) => {
      const next = (prev + 1) % ambientTracks.length;
      setIsMuted(next === 0);
      return next;
    });
  };

  const enableSound = () => {
    setIsMuted(false);
    setIsUnlocked(true);
  };
  const disableSound = () => {
    setIsMuted(true);
    setTrackIndex(0);
  };
  const toggleMute = () => {
    isMuted ? enableSound() : disableSound();
  };

  // UI click effect
  const playClick = () => {
    const click = clickRef.current;
    if (!click || sfxMuted || !isUnlocked) return;
    click.currentTime = 0;
    click.volume = volume;
    click.play().catch((err) => console.warn('Click sound error', err));
  };

  // Load saved prefs
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('sound-settings') || '{}');
    setIsMuted(saved.isMuted ?? true);
    setSfxMuted(saved.sfxMuted ?? false);
    setVolume(saved.volume ?? initialVolume);
    setTrackIndex(saved.trackIndex ?? 0);
  }, [initialVolume]);

  // Persist prefs
  useEffect(() => {
    localStorage.setItem(
      'sound-settings',
      JSON.stringify({ isMuted, sfxMuted, volume, trackIndex })
    );
  }, [isMuted, sfxMuted, volume, trackIndex]);

  // Unlock on first click
  useEffect(() => {
    const unlock = () => setIsUnlocked(true);
    window.addEventListener('click', unlock, { once: true });
    return () => window.removeEventListener('click', unlock);
  }, []);

  // React to changes
  useEffect(() => {
    if (isUnlocked) playAmbient();
  }, [trackIndex, isMuted, volume, isUnlocked, playAmbient]);

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


