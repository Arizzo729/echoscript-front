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
  const [trackIndex, setTrackIndex] = useState(3); // start at OFF
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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('sound-settings') || '{}');
    setIsMuted(saved.isMuted ?? true);
    setSfxMuted(saved.sfxMuted ?? false);
    setVolume(saved.volume ?? initialVolume);
    setTrackIndex(saved.trackIndex ?? 3);
  }, [initialVolume]);

  useEffect(() => {
    localStorage.setItem('sound-settings', JSON.stringify({
      isMuted, sfxMuted, volume, trackIndex
    }));
  }, [isMuted, sfxMuted, volume, trackIndex]);

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

  const playAmbientTrack = useCallback((index) => {
    const audio = mainAudioRef.current;
    const src = ambientTracks[index];

    if (!src || isMuted || !isUnlocked) {
      fadeTo(audio, 0);
      setTimeout(() => audio.pause(), 600);
      setTrackIndex(3); // OFF
      setNowPlaying('Off');
      setIsPlaying(false);
      return;
    }

    if (!audio.src || !audio.src.endsWith(src)) {
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

  const togglePlay = useCallback(() => {
    const audio = mainAudioRef.current;
    const src = ambientTracks[trackIndex];
    if (!audio || !src || isMuted || !isUnlocked) return;

    if (audio.paused) {
      audio.play().then(() => {
        fadeTo(audio, volume * 0.2);
        setIsPlaying(true);
      }).catch((err) => console.warn('Play failed', err));
    } else {
      fadeTo(audio, 0);
      setTimeout(() => audio.pause(), 400);
      setIsPlaying(false);
    }
  }, [ambientTracks, trackIndex, isMuted, isUnlocked, volume, fadeTo]);

  const nextTrack = () => {
    if (trackIndex === 3) {
      playAmbientTrack(0);
    } else {
      const next = trackIndex === 2 ? 0 : trackIndex + 1;
      playAmbientTrack(next);
    }
  };

  const prevTrack = () => {
    if (trackIndex === 3) {
      playAmbientTrack(2);
    } else {
      const prev = trackIndex === 0 ? 2 : trackIndex - 1;
      playAmbientTrack(prev);
    }
  };

  const toggleAmbient = () => {
    const next = (trackIndex + 1) % 4;
    playAmbientTrack(next);
    setIsMuted(next === 3);
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
    const audio = mainAudioRef.current;
    fadeTo(audio, 0);
    setTimeout(() => audio.pause(), 400);
    setIsPlaying(false);
    setTrackIndex(3);
    setNowPlaying('Off');
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
