import React, { useEffect, useRef } from "react";

export default function AudioWaveform({ audioStream }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    if (!audioStream) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth * dpr;
    const height = 100 * dpr;

    canvas.width = width;
    canvas.height = height;
    ctx.scale(dpr, dpr);

    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContextRef.current.createMediaStreamSource(audioStream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;

    const bufferLength = analyserRef.current.fftSize;
    dataArrayRef.current = new Uint8Array(bufferLength);

    source.connect(analyserRef.current);

    const draw = () => {
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

      ctx.fillStyle = "#0f172a"; // zinc-900
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#14b8a6"; // teal-500
      ctx.beginPath();

      const sliceWidth = (canvas.width / dpr) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArrayRef.current[i] / 128.0;
        const y = (v * height) / (2 * dpr);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width / dpr, height / (2 * dpr));
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [audioStream]);

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <canvas
        ref={canvasRef}
        className="w-full h-[100px] rounded-xl border border-zinc-700 shadow-md"
      />
    </div>
  );
}

