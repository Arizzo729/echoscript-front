// src/lib/api.ts
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function transcribe(
  file: File,
  opts?: { diarize?: boolean; vad?: boolean; language?: string }
) {
  const params = new URLSearchParams({
    diarize: String(opts?.diarize ?? false),
    vad: String(opts?.vad ?? false),
    language: opts?.language ?? "en",
  });

  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_BASE}/api/v1/transcribe?${params}`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    if (res.status === 413) throw new Error("File too large (HTTP 413). Try a shorter clip.");
    throw new Error(`Transcribe failed: HTTP ${res.status}`);
  }

  return res.json();
}
