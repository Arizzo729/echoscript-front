// src/components/TranscribeUploader.jsx
import React, { useState } from "react";
import api from "../lib/api";

export default function TranscribeUploader() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const onPick = (e) => setFile(e.target.files?.[0] || null);

  const onUpload = async () => {
    if (!file) return;
    setBusy(true); setErr(""); setResult(null);
    try {
      // TODO: put your JWT here if your route requires auth
      const data = await api.transcribe(file /* , token */);
      setResult(data);
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-lg font-semibold">Transcribe</h2>
      <input className="mt-3 block w-full" type="file" accept="audio/*,video/*" onChange={onPick} />
      <button className="mt-4" disabled={!file || busy} onClick={onUpload}>
        {busy ? "Uploading…" : "Upload & Transcribe"}
      </button>
      {err && <p className="mt-3 text-red-500 text-sm">{err}</p>}
      {result && (
        <pre className="mt-4 text-sm overflow-auto p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

