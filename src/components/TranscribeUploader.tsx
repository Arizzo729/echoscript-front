import React, { useState } from 'react';
import { transcribe } from '../lib/api';

export default function TranscribeUploader() {
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    setError(null);
    setText('');
    try {
      const data = await transcribe(f, { diarize: false, vad: false, language: 'en' });
      setText(data.text || '');
    } catch (err: any) {
      setError(err?.message ?? 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Transcribe Audio</h1>

      <label className="block">
        <span className="mb-2 block">Choose an audio file</span>
        <input type="file" accept="audio/*" onChange={onFile} disabled={busy} />
      </label>

      {!busy && !text && !error && <div className="text-sm text-zinc-500">No transcript yet.</div>}
      {busy && <div>Transcribing…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {text && (
        <div className="rounded-xl p-4 bg-gray-100 whitespace-pre-wrap">
          {text}
        </div>
      )}
    </div>
  );
}

