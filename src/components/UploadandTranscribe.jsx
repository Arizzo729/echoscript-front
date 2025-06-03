import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Clipboard,
} from "lucide-react";

export default function UploadAndTranscribe({ language = "auto", model = "medium" }) {
  const [file, setFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [sentiment, setSentiment] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await uploadAndTranscribe(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch {
      setError("Microphone access denied or unsupported.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith("audio") && !selected.type.startsWith("video")) {
      setError("Only audio or video files are allowed.");
      return;
    }

    setFile(selected);
    await uploadAndTranscribe(selected);
  };

  const uploadAndTranscribe = async (inputFile) => {
    if (loading || recording) return;

    setLoading(true);
    setTranscript("");
    setSummary("");
    setSentiment(null);
    setKeywords([]);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", inputFile);
      formData.append("language", language);
      formData.append("model", model);

      const res = await fetch("/api/transcribe-enhanced", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error during transcription.");

      const data = await res.json();
      setTranscript(data.transcript || "");
      setSummary(data.summary || "");
      setSentiment(data.sentiment || "");
      setKeywords(data.keywords || []);
    } catch (err) {
      setError(err.message || "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyTranscript = () => {
    if (!navigator.clipboard) {
      setError("Clipboard API not supported.");
      return;
    }
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-6">
        <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-300">
          Upload audio/video file or record live:
        </label>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className="flex flex-col items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-50 dark:bg-zinc-700 rounded-lg border border-dashed border-blue-300 dark:border-zinc-500 text-blue-700 dark:text-white hover:bg-blue-100 cursor-pointer transition">
            <UploadCloud size={20} />
            <span className="mt-1 text-sm">Choose File</span>
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileChange}
              disabled={loading || recording}
              className="hidden"
            />
          </label>

          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-md font-medium transition ${
              recording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            } text-white`}
            aria-label={recording ? "Stop recording" : "Start recording"}
          >
            <Mic size={18} />
            {recording ? "Stop" : "Record"}
          </button>
        </div>

        {error && (
          <div className="flex items-center text-red-600 gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {loading && (
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Transcribing...</div>
        )}
        {!loading && transcript && !error && (
          <div className="text-sm text-green-600 flex items-center gap-2">
            <CheckCircle size={16} /> Transcript ready
          </div>
        )}

        {transcript && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-md text-sm relative"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-zinc-800 dark:text-white">Transcript</h3>
              <button
                onClick={copyTranscript}
                aria-label="Copy transcript to clipboard"
                className="text-blue-600 dark:text-blue-400 hover:underline text-xs flex items-center gap-1"
              >
                <Clipboard size={14} />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-200">{transcript}</p>
          </motion.section>
        )}

        {summary && (
          <section className="p-4 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-md text-sm">
            <h4 className="font-semibold mb-1">Summary</h4>
            <p className="italic">{summary}</p>
          </section>
        )}

        {sentiment && (
          <section className="p-4 border border-zinc-300 dark:border-zinc-600 rounded-md text-sm">
            <h4 className="font-semibold mb-1 text-zinc-800 dark:text-white">Sentiment</h4>
            <p className="text-zinc-600 dark:text-zinc-300">{sentiment}</p>
          </section>
        )}

        {Array.isArray(keywords) && keywords.length > 0 && (
          <section className="p-4 bg-zinc-200 dark:bg-zinc-700 rounded-md text-sm">
            <h4 className="font-semibold mb-2 text-zinc-800 dark:text-zinc-100">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="bg-blue-400 dark:bg-blue-600 text-white px-3 py-1 rounded-full text-xs"
                >
                  {kw}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}

