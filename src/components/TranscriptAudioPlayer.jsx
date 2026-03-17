// src/components/TranscriptAudioPlayer.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, ChevronDown, ChevronUp, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SPEED_OPTIONS = [0.25, 0.5, 1, 1.25, 1.5, 1.75, 2];

export default function TranscriptAudioPlayer({ audioUrl }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.error("Playback failed:", err));
    }
  }, [isPlaying]);

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    audioRef.current.volume = newVol;
    if (newVol > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    audioRef.current.muted = newMute;
  };

  const handleSpeedChange = (rate) => {
    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const formatTime = (time) =>
    isNaN(time)
      ? "0:00"
      : `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

  return (
    <motion.div
      className="w-full p-4 rounded-xl bg-zinc-800/90 backdrop-blur-md text-white shadow-2xl flex flex-col gap-4 border border-zinc-700/50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ zIndex: 'var(--z-audio-player)' }}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="p-3 rounded-full bg-teal-500 hover:bg-teal-600 transition shadow-lg active:scale-95"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>

        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
          <div className="flex justify-between text-[10px] font-medium text-zinc-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 group">
           <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition">
             {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
           </button>
           <input
             type="range"
             min={0}
             max={1}
             step="0.01"
             value={isMuted ? 0 : volume}
             onChange={handleVolumeChange}
             className="w-16 md:w-20 h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-teal-400 opacity-60 group-hover:opacity-100 transition"
           />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu((s) => !s)}
            className="px-2 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-[11px] font-bold transition flex items-center gap-1 border border-zinc-600"
          >
            {playbackRate}x {showSpeedMenu ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          <AnimatePresence>
            {showSpeedMenu && (
              <motion.ul
                className="absolute right-0 bottom-full mb-2 w-20 bg-zinc-900 border border-zinc-700 rounded shadow-xl z-50 text-xs overflow-hidden"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                {SPEED_OPTIONS.map((rate) => (
                  <li
                    key={rate}
                    className={`px-3 py-2 cursor-pointer transition ${
                      playbackRate === rate ? "bg-teal-600 text-white" : "hover:bg-zinc-800 text-zinc-300"
                    }`}
                    onClick={() => handleSpeedChange(rate)}
                  >
                    {rate}x
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
