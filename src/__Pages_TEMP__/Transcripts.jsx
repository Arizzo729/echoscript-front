import React, { useState } from "react";
import { motion } from "framer-motion";
import { UploadAndTranscribe } from "../components/UploadandTranscribe";
import LanguageModelSelector from "../components/Transcription";
import AdaptiveAI from "../components/AdaptiveAI";
import StatusConsole from "../components/StatusConsole";

export default function Transcripts() {
  const [activeTab, setActiveTab] = useState("upload");

  const tabClasses = (tab) =>
    `px-4 py-2 rounded-t-lg font-medium transition-colors duration-200 ${
      activeTab === tab
        ? "bg-primary text-white dark:bg-primary-light dark:text-black shadow"
        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <motion.div
      className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h1 className="text-4xl font-extrabold text-center mb-8 text-primary dark:text-primary-light drop-shadow">
        🎧 Transcribe Anything with AI Precision
      </h1>

      <div className="flex justify-center gap-4 mb-6 border-b dark:border-gray-700">
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeTab === "upload" && (
          <>
            <LanguageModelSelector />
            <div className="mt-6">
              <UploadAndTranscribe />
            </div>
          </>
        )}

        {activeTab === "ai" && <AdaptiveAI />}

        {activeTab === "console" && <StatusConsole />}
      </motion.div>
    </motion.div>
  );
}
