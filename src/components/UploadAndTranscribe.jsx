// src/components/UploadAndTranscribe.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, UploadCloud, CheckCircle, AlertCircle, Clipboard, XCircle } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import RecordingWaveform from "./RecordingWaveform";

// In dev, talk straight to FastAPI to avoid proxy issues
const BASE = "http://127.0.0.1:8000";


export default function UploadAndTranscribe({ language = "en" }) {
  const [files, setFiles] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});
  const [results, setResults] = useState({});
  const [recording, setRecording] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleFiles = (inputFiles) => {
    setError(null);
    const arr = Array.from(inputFiles).filter(
      (f) => f.type.startsWith("audio") || f.type.startsWith("video")
    );
    setFiles((prev) => [...prev, ...arr]);
    arr.forEach(uploadAndTranscribe);
  };

  const uploadAndTranscribe = async (file) => {
    setLoadingMap((prev) => ({ ...prev, [file.name]: true }));
    setResults((prev) => ({ ...prev, [file.name]: null }));
    try {
      const formData = new FormData();
      formData.append("file", file);

      // If you used the proxy rewrite in vite.config.js, you can call /api/transcribe instead.
      const res = await fetch(`${BASE}/api/v1/transcribe?language=${encodeURIComponent(language)}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      setResults((prev) => ({ ...prev, [file.name]: json }));
    } catch (err) {
      console.error(err);
      setError(`❌ Transcription failed for: ${file.name} (${err.message})`);
    } finally {
      setLoadingMap((prev) => ({ ...prev, [file.name]: false }));
    }
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const f = new File([blob], `recording-${Date.now()}.webm`, { type: "audio/webm" });
        handleFiles([f]);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error(err);
      setError("🎙️ Microphone access denied or unsupported.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current.stop();
    mediaRecorderRef.current?.stream?.getTracks()?.forEach((t) => t.stop());
    setRecording(false);
  };

  const removeFile = (name) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
    setResults((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    setLoadingMap((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const copyText = (text) => navigator.clipboard.writeText(text);

  return (
    <motion.div
      className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {showCountdown && (
        <CountdownTimer
          seconds={3}
          onComplete={() => {
            setShowCountdown(false);
            startRecording();
          }}
        />
      )}

      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col items-center px-4 py-3 bg-teal-50 dark:bg-zinc-700 border border-dashed border-teal-300 dark:border-zinc-500 rounded-lg cursor-pointer hover:bg-teal-100 dark:hover:bg-zinc-600">
          <UploadCloud size={20} className="text-teal-600 dark:text-white" />
          <span className="text-xs mt-1">Choose Files</span>
          <input
            type="file"
            multiple
            accept="audio/*,video/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </label>

        <button
          onClick={recording ? stopRecording : () => setShowCountdown(true)}
          className={`px-4 py-2 rounded-md text-white text-sm ${recording ? "bg-red-600" : "bg-green-600"}`}
        >
          <Mic size={16} className="inline mr-1" />
          {recording ? "Stop" : "Record"}
        </button>
      </div>

      {recording && <RecordingWaveform isRecording />}

      {error && (
        <div className="text-sm text-red-500 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {files.map((file) => {
        const result = results[file.name];
        const loading = !!loadingMap[file.name];

        return (
          <motion.div
            key={file.name}
            className="p-4 border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-100 dark:bg-zinc-900 space-y-2 relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-sm text-zinc-800 dark:text-white">{file.name}</h4>
              <button onClick={() => removeFile(file.name)} className="text-zinc-500 hover:text-red-500">
                <XCircle size={16} />
              </button>
            </div>

            {loading && (
              <div className="text-sm text-blue-400 flex items-center gap-2">
                <span className="animate-spin rounded-full h-3 w-3 border-t-2 border-blue-400" /> Transcribing…
              </div>
            )}

            {!loading && result?.text && (
              <div className="space-y-2">
                <div className="text-green-500 flex items-center gap-2 text-sm">
                  <CheckCircle size={16} /> Transcript ready
                </div>

                <div className="bg-zinc-200 dark:bg-zinc-800 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">Transcript</span>
                    <button onClick={() => copyText(result.text)} className="text-xs text-blue-500 hover:underline">
                      <Clipboard size={14} className="inline" /> Copy
                    </button>
                  </div>
                  <p className="text-sm text-zinc-800 dark:text-zinc-100 whitespace-pre-wrap">{result.text}</p>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

