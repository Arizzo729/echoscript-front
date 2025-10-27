import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, AlertCircle, Server } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as api from "../lib/api";

export default function TranscriptsPage() {
  const { t } = useTranslation();
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        const data = await api.getTranscripts();
        if (Array.isArray(data)) {
          setTranscripts(data);
          setError("");
        } else {
          setTranscripts([]);
          setError("");
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        setTranscripts([]);
        setError("");
      } finally {
        setLoading(false);
      }
    };

    fetchTranscripts();
  }, [t]);

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <motion.h1
        className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {t("transcripts.title", "Your Transcripts")}
      </motion.h1>

      {loading ? (
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
          <Loader2 className="animate-spin w-5 h-5" />
          <span>{t("loading", "Loading...")}</span>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      ) : transcripts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/10 mb-4">
            <FileText className="w-8 h-8 text-teal-500" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
            {t("transcripts.empty.title", "No Transcripts Yet")}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            {t("transcripts.empty.description", "Your transcripts will appear here once you start using the transcription service.")}
          </p>
        </motion.div>
      ) : (
        <ul className="space-y-4">
          {transcripts.map((transcript) => (
            <motion.li
              key={transcript.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-xl border dark:border-zinc-700 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-500" />
                <span className="font-medium text-zinc-900 dark:text-white">
                  {transcript.title || "Untitled Transcript"}
                </span>
              </div>
              <p className="text-sm text-zinc-500 mt-1">
                {transcript.created_at
                  ? new Date(transcript.created_at).toLocaleString()
                  : "Unknown date"}
              </p>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}

