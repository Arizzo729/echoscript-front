// ✅ EchoScript.AI — Summary.jsx (GPT Summary Generator with Tone & Length)
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import { Sparkles, Loader2 } from "lucide-react";

const tones = [
  { id: "default", label: "Smart" },
  { id: "friendly", label: "Friendly" },
  { id: "formal", label: "Formal" },
  { id: "bullet", label: "Bulleted" },
  { id: "action", label: "Action-Only" },
];

const lengths = ["short", "medium", "long"];

export default function Summary() {
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
      setSummary("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-6 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-4xl font-extrabold mb-6 text-center text-teal-600 dark:text-teal-400 tracking-tight">
        🧠 GPT-Enhanced Summary
      </h1>

      <p className="text-center mb-8 text-zinc-600 dark:text-zinc-400">
        Paste your transcript below and get a structured summary using AI.
      </p>

      <Textarea
        rows={10}
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Paste your transcript here..."
        className="w-full mb-6 resize-y text-sm dark:bg-zinc-800 dark:text-white"
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {tones.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition
              ${
                tone === t.id
                  ? "bg-teal-600 text-white shadow dark:bg-teal-400 dark:text-black"
                  : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {lengths.map((l) => (
            <button
              key={l}
              onClick={() => setLength(l)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition
              ${
                length === l
                  ? "bg-blue-600 text-white shadow dark:bg-blue-400 dark:text-black"
                  : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
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
          {loading ? "Summarizing..." : "Generate Summary"}
        </Button>
      </div>

      {summary && (
        <motion.div
          className="mt-10 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-md whitespace-pre-wrap text-sm leading-relaxed font-mono text-zinc-800 dark:text-zinc-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {cached && (
            <div className="mb-3 text-xs italic text-yellow-500">
              (from cache)
            </div>
          )}
          {summary}
        </motion.div>
      )}
    </motion.div>
  );
}
