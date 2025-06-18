import React, { useEffect, useRef } from "react";

export default function RecordingWaveform({ isRecording }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!isRecording) {
      cancelAnimationFrame(animationIdRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      return;
    }

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 2048;
        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const draw = () => {
          animationIdRef.current = requestAnimationFrame(draw);

          analyser.getByteTimeDomainData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Background
          ctx.fillStyle = "#09090b";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Gradient stroke
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          gradient.addColorStop(0, "#14b8a6");
          gradient.addColorStop(1, "#0ea5e9");

          ctx.lineWidth = 2;
          ctx.strokeStyle = gradient;
          ctx.shadowColor = "#14b8a6";
          ctx.shadowBlur = 18;
          ctx.beginPath();

          const sliceWidth = canvas.width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * canvas.height) / 2;

            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            x += sliceWidth;
          }

          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
        };

        draw();
      } catch (err) {
        console.error("Microphone access denied or error:", err);
      }
    };

    init();

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [isRecording]);

  return (
    <div className="w-full h-28 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-inner">
      <canvas
        ref={canvasRef}
        width={window.innerWidth * 0.8}
        height={112}
        className="w-full h-full"
      />
    </div>
  );
}

