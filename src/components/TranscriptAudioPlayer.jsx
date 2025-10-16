// src/components/TranscriptAudioPlayer.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";

/**
 * TranscriptAudioPlayer
 *
 * Props:
 * - audioSrc: string (required) — URL or path to audio file
 * - segments: Array<{ id?: string|number, start: number, end: number, text: string }>
 * - initialTime?: number (seconds)
 * - onTimeUpdate?: (timeSeconds: number) => void
 * - onSeek?: (timeSeconds: number) => void
 *
 * Behavior:
 * - Renders an <audio> element with play/pause and a simple transcript list.
 * - Clicking a transcript segment seeks the audio to that segment's start.
 * - Highlights the “active” segment based on currentTime.
 */
export default function TranscriptAudioPlayer({
  audioSrc,
  segments = [],
  initialTime = 0,
  onTimeUpdate,
  onSeek,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);

  // Normalize keys once (no index used)
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

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const handleTime = () => {
      const t = el.currentTime || 0;
      setCurrentTime(t);
      if (typeof onTimeUpdate === "function") onTimeUpdate(t);
    };

    el.addEventListener("timeupdate", handleTime);
    return () => el.removeEventListener("timeupdate", handleTime);
  }, [onTimeUpdate]);

  useEffect(() => {
    // apply initialTime once on mount
    const el = audioRef.current;
    if (!el) return;
    if (initialTime > 0) el.currentTime = initialTime;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

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
        // autoplay/permission errors are normal; ignore
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

  const activeIdx = findActiveIndex(normalizedSegments, currentTime);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          className="px-3 py-2 rounded-lg border shadow-sm hover:bg-gray-50"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <span className="text-sm tabular-nums">
          {formatTime(currentTime)}
        </span>
      </div>

      <div className="space-y-1 max-h-80 overflow-auto border rounded-lg p-3">
        {normalizedSegments.length === 0 ? (
          <div className="text-sm text-gray-500">No transcript available.</div>
        ) : (
          normalizedSegments.map((seg, _unused) => {
            // _unused satisfies no-unused-vars by naming the param but not using it
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
                  {formatTime(seg.start ?? 0)} – {formatTime(seg.end ?? 0)}
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

function formatTime(sec) {
  const t = Math.max(0, Math.floor(Number(sec) || 0));
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function findActiveIndex(segments, t) {
  if (!Array.isArray(segments) || segments.length === 0) return -1;
  const time = Number(t) || 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i] || {};
    const start = safeNum(seg.start);
    const end = safeNum(seg.end);
    if (time >= start && time < end) return i;
  }
  return -1;
}
