// src/pages/Upload.jsx
import React, { useState } from "react";
import { InboxArrowDownIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else setDragActive(false);
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Link */}
      <Link to="/dashboard" className="text-sm text-blue-500 hover:underline mb-6 inline-block">
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Upload Audio</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        Drag and drop audio files or click to browse. Supported formats: MP3, WAV, M4A.
      </p>

      {/* Upload Box */}
      <div
        className={`border-2 border-dashed rounded-lg transition-colors ${
          dragActive
            ? "border-teal-400 bg-teal-50/10"
            : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <label htmlFor="upload-input" className="flex flex-col items-center justify-center p-10 cursor-pointer">
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

      {/* File Preview */}
      {selectedFile && (
        <div className="mt-6 p-4 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <PaperClipIcon className="w-5 h-5 text-teal-400" />
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-white">{selectedFile.name}</p>
              <p className="text-xs text-zinc-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>

          {/* Submit Button (placeholder) */}
          <button
            className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-semibold shadow transition-all"
            onClick={() => alert("TODO: Hook up backend upload")}
          >
            Transcribe with EchoScript.AI
          </button>
        </div>
      )}
    </motion.div>
  );
}

