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
  const [isPlaying, setIsPlaying] = useState(false);

  const mainAudioRef = useRef(null);
  const fadeRef = useRef(null);
  const clickRef = useRef(null);

  const ambientTracks = useMemo(() => [
    new URL('../assets/sounds/ambient-loop-1.mp3', import.meta.url).href,
    new URL('../assets/sounds/ambient-loop-2.mp3', import.meta.url).href,
    new URL('../assets/sounds/ambient-loop-3.mp3', import.meta.url).href,
    null, // OFF
  ], []);

  const clickSoundUrl = useMemo(
    () => new URL('../assets/sounds/playPop.mp3', import.meta.url).href,
    []
  );

  // 🧠 Load saved settings on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('sound-settings') || '{}');
    setIsMuted(saved.isMuted ?? true);
    setSfxMuted(saved.sfxMuted ?? false);
    setVolume(saved.volume ?? initialVolume);
    setTrackIndex(saved.trackIndex ?? ambientTracks.length - 1); // default to OFF
  }, [initialVolume, ambientTracks.length]);

  // 💾 Save settings
  useEffect(() => {
    localStorage.setItem('sound-settings', JSON.stringify({
      isMuted, sfxMuted, volume, trackIndex
    }));
  }, [isMuted, sfxMuted, volume, trackIndex]);

  // 🎧 Setup audio once
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

  // ✨ Smooth volume transition
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

  // 🔊 Play ambient background track
  const playAmbientTrack = useCallback((index) => {
    const audio = mainAudioRef.current;
    const src = ambientTracks[index];

    if (!src || isMuted || !isUnlocked) {
      setNowPlaying('Off');
      fadeTo(audio, 0);
      setTimeout(() => audio.pause(), 600);
      setTrackIndex(ambientTracks.length - 1); // OFF
      setIsPlaying(false);
      return;
    }

    if (audio.src !== src) {
      audio.pause();
      audio.src = src;
      audio.currentTime = 0;
    }

    audio.play().then(() => {
      fadeTo(audio, volume * 0.2);
      setNowPlaying(`Music ${index + 1}`);
      setTrackIndex(index);
      setIsPlaying(true);
    }).catch((err) => {
      console.warn('Autoplay blocked:', err);
      setIsPlaying(false);
    });
  }, [ambientTracks, isMuted, isUnlocked, volume, fadeTo]);

  // ⏯️ Toggle play/pause
  const togglePlay = useCallback(() => {
    const audio = mainAudioRef.current;
    if (!audio || !audio.src || audio.src === 'null') return;

    if (audio.paused) {
      audio.play()
        .then(() => {
          fadeTo(audio, volume * 0.2);
          setIsPlaying(true);
        })
        .catch((err) => console.warn('Play failed', err));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [volume, fadeTo]);

  // ⏮️ ⏭️ Track controls
  const nextTrack = () => {
    const next = (trackIndex + 1) % ambientTracks.length;
    playAmbientTrack(next);
  };

  const prevTrack = () => {
    const prev = (trackIndex - 1 + ambientTracks.length) % ambientTracks.length;
    playAmbientTrack(prev);
  };

  const toggleAmbient = () => {
    const next = (trackIndex + 1) % ambientTracks.length;
    playAmbientTrack(next);
    setIsMuted(next === ambientTracks.length - 1); // OFF if at end
  };

  const enableSound = () => {
    setIsMuted(false);
    setIsUnlocked(true);
    if (trackIndex < ambientTracks.length - 1) {
      playAmbientTrack(trackIndex);
    }
  };

  const disableSound = () => {
    setIsMuted(true);
    setTrackIndex(ambientTracks.length - 1); // OFF
    const audio = mainAudioRef.current;
    if (audio) {
      fadeTo(audio, 0);
      audio.pause();
    }
    setIsPlaying(false);
  };

  const toggleMute = () => {
    isMuted ? enableSound() : disableSound();
  };

  const playClick = () => {
    const click = clickRef.current;
    if (!click || sfxMuted || !isUnlocked) return;
    click.pause();
    click.currentTime = 0;
    click.volume = volume;
    click.play().catch((err) => console.warn('Click sound error', err));
  };

  // 🔓 Unlock audio on any interaction
  useEffect(() => {
    const unlock = () => {
      setIsUnlocked(true);
      if (!isMuted && trackIndex < ambientTracks.length - 1) {
        playAmbientTrack(trackIndex);
      }
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [isMuted, trackIndex, ambientTracks.length, playAmbientTrack]);

  return (
    <SoundContext.Provider value={{
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
      setTrackIndex,
      isPlaying,
      playAmbientTrack,
      togglePlay,
      nextTrack,
      prevTrack,
      setSfxMuted,
      setIsMuted,
      isUnlocked,
    }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);
