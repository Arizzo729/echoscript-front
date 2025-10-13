import React, { useEffect, useRef } from "react";

export default function RecordingWaveform({ isRecording }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationIdRef = useRef(null);
  const resizeObserverRef = useRef(null);
<<<<<<< Updated upstream
  const streamRef = useRef(null); // NEW: keep reference to stop tracks on cleanup

  const setupCanvas = (canvas) => {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 0;
    const height = canvas.clientHeight || 0;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  // Prepare canvas + resize handling
=======

  const setupCanvas = (canvas) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
  };

>>>>>>> Stashed changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) setupCanvas(canvas);

    // Watch for size changes
<<<<<<< Updated upstream
    if (canvas && typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => setupCanvas(canvas));
      resizeObserverRef.current = ro;
      ro.observe(canvas);
    }

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, []);

  // Recording lifecycle
  useEffect(() => {
    if (!isRecording) {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;

      // Close audio context
      audioContextRef.current?.close().catch(() => {});
      audioContextRef.current = null;

      // Stop mic tracks
      try {
        streamRef.current?.getTracks?.().forEach((t) => t.stop());
      } catch {}
      streamRef.current = null;

      return;
    }

    let cancelled = false;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          // If we toggled off before permission resolved, stop tracks immediately
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioCtx();
=======
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
>>>>>>> Stashed changes
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 2048;
        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);

<<<<<<< Updated upstream
        // Store refs
        streamRef.current = stream;
=======
>>>>>>> Stashed changes
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;

        const canvas = canvasRef.current;
<<<<<<< Updated upstream
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const draw = () => {
          if (!analyserRef.current || !dataArrayRef.current) return;
          animationIdRef.current = requestAnimationFrame(draw);

          analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

          const width = canvas.clientWidth || 0;
          const height = canvas.clientHeight || 0;
=======
        const ctx = canvas.getContext("2d");

        const draw = () => {
          animationIdRef.current = requestAnimationFrame(draw);

          analyser.getByteTimeDomainData(dataArray);

          const width = canvas.clientWidth;
          const height = canvas.clientHeight;
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
          const sliceWidth = width / (dataArrayRef.current.length || 1);
          let x = 0;

          for (let i = 0; i < dataArrayRef.current.length; i++) {
            const v = dataArrayRef.current[i] / 128.0;
=======
          const sliceWidth = width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      cancelled = true;
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;

      audioContextRef.current?.close().catch(() => {});
      audioContextRef.current = null;

      try {
        streamRef.current?.getTracks?.().forEach((t) => t.stop());
      } catch {}
      streamRef.current = null;
=======
      cancelAnimationFrame(animationIdRef.current);
      audioContextRef.current?.close();
      audioContextRef.current = null;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
