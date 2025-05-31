import React, { useState } from "react";
import { motion } from "framer-motion";
import { UploadAndTranscribe } from "../components/UploadandTranscribe";
import LanguageModelSelector from "../components/Transcription";
import AdaptiveAI from "../components/AdaptiveAI";
import StatusConsole from "../components/StatusConsole";

export default function Transcripts() {
  const [activeTab, setActiveTab] = useState("upload");

  const tabClasses = (tab) =>
    `px-5 py-2.5 text-sm sm:text-base rounded-t-lg font-medium transition-all duration-200 ease-in-out focus:outline-none ${
      activeTab === tab
        ? "bg-teal-600 text-white shadow-md dark:bg-teal-400 dark:text-black"
        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
    }`;

  return (
    <motion.div
      className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className="text-4xl font-extrabold text-center mb-8 text-teal-600 dark:text-teal-400 drop-shadow-sm tracking-tight">
        🎧 Transcribe Anything with AI Precision
      </h1>

      <div className="flex justify-center gap-2 sm:gap-4 mb-6 border-b border-zinc-200 dark:border-zinc-700">
        <button className={tabClasses("upload")} onClick={() => setActiveTab("upload")}>
          Upload
        </button>
        <button className={tabClasses("ai")} onClick={() => setActiveTab("ai")}>
          AI Insights
        </button>
        <button className={tabClasses("console")} onClick={() => setActiveTab("console")}>
          Results Console
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-zinc-900 rounded-lg shadow-inner px-4 sm:px-6 py-6"
      >
        {activeTab === "upload" && (
          <div className="space-y-6">
            <LanguageModelSelector />
            <UploadAndTranscribe />
          </div>
        )}

        {activeTab === "ai" && <AdaptiveAI />}

        {activeTab === "console" && <StatusConsole />}
      </motion.div>
    </motion.div>
  );
}
