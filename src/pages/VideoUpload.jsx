// pages/VideoUpload.jsx — EchoScript.AI Advanced Video Upload Page

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Languages,
  FileVideo,
  FileText,
  Subtitles,
  Download,
  Info,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const ACCEPTED_FORMATS = ["mp4", "mkv", "avi", "mov", "webm"];
const MAX_FILE_SIZE_MB = 300;

export default function VideoUpload() {
  const { t, i18n } = useTranslation();
  const [videoFile, setVideoFile] = useState(null);
  const [taskType, setTaskType] = useState("transcription");
  const [language, setLanguage] = useState(i18n.language || "en");
  const [status, setStatus] = useState(null);
  const [resultText, setResultText] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    const tooLarge = file.size > MAX_FILE_SIZE_MB * 1024 * 1024;
    const invalid = !ACCEPTED_FORMATS.includes(ext);

    if (tooLarge) {
      setStatus("file_too_large");
      setVideoFile(null);
      return;
    }

    if (invalid) {
      setStatus("invalid_format");
      setVideoFile(null);
      return;
    }

    setVideoFile(file);
    setStatus(null);
    setResultText("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return;
    setStatus("processing");

    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("type", taskType);
    formData.append("language", language);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/video-task`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResultText(data?.result || t("Task completed successfully."));
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const switchLanguage = () => {
    const newLang = language === "en" ? "es" : "en";
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);
  };

  const handleDownload = () => {
    const blob = new Blob([resultText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${taskType}_result.txt`;
    link.click();
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-6 py-16 text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold">🎬 Upload & Transcribe Video</h1>
          <p className="text-zinc-400 text-sm">
            Supports MP4, MKV, AVI, MOV and more. Choose transcription or subtitle generation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-lg">
          {/* File Upload */}
          <label className="flex items-center gap-3 p-4 border border-zinc-700 rounded-lg bg-zinc-800 cursor-pointer hover:bg-zinc-700">
            <FileVideo className="w-5 h-5 text-teal-400" />
            <span>{videoFile ? videoFile.name : t("Choose a video file")}</span>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Task Type */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setTaskType("transcription")}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                taskType === "transcription"
                  ? "bg-teal-600 border-teal-500"
                  : "bg-zinc-800 border-zinc-700"
              }`}
            >
              <FileText className="w-4 h-4 inline-block mr-1" /> {t("Transcription")}
            </button>
            <button
              type="button"
              onClick={() => setTaskType("subtitles")}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                taskType === "subtitles"
                  ? "bg-teal-600 border-teal-500"
                  : "bg-zinc-800 border-zinc-700"
              }`}
            >
              <Subtitles className="w-4 h-4 inline-block mr-1" /> {t("Subtitles")}
            </button>
          </div>

          {/* Language Switch */}
          <div className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <Languages className="text-teal-400 w-4 h-4" />
              <span>{t("Language")}: {language.toUpperCase()}</span>
            </div>
            <button
              type="button"
              onClick={switchLanguage}
              className="text-sm text-white px-3 py-1 rounded border border-zinc-600 hover:bg-zinc-700"
            >
              {language === "en" ? "Español" : "English"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg flex items-center justify-center gap-2"
            disabled={!videoFile || status === "processing"}
          >
            <Upload className="w-4 h-4" />
            {status === "processing" ? t("Processing...") : t("Submit")}
          </button>

          {/* Result & Download */}
          {status === "success" && (
            <div className="space-y-3">
              <p className="text-green-400">✅ {t("Video processed successfully.")}</p>
              {resultText && (
                <div className="bg-zinc-800 p-4 rounded border border-zinc-700">
                  <pre className="text-sm text-zinc-200 whitespace-pre-wrap">{resultText}</pre>
                  <button
                    onClick={handleDownload}
                    className="mt-3 text-sm text-teal-400 flex items-center gap-2 hover:underline"
                  >
                    <Download className="w-4 h-4" /> {t("Download Result")}
                  </button>
                </div>
              )}
            </div>
          )}

          {status === "error" && (
            <p className="text-red-400">❌ {t("There was an error. Please try again.")}</p>
          )}

          {status === "file_too_large" && (
            <p className="text-red-400">
              ⚠️ {t("File is too large. Max size is")} {MAX_FILE_SIZE_MB}MB.
            </p>
          )}

          {status === "invalid_format" && (
            <p className="text-red-400">
              ⚠️ {t("Unsupported file format. Accepted formats:")} {ACCEPTED_FORMATS.join(", ").toUpperCase()}
            </p>
          )}
        </form>

        {/* Info Footer */}
        <div className="text-sm text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-lg p-4 space-y-2">
          <p>
            <Info className="inline-block w-4 h-4 text-blue-400 mr-1" />
            Transcription and subtitle files will be downloadable after processing.
          </p>
          <p>
            <Languages className="inline-block w-4 h-4 text-teal-400 mr-1" />
            Multiple languages supported with automatic formatting.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
