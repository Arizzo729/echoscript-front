// src/pages/Upload.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Minimal audio recorder hook (browser only).
 * start(): asks for mic, starts recording
 * stop(): stops and returns a File (audio/webm)
 */
function useSimpleRecorder() {
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

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const { recording, permissionError, start, stop } = useSimpleRecorder();

  const onPick = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
  };

  const onStartRec = async () => {
    const ok = await start();
    if (!ok) return;
  };

  const onStopRec = async () => {
    const f = await stop();
    if (f) setFile(f);
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Upload</h1>

      <div style={{ marginTop: 12 }}>
        <label>
          <span style={{ marginRight: 8 }}>Choose file:</span>
          <input type="file" onChange={onPick} />
        </label>
      </div>

      {permissionError && (
        <p style={{ color: "crimson", marginTop: 8 }}>{permissionError}</p>
      )}

      <div style={{ marginTop: 12 }}>
        {!recording ? (
          <button onClick={onStartRec}>Start recording</button>
        ) : (
          <button onClick={onStopRec}>Stop recording</button>
        )}
      </div>

      {file && (
        <p style={{ marginTop: 12 }}>
          Selected: <strong>{file.name}</strong>{" "}
          {typeof file.size === "number" ? `(${Math.round(file.size / 1024)} kB)` : ""}
        </p>
      )}
    </div>
  );
}

