// ✅ EchoScript.AI — Advanced UploadAndTranscribe.jsx with Multi-File, Summary, Sentiment, Subtitles
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Clipboard,
  XCircle,
  Subtitles,
} from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import RecordingWaveform from "./RecordingWaveform";

export default function UploadAndTranscribe({ language = "auto", model = "medium" }) {
  const [files, setFiles] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});
  const [results, setResults] = useState({});
  const [recording, setRecording] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const API_URL = import.meta.env.VITE_API_BASE || "https://precious-rejoicing-production.up.railway.app";

  const handleFiles = async (inputFiles) => {
    if (inputFiles.length + files.length > 5) {
      setError("⚠️ Max 5 files allowed.");
      return;
    }
    const valid = Array.from(inputFiles).filter(f => f.type.startsWith("audio") || f.type.startsWith("video"));
    setFiles(prev => [...prev, ...valid]);
    valid.forEach(uploadAndTranscribe);
  };

  const uploadAndTranscribe = async (file) => {
    setLoadingMap(prev => ({ ...prev, [file.name]: true }));
    setResults(prev => ({ ...prev, [file.name]: null }));
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);
      formData.append("model", model);

      const res = await fetch(`${API_URL}/api/transcribe`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      setResults(prev => ({ ...prev, [file.name]: json }));
    } catch (err) {
      console.error(err);
      setError("❌ Transcription failed for: " + file.name);
    } finally {
      setLoadingMap(prev => ({ ...prev, [file.name]: false }));
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
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const virtualFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        handleFiles([virtualFile]);
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
    mediaRecorderRef.current?.stream?.getTracks()?.forEach(track => track.stop());
    setRecording(false);
  };

  const removeFile = (name) => {
    setFiles(prev => prev.filter(f => f.name !== name));
    setResults(prev => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
    setLoadingMap(prev => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {showCountdown && <CountdownTimer seconds={3} onComplete={() => { setShowCountdown(false); startRecording(); }} />}

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
      {error && <div className="text-sm text-red-500 flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}

      {files.map((file) => {
        const result = results[file.name];
        const loading = loadingMap[file.name];
        return (
          <motion.div
            key={file.name}
            className="p-4 border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-100 dark:bg-zinc-900 space-y-2 relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-sm text-zinc-800 dark:text-white">{file.name}</h4>
              <button
                onClick={() => removeFile(file.name)}
                className="text-zinc-500 hover:text-red-500"
              >
                <XCircle size={16} />
              </button>
            </div>

            {loading && (
              <div className="text-sm text-blue-400 flex items-center gap-2">
                <span className="animate-spin rounded-full h-3 w-3 border-t-2 border-blue-400" /> Transcribing...
              </div>
            )}

            {!loading && result?.transcript && (
              <div className="space-y-2">
                <div className="text-green-500 flex items-center gap-2 text-sm">
                  <CheckCircle size={16} /> Transcript ready
                </div>

                <div className="bg-zinc-200 dark:bg-zinc-800 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">Transcript</span>
                    <button
                      onClick={() => copyText(result.transcript)}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      <Clipboard size={14} className="inline" /> Copy
                    </button>
                  </div>
                  <p className="text-sm text-zinc-800 dark:text-zinc-100 whitespace-pre-wrap">{result.transcript}</p>
                </div>

                {result.summary && (
                  <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-md text-sm">
                    <h5 className="font-semibold mb-1 text-blue-800 dark:text-blue-300">Summary</h5>
                    <p className="italic text-blue-700 dark:text-blue-200">{result.summary}</p>
                  </div>
                )}

                {result.sentiment && (
                  <div className="bg-zinc-50 dark:bg-zinc-700 p-3 rounded-md text-sm">
                    <h5 className="font-semibold mb-1 text-zinc-800 dark:text-zinc-200">Sentiment</h5>
                    <p className="text-zinc-600 dark:text-zinc-300">{result.sentiment}</p>
                  </div>
                )}

                {Array.isArray(result.keywords) && result.keywords.length > 0 && (
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-700 rounded-md text-sm">
                    <h5 className="font-semibold mb-1 text-zinc-700 dark:text-zinc-100">Keywords</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-400 dark:bg-blue-600 text-white px-3 py-1 rounded-full text-xs"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.subtitles && (
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-800 rounded-md text-sm">
                    <h5 className="font-semibold flex items-center gap-1 text-yellow-900 dark:text-yellow-200">
                      <Subtitles size={16} /> Subtitles
                    </h5>
                    <pre className="text-xs whitespace-pre-wrap mt-1 text-yellow-900 dark:text-yellow-100">
                      {result.subtitles}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

