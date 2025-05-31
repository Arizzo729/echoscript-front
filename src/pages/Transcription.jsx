import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  Mic,
  Loader2,
  Wand2,
  TextCursorInput,
} from "lucide-react";
import { useTheme } from "../context/useTheme";
import Button from "../components/ui/Button";

export default function Transcription() {
  const [rawTranscript, setRawTranscript] = useState("Raw audio transcript will appear here...");
  const [cleanTranscript, setCleanTranscript] = useState("Cleaned transcript with GPT enhancements...");
  const [viewMode, setViewMode] = useState("clean");
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
        <Button
          onClick={handleUpload}
          disabled={loading}
          className="w-full justify-center"
          size="lg"
          variant="primary"
        >
          <UploadCloud size={20} />
          {loading ? <Loader2 className="animate-spin" /> : "Upload Audio"}
        </Button>

        <Button
          className="w-full justify-center"
          size="lg"
          variant="secondary"
        >
          <Mic size={20} />
          Start Recording
        </Button>
      </div>

      {/* Transcript Viewer */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <TextCursorInput size={20} />
            Transcript Preview
          </h2>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === "clean" ? "primary" : "secondary"}
              onClick={() => setViewMode("clean")}
            >
              Clean
            </Button>
            <Button
              size="sm"
              variant={viewMode === "raw" ? "primary" : "secondary"}
              onClick={() => setViewMode("raw")}
            >
              Raw
            </Button>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {viewMode === "clean" ? cleanTranscript : rawTranscript}
        </p>
      </div>

      {/* AI Actions */}
      <div className="flex flex-wrap gap-4 mt-6">
        <Button variant="primary">
          <Wand2 size={18} />
          Clean with GPT
        </Button>
        <Button variant="secondary">
          Summarize
        </Button>
        <Button variant="secondary">
          Label Speakers
        </Button>
      </div>
    </motion.div>
  );
}

