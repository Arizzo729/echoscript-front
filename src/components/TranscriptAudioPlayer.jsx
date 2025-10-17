// src/components/TranscriptAudioPlayer.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Pause, Play } from 'lucide-react';

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

/**
 * TranscriptAudioPlayer
 *
 * Props:
 * - audioUrl: string (required)  URL/path to audio file
 * - segments: Array<{ id?: string|number, start: number, end: number, text: string }>
 * - initialTime?: number (seconds)
 * - onTimeUpdate?: (timeSeconds: number) => void
 * - onSeek?: (timeSeconds: number) => void
 */
export default function TranscriptAudioPlayer({
  audioUrl,
  segments = [],
  initialTime = 0,
  onTimeUpdate,
  onSeek,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Stable keys for segment list (no index param)
  const normalizedSegments = useMemo(
    () =>
      (Array.isArray(segments) ? segments : []).map((seg) => ({
        ...seg,
        __key:
          seg?.id != null
            ? String(seg.id)
            : `${safeNum(seg?.start)}-${safeNum(seg?.end)}-${hashText(
                seg?.text
              )}`,
      })),
    [segments]
  );

  // Attach time + metadata listeners
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const handleTimeUpdate = () => {
      const t = el.currentTime || 0;
      setCurrentTime(t);
      if (typeof onTimeUpdate === "function") onTimeUpdate(t);
    };

    const handleLoadedMetadata = () => {
      setDuration(el.duration || 0);
    };

    el.addEventListener("timeupdate", handleTimeUpdate);
    el.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      el.removeEventListener("timeupdate", handleTimeUpdate);
      el.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [onTimeUpdate]);

  // Seek to initialTime on mount (once)
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (initialTime > 0) el.currentTime = initialTime;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep playback rate in sync with state
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.playbackRate = playbackRate;
  }, [playbackRate]);

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      try {
        await el.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  const seekTo = (t) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, Number(t) || 0);
    if (typeof onSeek === "function") onSeek(el.currentTime);
  };

  const formatTime = (sec) => {
    const t = Math.max(0, Math.floor(Number(sec) || 0));
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* a11y: include a captions track to satisfy jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" controls={false}>
        {/* Replace with a real VTT later if available */}
        <track kind="captions" label="English" srcLang="en" src="/captions/placeholder.vtt" default />
      </audio>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border shadow-sm hover:bg-gray-50"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <div className="text-sm tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Speed */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSpeedMenu((s) => !s)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border shadow-sm hover:bg-gray-50"
            aria-haspopup="menu"
            aria-expanded={showSpeedMenu}
            title="Playback speed"
          >
            <span className="text-sm">Speed: {playbackRate}</span>
            {showSpeedMenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showSpeedMenu && (
            <div
              role="menu"
              className="absolute z-10 mt-2 w-40 rounded-lg border bg-white shadow-md p-2"
            >
              {SPEED_OPTIONS.map((s) => (
                <button
                  key={String(s)}
                  type="button"
                  className={[
                    "block w-full text-left px-3 py-1.5 rounded-md hover:bg-gray-50",
                    s === playbackRate ? "bg-blue-50 ring-1 ring-blue-300" : "",
                  ].join(" ")}
                  onClick={() => {
                    setPlaybackRate(s);
                    setShowSpeedMenu(false);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transcript list */}
      <div className="space-y-1 max-h-80 overflow-auto border rounded-lg p-3">
        {normalizedSegments.length === 0 ? (
          <div className="text-sm text-gray-500">No transcript available.</div>
        ) : (
          normalizedSegments.map((seg) => {
            const isActive =
              typeof seg.start === "number" &&
              typeof seg.end === "number" &&
              currentTime >= seg.start &&
              currentTime < seg.end;

            return (
              <button
                key={seg.__key}
                type="button"
                onClick={() => seekTo(seg.start)}
                className={[
                  "block w-full text-left rounded-md px-2 py-1",
                  "hover:bg-gray-50",
                  isActive ? "bg-blue-50 ring-1 ring-blue-300" : "",
                ].join(" ")}
                title={`Jump to ${formatTime(seg.start ?? 0)}`}
              >
                <div className="text-xs text-gray-500 tabular-nums">
                  {formatTime(seg.start ?? 0)}  {formatTime(seg.end ?? 0)}
                </div>
                <div className="text-sm">{seg.text || ""}</div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ------------ helpers ------------ */

function safeNum(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}

function hashText(text) {
  const s = String(text || "");
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}