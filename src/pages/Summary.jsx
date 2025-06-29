import React, { useState } from "react";
import { motion } from "framer-motion";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import { Sparkles, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const tones = [
  { id: "default", label: "Smart" },
  { id: "friendly", label: "Friendly" },
  { id: "formal", label: "Formal" },
  { id: "bullet", label: "Bulleted" },
  { id: "action", label: "Action-Oriented" },
];

const lengths = ["short", "medium", "long"];

export default function SummaryPage() {
  const { t } = useTranslation();
  const [transcript, setTranscript] = useState("");
  const [tone, setTone] = useState("default");
  const [length, setLength] = useState("short");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [cached, setCached] = useState(false);

  const generateSummary = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setSummary("");
    setCached(false);

    try {
      const res = await fetch("/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, tone, length }),
      });
      const data = await res.json();
      setSummary(data.summary);
      setCached(data.cached);
    } catch (err) {
      setSummary(t("Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-6 py-12 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-4xl font-extrabold mb-6 text-center text-teal-500 tracking-tight">
        🧠 AI-Powered Summarizer
      </h1>

      <p className="text-center mb-8 text-zinc-400">
        {t("Paste your transcript below and generate a clear, structured summary with advanced GPT AI.")}
      </p>

      <Textarea
        rows={10}
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder={t("Paste your transcript here...")}
        className="w-full mb-6 resize-y text-sm bg-zinc-900 text-white border border-zinc-700 rounded-lg p-3"
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {tones.map((tOption) => (
            <button
              key={tOption.id}
              onClick={() => setTone(tOption.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                tone === tOption.id
                  ? "bg-teal-600 text-white shadow"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {tOption.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {lengths.map((l) => (
            <button
              key={l}
              onClick={() => setLength(l)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                length === l
                  ? "bg-blue-600 text-white shadow"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={generateSummary}
          disabled={loading}
          icon={loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          className="w-full max-w-sm mx-auto"
        >
          {loading ? t("Summarizing...") : t("Generate Summary")}
        </Button>
      </div>

      {summary && (
        <motion.div
          className="mt-10 p-6 bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg whitespace-pre-wrap text-sm leading-relaxed font-mono text-zinc-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {cached && (
            <div className="mb-3 text-xs italic text-yellow-400">
              ({t("from cache")})
            </div>
          )}
          {summary}
        </motion.div>
      )}
    </motion.div>
  );
}
