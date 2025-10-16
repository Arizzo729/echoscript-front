// SoundContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';

const SoundContext = createContext(null);

const soundFiles = {
  click: '/sounds/click.mp3',
  pop: '/sounds/pop.mp3',
  notification: '/sounds/notification.mp3',
  ambient1: '/sounds/ambient-1.mp3',
  ambient2: '/sounds/ambient-2.mp3',
  ambient3: '/sounds/ambient-3.mp3',
};

const AMBIENT_TRACKS = [soundFiles.ambient1, soundFiles.ambient2, soundFiles.ambient3];

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(() => {
    try { return localStorage.getItem('echo-muted') === 'true'; } catch { return false; }
  });
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const sfxRef = useRef({});

  useEffect(() => {
    try { localStorage.setItem('echo-muted', isMuted); } catch {}
  }, [isMuted]);

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = volume;

    if (ambientEnabled && trackIndex > 0) {
      audio.src = AMBIENT_TRACKS[trackIndex - 1];
      audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [ambientEnabled, trackIndex, volume]);

  const playSound = useCallback((key) => {
    if (isMuted) return;
    try {
      if (!sfxRef.current[key]) sfxRef.current[key] = new Audio(soundFiles[key]);
      sfxRef.current[key].volume = volume;
      sfxRef.current[key].play().catch(() => {});
    } catch {}
  }, [isMuted, volume]);

  const playClick = useCallback(() => playSound('click'), [playSound]);
  const playPop = useCallback(() => playSound('pop'), [playSound]);
  const playNotification = useCallback(() => playSound('notification'), [playSound]);

  const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);

  const enableSound = useCallback(() => {
    if (isMuted) setIsMuted(false);
  }, [isMuted]);

  const toggleAmbient = useCallback(() => {
    setAmbientEnabled(prev => {
      const next = !prev;
      if (next && trackIndex === 0) setTrackIndex(1);
      return next;
    });
  }, [trackIndex]);

  const playAmbientTrack = useCallback((index) => {
    setTrackIndex(index);
    if (!ambientEnabled && index > 0) setAmbientEnabled(true);
    if (index === 0) setAmbientEnabled(false);
  }, [ambientEnabled]);

  const togglePlay = useCallback(() => {
    if (audioRef.current?.paused) audioRef.current.play().catch(() => {});
    else audioRef.current?.pause();
    setIsPlaying(!audioRef.current?.paused);
  }, []);

  const value = useMemo(() => ({
    isMuted,
    toggleMute,
    enableSound,
    playClick,
    playPop,
    playNotification,
    ambientEnabled,
    toggleAmbient,
    volume,
    setVolume,
    trackIndex,
    playAmbientTrack,
    isPlaying,
    togglePlay,
    nowPlaying: trackIndex > 0 ? `BG ${trackIndex}` : 'OFF',
  }), [isMuted, toggleMute, enableSound, playClick, playPop, playNotification, ambientEnabled, toggleAmbient, volume, setVolume, trackIndex, playAmbientTrack, isPlaying, togglePlay]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within a SoundProvider');
  return context;
};