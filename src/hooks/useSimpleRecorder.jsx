// src/hooks/useSimpleRecorder.jsx
import {useRef, useState, useState} from "react";

/**
 * Minimal audio recorder hook (browser only).
 * start(): asks for mic, starts recording
 * stop(): stops and returns a File (audio/webm)
 */
export default function useSimpleRecorder() {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [permissionError, setPermissionError] = useState("");

  const start = async () => {
    setPermissionError("");
    chunksRef.current = [];
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("MediaDevices API not available");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mr.ondataavailable = (e) => e.data && chunksRef.current.push(e.data);
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      return true;
    } catch (err) {
      setPermissionError(err?.message || "Microphone permission denied.");
      return false;
    }
  };

  const stop = () =>
    new Promise((resolve) => {
      const mr = mediaRecorderRef.current;
      if (!mr) return resolve(null);
      mr.onstop = () => {
        try {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const file = new File([blob], `recording-${Date.now()}.webm`, {
            type: "audio/webm",
          });
          streamRef.current?.getTracks?.().forEach((t) => t.stop());
          resolve(file);
        } catch {
          resolve(null);
        } finally {
          chunksRef.current = [];
          mediaRecorderRef.current = null;
          streamRef.current = null;
          setRecording(false);
        }
      };
      mr.stop();
    });

  return { recording, permissionError, start, stop };
}