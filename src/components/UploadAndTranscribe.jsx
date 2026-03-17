import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Loader, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../lib/api";

export default function UploadAndTranscribe({
  fileInput,
  countdown = 0,
  translate = false,
  onRecordingStart,
  onRecordingEnd,
  onTranscriptComplete,
}) {
  const { t } = useTranslation();
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
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const result = await api.transcribe(file, translate ? "auto" : "en");

      clearInterval(progressInterval);
      setProgress(100);
      
      // Check if result contains an error
      if (result?.error) {
        throw new Error(result.error);
      }
      
      // Call the callback with the result
      if (onTranscriptComplete) {
        onTranscriptComplete(result);
      }
    } catch (err) {
      console.error("Transcription error:", err);
      let errorMsg = err.message || `${t("upload.failed_file", "Failed to transcribe")} ${file.name}`;
      
      // Add helpful context based on error type
      if (err.status === 500) {
        errorMsg = `${t("upload.server_error", "Server error")}: ${err.message || "Please check the backend logs"}`;
      } else if (err.status === 413) {
        errorMsg = `${t("upload.file_too_large", "File is too large")}: Maximum size is 500MB`;
      } else if (err.status === 415) {
        errorMsg = `${t("upload.unsupported_format", "Unsupported file format")}`;
      }
      
      setError(errorMsg);
      
      // Still call callback with error info
      if (onTranscriptComplete) {
        onTranscriptComplete({ error: errorMsg });
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
          <h3 className="text-lg font-semibold text-white">{t("upload.processing", "Processing")}: {fileInput.name}</h3>
          <p className="text-sm text-zinc-400">
            {t("upload.size", "Size")}: {(fileInput.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-teal-400">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm">{t("upload.uploading_status", "Uploading and transcribing...")}</span>
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
          <span className="text-sm">{t("upload.complete_processing", "Upload complete! Processing results...")}</span>
        </div>
      )}
    </motion.div>
  );
}

