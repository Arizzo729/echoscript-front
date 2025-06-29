import React, { useEffect, useRef } from "react";

export default function RecordingWaveform({ isRecording }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationIdRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const setupCanvas = (canvas) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) setupCanvas(canvas);

    // Watch for size changes
    resizeObserverRef.current = new ResizeObserver(() => {
      if (canvas) setupCanvas(canvas);
    });
    resizeObserverRef.current.observe(canvas);

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isRecording) {
      cancelAnimationFrame(animationIdRef.current);
      audioContextRef.current?.close();
      audioContextRef.current = null;
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

          const width = canvas.clientWidth;
          const height = canvas.clientHeight;

          ctx.clearRect(0, 0, width, height);

          // Background
          ctx.fillStyle = "#09090b";
          ctx.fillRect(0, 0, width, height);

          // Line gradient
          const gradient = ctx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, "#14b8a6");
          gradient.addColorStop(1, "#0ea5e9");

          ctx.lineWidth = 2;
          ctx.strokeStyle = gradient;
          ctx.shadowColor = "#14b8a6";
          ctx.shadowBlur = 14;

          ctx.beginPath();
          const sliceWidth = width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * height) / 2;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            x += sliceWidth;
          }

          ctx.lineTo(width, height / 2);
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
      audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, [isRecording]);

  return (
    <div className="w-full h-28 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-inner">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

