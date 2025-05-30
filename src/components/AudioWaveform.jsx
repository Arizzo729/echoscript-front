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
    canvas.width = 600;
    canvas.height = 100;

    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContextRef.current.createMediaStreamSource(audioStream);
    analyserRef.current = audioContextRef.current.createAnalyser();

    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 2048;

    const bufferLength = analyserRef.current.fftSize;
    dataArrayRef.current = new Uint8Array(bufferLength);

    const draw = () => {
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
      ctx.fillStyle = "#0f172a"; // dark bg (tailwind zinc-900)
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#0ea5e9"; // tailwind teal-500
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArrayRef.current[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
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
      <canvas ref={canvasRef} className="rounded-xl border border-zinc-700 shadow-md" />
    </div>
  );
}
