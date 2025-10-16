// src/components/AudioWaveform.jsx
import React, { useEffect, useRef } from "react";

/**
 * Minimal, build-safe waveform renderer.
 * - Uses getUserMedia when sourceType === "mic"
 * - Cleans up AudioContext/RAF on unmount
 * - No duplicate refs, no JSX/syntax traps
 */
export default function AudioWaveform({ sourceType = "mic", width = 600, height = 100 }) {
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx2d = canvas.getContext("2d");
      if (!ctx2d) return;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const bufferLen = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLen);
      dataArrayRef.current = dataArray;

      if (sourceType === "mic") {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const micSource = audioCtx.createMediaStreamSource(stream);
        sourceNodeRef.current = micSource;
        micSource.connect(analyser);
      }

      const draw = () => {
        if (!mounted) return;
        rafRef.current = requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        ctx2d.lineWidth = 2;
        ctx2d.strokeStyle = "#22d3ee";
        ctx2d.beginPath();

        const sliceWidth = canvas.width / bufferLen;
        let x = 0;

        for (let i = 0; i < bufferLen; i++) {
          const v = dataArray[i] / 128.0; // 0..255 -> around 1.0 at center (128)
          const y = (v * canvas.height) / 2;
          if (i === 0) ctx2d.moveTo(x, y);
          else ctx2d.lineTo(x, y);
          x += sliceWidth;
        }

        ctx2d.lineTo(canvas.width, canvas.height / 2);
        ctx2d.stroke();
      };

      draw();
    })();

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try {
        sourceNodeRef.current?.disconnect();
      } catch {}
      try {
        streamRef.current?.getTracks()?.forEach((t) => t.stop());
      } catch {}
      try {
        audioCtxRef.current?.close();
      } catch {}
    };
  }, [sourceType]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: "100%",
        height,
        background: "#0b0b0f",
        borderRadius: 8,
        display: "block",
      }}
    />
  );
}
