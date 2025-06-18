// pages/VideoUpload.jsx — EchoScript.AI Advanced Video Upload Page

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Languages, FileVideo, FileText, Subtitles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function VideoUpload() {
  const { t, i18n } = useTranslation();
  const [videoFile, setVideoFile] = useState(null);
  const [taskType, setTaskType] = useState("transcription");
  const [language, setLanguage] = useState(i18n.language || "en");
  const [status, setStatus] = useState(null);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
    setStatus(null);
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
      const response = await fetch("/api/video-task", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
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

  return (
    <motion.div
      className="max-w-3xl mx-auto px-6 py-16 text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold mb-6">{t("Upload a Video")}</h1>

      <form onSubmit={handleSubmit} className="grid gap-5">
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

        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg flex items-center justify-center gap-2"
          disabled={!videoFile || status === "processing"}
        >
          <Upload className="w-4 h-4" />
          {status === "processing" ? t("Processing...") : t("Submit")}
        </button>

        {status === "success" && (
          <p className="text-green-400">✅ {t("Your video was processed successfully!")}</p>
        )}
        {status === "error" && (
          <p className="text-red-400">❌ {t("There was an error. Please try again.")}</p>
        )}
      </form>
    </motion.div>
  );
}