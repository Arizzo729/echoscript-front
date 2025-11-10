import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Loader, AlertCircle } from "lucide-react";
import API_BASE from "../lib/apiBase";

export default function UploadAndTranscribe({
  fileInput,
  countdown = 0,
  translate = false,
  onRecordingStart,
  onRecordingEnd,
  onTranscriptComplete,
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const uploadedRef = useRef(false);


  // Upload the file when fileInput changes
  useEffect(() => {
    if (!fileInput || uploadedRef.current) return;
    
    uploadedRef.current = true;
    uploadAndTranscribe(fileInput);
    
    // Reset when file changes
    return () => {
      uploadedRef.current = false;
    };
  }, [fileInput]);

  const uploadAndTranscribe = async (file) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", translate ? "auto" : "en");

      // Get access token from localStorage
      const accessToken = localStorage.getItem('access_token');

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Prepare headers
      const headers = {};
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const res = await fetch(`${API_BASE}/v1/transcribe`, {
        method: "POST",
        body: formData,
        headers: headers,
        credentials: "include",
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          throw new Error("Please log in to transcribe files");
        }
        throw new Error(errorData.detail || `Upload failed: ${res.statusText}`);
      }

      const result = await res.json();
      
      // Call the callback with the result
      if (onTranscriptComplete) {
        onTranscriptComplete(result);
      }
    } catch (err) {
      console.error("Transcription error:", err);
      setError(err.message || `Failed to transcribe ${file.name}. Please try again.`);
      
      // Still call callback with error info
      if (onTranscriptComplete) {
        onTranscriptComplete({ error: err.message });
      }
    } finally {
      setUploading(false);
    }
  };

  if (!fileInput) {
    return null;
  }

  return (
    <motion.div
      className="p-6 bg-zinc-800 rounded-xl shadow-lg space-y-4 border border-zinc-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3">
        <UploadCloud className="w-6 h-6 text-teal-400" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">Processing: {fileInput.name}</h3>
          <p className="text-sm text-zinc-400">
            Size: {(fileInput.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-teal-400">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm">Uploading and transcribing...</span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-zinc-400 text-center">{progress}%</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!uploading && !error && (
        <div className="flex items-center gap-2 text-green-400">
          <UploadCloud className="w-5 h-5" />
          <span className="text-sm">Upload complete! Processing results...</span>
        </div>
      )}
    </motion.div>
  );
}

