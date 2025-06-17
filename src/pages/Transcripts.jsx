// ✅ EchoScript.AI — Final UploadAndTranscribe.jsx (Unified Logic)
import React, { useState } from "react";
import { InboxArrowDownIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { languageOptions } from "../utils/languageOptions";
import Button from "../components/ui/Button";

export default function UploadAndTranscribe({ language = "en", model = "medium" }) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState(null);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);

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
    if (!selectedFile || dailyLimitReached) return;
    setIsUploading(true);
    setProgress(0);
    setTranscript(null);
    setAiFeedback(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("language", language);
    formData.append("model", model);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/transcribe-enhanced`, {
        method: "POST",
        body: formData,
      });

      if (res.status === 429) {
        setDailyLimitReached(true);
        return;
      }

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
    <motion.div className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Dropzone */}
      <div
        className={`border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${
          dragActive
            ? "border-teal-400 bg-teal-50/10 shadow-md"
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
          <input id="upload-input" type="file" accept=".mp3,.wav,.m4a" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {/* File Info & Transcribe */}
      {selectedFile && (
        <div className="mt-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <PaperClipIcon className="w-5 h-5 text-teal-400" />
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-white">{selectedFile.name}</p>
              <p className="text-xs text-zinc-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>

          {isUploading && (
            <div className="mt-4 w-full h-3 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div className="h-full bg-teal-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          )}

          <div className="mt-4">
            <Button className="w-full" disabled={isUploading || dailyLimitReached} onClick={handleTranscribe}>
              {dailyLimitReached
                ? "Limit Reached – Upgrade Plan"
                : isUploading
                ? "Uploading..."
                : "Transcribe with EchoScript.AI"}
            </Button>
          </div>

          {dailyLimitReached && (
            <div className="mt-3 text-center text-sm text-red-500 bg-red-100 dark:bg-red-900 p-3 rounded-md">
              You've reached your free transcription limit for today.{' '}
              <Link to="/purchase" className="text-teal-500 underline font-medium">
                Upgrade your plan →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Output Sections */}
      {transcript && (
        <motion.div
          className="mt-8 p-6 bg-zinc-800 rounded-xl text-white border border-teal-600 shadow-inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-2 text-teal-400">Transcript:</h2>
          <pre className="whitespace-pre-wrap text-sm text-zinc-200">{transcript}</pre>
        </motion.div>
      )}

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
