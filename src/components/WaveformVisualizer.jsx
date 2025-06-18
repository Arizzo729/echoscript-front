import React, { useEffect, useRef } from "react";

export default function WaveformVisualizer({ isRecording }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isRecording) {
      cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      return;
    }

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);

        analyser.fftSize = 1024;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);

        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        sourceRef.current = source;

        drawWaveform();
      } catch (error) {
        console.error("Microphone access denied or error:", error);
      }
    };

    const drawWaveform = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const draw = () => {
        animationRef.current = requestAnimationFrame(draw);
        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;
        analyser.getByteTimeDomainData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#09090b";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#14b8a6"; // Teal
        ctx.beginPath();

        const sliceWidth = canvas.width / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0;
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

        // Glow effect
        ctx.shadowColor = "#14b8a6";
        ctx.shadowBlur = 20;
      };

      draw();
    };

    initAudio();

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording]);

  return (
    <div className="w-full h-28 rounded-lg bg-zinc-800 overflow-hidden shadow-lg border border-zinc-700">
      <canvas ref={canvasRef} width={800} height={112} className="w-full h-full" />
    </div>
  );
}

