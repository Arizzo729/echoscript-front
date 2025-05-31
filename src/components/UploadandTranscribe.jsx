
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, UploadCloud, CheckCircle, AlertCircle, Clipboard } from "lucide-react";

export function UploadAndTranscribe() {
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
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Microphone not supported on this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await uploadAndTranscribe(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch {
      setError("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleFileChange = async (e) => {
    setError(null);
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith("audio") && !selected.type.startsWith("video")) {
      setError("Only audio/video files are allowed.");
      return;
    }

    setFile(selected);
    await uploadAndTranscribe(selected);
  };

  const uploadAndTranscribe = async (inputFile) => {
    setLoading(true);
    setTranscript("");
    setSummary("");
    setSentiment(null);
    setKeywords([]);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", inputFile);

      const response = await fetch("/api/transcribe-enhanced", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to transcribe.");

      const result = await response.json();
      setTranscript(result.transcript || "");
      setSummary(result.summary || "");
      setSentiment(result.sentiment || "");
      setKeywords(result.keywords || []);
    } catch (err) {
      setError(err.message || "An error occurred during transcription.");
    } finally {
      setLoading(false);
    }
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-xl max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-5">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Upload audio/video file or record live:
        </label>

        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileChange}
          disabled={loading || recording}
          className="block w-full text-sm text-zinc-600 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <div className="flex gap-4 items-center flex-wrap">
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
              recording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            <Mic size={18} />
            {recording ? "Stop Recording" : "Record Live"}
          </button>

          {loading && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400 animate-pulse">
              Transcribing...
            </span>
          )}
          {error && (
            <span className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={16} /> {error}
            </span>
          )}
          {!loading && transcript && !error && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle size={16} /> Transcription ready
            </span>
          )}
        </div>

        {transcript && (
          <section className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-md text-sm relative">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-zinc-700 dark:text-zinc-100">Transcript</h3>
              <button
                onClick={copyTranscript}
                className="text-blue-600 dark:text-blue-400 hover:underline text-xs flex items-center gap-1"
              >
                <Clipboard size={14} />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-zinc-800 dark:text-zinc-100">{transcript}</p>
          </section>
        )}

        {summary && (
          <section className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md text-blue-800 dark:text-blue-300 text-sm">
            <h4 className="font-semibold mb-1">Summary</h4>
            <p className="italic">{summary}</p>
          </section>
        )}

        {sentiment && (
          <section className="p-4 rounded-md border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-700 dark:text-zinc-300">
            <h4 className="font-semibold mb-1">Sentiment</h4>
            <p>{sentiment}</p>
          </section>
        )}

        {keywords.length > 0 && (
          <section className="p-4 bg-zinc-200 dark:bg-zinc-700 rounded-md text-sm">
            <h4 className="font-semibold mb-2 text-zinc-800 dark:text-zinc-100">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="bg-blue-300 dark:bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium"
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
