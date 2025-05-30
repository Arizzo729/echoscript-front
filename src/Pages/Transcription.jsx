import React, { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Mic, Loader2, Wand2, TextCursorInput } from "lucide-react";
import { useTheme } from "../context/useTheme";

export default function Transcription() {
  const [rawTranscript, setRawTranscript] = useState("Raw audio transcript will appear here...");
  const [cleanTranscript, setCleanTranscript] = useState("Cleaned transcript with GPT enhancements...");
  const [viewMode, setViewMode] = useState("clean"); // 'clean' or 'raw'
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();

  const handleUpload = async () => {
    setLoading(true);
    setTimeout(() => {
      setRawTranscript("Original speech, like um, with pauses... yeah, okay?");
      setCleanTranscript("Original speech with pauses removed.");
      setLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      className="p-8 w-full max-w-5xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Transcribe Audio</h1>

      {/* Upload + Record */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.button
          onClick={handleUpload}
          disabled={loading}
          className="bg-primary hover:bg-primary-light text-white font-semibold px-6 py-4 rounded-lg flex items-center justify-center gap-3 transition"
          whileTap={{ scale: 0.95 }}
        >
          <UploadCloud size={20} />
          {loading ? <Loader2 className="animate-spin" /> : "Upload Audio"}
        </motion.button>

        <motion.button
          className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold px-6 py-4 rounded-lg flex items-center justify-center gap-3 transition"
          whileTap={{ scale: 0.95 }}
        >
          <Mic size={20} />
          Start Recording
        </motion.button>
      </div>

      {/* Transcript Viewer */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <TextCursorInput size={20} />
            Transcript Preview
          </h2>

          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                viewMode === "clean"
                  ? "bg-primary text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => setViewMode("clean")}
            >
              Clean
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                viewMode === "raw"
                  ? "bg-primary text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => setViewMode("raw")}
            >
              Raw
            </button>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {viewMode === "clean" ? cleanTranscript : rawTranscript}
        </p>
      </div>

      {/* AI Actions */}
      <div className="flex flex-wrap gap-4 mt-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition">
          <Wand2 size={18} />
          Clean with GPT
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition">
          Summarize
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition">
          Label Speakers
        </button>
      </div>
    </motion.div>
  );
}
