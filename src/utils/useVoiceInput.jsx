// src/utils/useVoiceInput.jsx
import { useState } from "react";

/**
 * Build-safe placeholder hook (no JSX).
 * Wire your speech SDK/Web Speech API later.
 */
export default function useVoiceInput() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const start = () => {
    setError("");
    setListening(true);
    // TODO: start recognition and update transcript
  };

  const stop = () => {
    setListening(false);
    // TODO: stop recognition and finalize transcript
  };

  const reset = () => setTranscript("");

  return { listening, transcript, error, start, stop, reset };
}