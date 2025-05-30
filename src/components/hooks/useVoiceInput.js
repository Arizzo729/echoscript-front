// 3. useVoiceInput.js (Advanced with Whisper endpoint placeholder)
import { useState, useEffect } from "react";

export default function useVoiceInput() {
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [micStatus, setMicStatus] = useState("Initializing mic...");
  const [transcriptLive, setTranscriptLive] = useState(null);
  const [shortTranscript, setShortTranscript] = useState(null);

  useEffect(() => {
    const getMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContext();
        const analyser = context.createAnalyser();
        const source = context.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 64;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const recorder = new MediaRecorder(stream);
        let chunks = [];
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("file", blob, "input.webm");

          try {
            const response = await fetch("/api/transcribe", {
              method: "POST",
              body: formData
            });
            const result = await response.json();
            setTranscriptLive(result.transcript);
            setShortTranscript(result.transcript);
          } catch (err) {
            setTranscriptLive("(Unable to transcribe)");
          }
        };

        recorder.start();
        setMicStatus("Recording...");

        setTimeout(() => {
          recorder.stop();
        }, 3000);

        const animate = () => {
          requestAnimationFrame(animate);
          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setVoiceLevel(volume);
        };
        animate();
      } catch (err) {
        setMicStatus("Mic access denied.");
      }
    };
    getMic();
  }, []);

  return { voiceLevel, micStatus, transcriptLive, shortTranscript };
}