// src/components/UploadAndTranscribe.jsx
import React, { useEffect, useRef, useState } from "react";
import { UploadCloud, CheckCircle, AlertCircle, XCircle, Clipboard } from "lucide-react";
import { motion } from "framer-motion";

// ✅ Build once: "/api" by default, no trailing slash
const API_BASE = (import.meta.env.VITE_API_BASE ?? "/api").replace(/\/+$/, "");
const TRANSCRIBE_URL = `${API_BASE}/v1/transcribe`;

export default function UploadAndTranscribe({
  fileInput,                 // File from parent (Upload page)
  language = "en",
  onTranscriptComplete,      // callback(json)
}) {
  const [items, setItems] = useState([]);          // [{name, loading, result, error}]
  const inflight = useRef(new Set());              // de-dupe same file
  const mounted = useRef(false);

  // Add/replace an item helper
  const upsert = (name, patch) =>
    setItems((list) => {
      const i = list.findIndex((x) => x.name === name);
      const next = [...list];
      if (i === -1) next.push({ name, loading: false, result: null, error: "", ...patch });
      else next[i] = { ...next[i], ...patch };
      return next;
    });

  // 🔑 Trigger transcription exactly once per new file
  useEffect(() => {
    if (!fileInput || !(fileInput instanceof File)) return;
    if (inflight.current.has(fileInput.name)) return; // already processing this file

    inflight.current.add(fileInput.name);
    upsert(fileInput.name, { loading: true, error: "" });

    const fd = new FormData();
    fd.append("file", fileInput);

    // DEBUG: if you want to see the exact URL in console
    console.log("[transcribe] POST", `${TRANSCRIBE_URL}?language=${language}`, fileInput.name);

    fetch(`${TRANSCRIBE_URL}?language=${encodeURIComponent(language)}`, {
      method: "POST",
      body: fd,
    })
      .then(async (r) => {
        const ct = r.headers.get("content-type") || "";
        const data = ct.includes("application/json") ? await r.json() : { detail: await r.text() };
        if (!r.ok) throw new Error(data?.detail || `HTTP ${r.status}`);
        upsert(fileInput.name, { loading: false, result: data, error: "" });
        onTranscriptComplete?.(data);
      })
      .catch((e) => {
        console.error("[transcribe] error", e);
        upsert(fileInput.name, {
          loading: false,
          error: e?.message || "Transcription failed",
        });
      })
      .finally(() => {
        // allow re-uploads of a *different* file name later
        setTimeout(() => inflight.current.delete(fileInput.name), 0);
      });
  }, [fileInput, language]); // runs when the parent passes a NEW File

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const removeItem = (name) => setItems((list) => list.filter((x) => x.name !== name));
  const copyText = (txt) => navigator.clipboard.writeText(txt || "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {items.map(({ name, loading, result, error }) => (
        <div
          key={name}
          className="p-4 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-100 relative"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-medium">{name}</span>
            </div>
            <button
              onClick={() => removeItem(name)}
              className="text-zinc-400 hover:text-red-400"
              title="Remove"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>

          {loading && (
            <div className="mt-3 text-sm text-blue-300">
              <span className="inline-block h-3 w-3 mr-2 animate-spin rounded-full border-2 border-blue-300 border-t-transparent" />
              Uploading & transcribing…
            </div>
          )}

          {!loading && error && (
            <div className="mt-3 text-sm text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {!loading && !error && result && (
            <div className="mt-3 space-y-2">
              <div className="text-sm text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Transcript ready
              </div>
              <div className="bg-zinc-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-300">Transcript</span>
                  <button
                    onClick={() => copyText(result.text || result.transcript || "")}
                    className="text-xs text-teal-300 hover:underline"
                  >
                    <Clipboard className="inline w-3 h-3 mr-1" />
                    Copy
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-zinc-100">
                  {result.text || result.transcript || "(empty)"}
                </pre>
              </div>
            </div>
          )}
        </div>
      ))}

      {!items.length && (
        <div className="text-sm text-zinc-400">
          Choose or record a file above to start transcription.
        </div>
      )}
    </motion.div>
  );
}
