// src/components/TranscriptAudioPlayer.jsx
import { ChevronDown, ChevronUp, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SPEED_OPTIONS = [0.25, 0.5, 1, 1.25, 1.5, 1.75, 2];

export default function TranscriptAudioPlayer({ audioUrl }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  // reset when source changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) audio.pause();
    else audio.play();

    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
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
    <div className="w-full p-4 rounded-xl bg-zinc-800 text-white shadow-lg flex flex-col gap-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata">
        <track kind="captions" />
      </audio>

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="p-2 rounded-full bg-zinc-700 hover:bg-teal-600 transition"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-teal-400"
            aria-label="Seek"
          />
          <div className="flex justify-between text-xs text-zinc-300 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu((s) => !s)}
            className="px-3 py-1 rounded-md bg-zinc-700 hover:bg-teal-600 text-sm transition flex items-center gap-1"
            aria-haspopup="menu"
            aria-expanded={showSpeedMenu}
          >
            {playbackRate}x {showSpeedMenu ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showSpeedMenu && (
            <ul
              className="absolute right-0 mt-2 w-24 bg-zinc-900 border border-zinc-700 rounded-lg shadow-md z-50 text-sm"
              role="menu"
            >
                {SPEED_OPTIONS.map((rate) => (
                  <li key={rate} role="presentation">
                    <button
                      role="menuitem"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSpeedChange(rate)}
                      onClick={() => handleSpeedChange(rate)}
                      className={`w-full text-left px-3 py-1 cursor-pointer hover:bg-teal-600 rounded ${
                        playbackRate === rate ? "bg-zinc-700" : ""
                      }`}
                    >
                      {rate}x
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
