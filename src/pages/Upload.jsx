// ✅ EchoScript.AI — Upload Page with Live Transcript & AI Feedback
import React, { useState } from "react";
import { InboxArrowDownIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { languageOptions } from "../utils/languageOptions";
import Button from "../components/ui/Button";

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [transcript, setTranscript] = useState(null);
  const [aiFeedback, setAiFeedback] = useState(null);

  const filteredLanguages = languageOptions.filter((lang) =>
    lang.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTranscript(null);
      setAiFeedback(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTranscript(null);
      setAiFeedback(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleTranscribe = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setTranscript(null);
    setAiFeedback(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("language", selectedLanguage);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/transcribe-enhanced`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Transcription failed.");

      const data = await res.json();
      setTranscript(data.transcript);
      setAiFeedback(data.summary || "Transcript complete. No summary returned.");
    } catch (err) {
      console.error(err);
      setAiFeedback("❌ Failed to transcribe. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to="/dashboard" className="text-sm text-teal-500 hover:underline mb-6 inline-block">
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Upload Audio</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        Drag and drop audio files or click to browse. Supported formats: MP3, WAV, M4A.
      </p>

      {/* 🌍 Language Selector */}
      <div className="mb-8">
        <label htmlFor="language" className="block mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Language
        </label>
        <input
          type="text"
          placeholder="Search languages..."
          className="w-full mb-2 px-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {filteredLanguages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* 📥 Dropzone */}
      <div
        className={`border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${
          dragActive
            ? "border-teal-400 bg-teal-50/10"
            : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <label htmlFor="upload-input" className="flex flex-col items-center justify-center p-10">
          <InboxArrowDownIcon className="w-12 h-12 mb-2 text-teal-400" />
          <p className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {selectedFile ? "Change File" : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Max 100MB, one file at a time</p>
          <input
            id="upload-input"
            type="file"
            accept=".mp3,.wav,.m4a"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* 📎 File Details & Transcribe */}
      {selectedFile && (
        <div className="mt-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <PaperClipIcon className="w-5 h-5 text-teal-400" />
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-white">{selectedFile.name}</p>
              <p className="text-xs text-zinc-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>

          <div className="mt-4">
            <Button className="w-full" disabled={isUploading} onClick={handleTranscribe}>
              {isUploading ? "Transcribing..." : "Transcribe with EchoScript.AI"}
            </Button>
          </div>
        </div>
      )}

      {/* 📄 Transcript Output */}
      {transcript && (
        <div className="mt-8 p-6 bg-zinc-800 rounded-xl text-white border border-teal-600 shadow-inner">
          <h2 className="text-lg font-semibold mb-2 text-teal-400">Transcript:</h2>
          <pre className="whitespace-pre-wrap text-sm text-zinc-200">{transcript}</pre>
        </div>
      )}

      {/* 🧠 AI Feedback Output */}
      {aiFeedback && (
        <motion.div
          className="mt-4 bg-zinc-900 border border-blue-700 text-white p-4 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-semibold text-blue-400 mb-1">AI Feedback:</h3>
          <p className="text-sm text-blue-100">{aiFeedback}</p>
        </motion.div>
      )}
    </motion.div>
  );
}


