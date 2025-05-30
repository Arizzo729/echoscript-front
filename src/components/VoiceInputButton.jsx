import React from "react";
import { Mic, MicOff } from "lucide-react";
import useVoiceInput from "../hooks/useVoiceInput";

// ✅ Safe default for onTranscript to avoid crash
export default function VoiceInputButton({ onTranscript = () => {} }) {
  const { listening, startListening, stopListening } = useVoiceInput({
    onTranscript,
  });

  return (
    <button
      onClick={listening ? stopListening : startListening}
      className={`p-2 rounded-full transition ${
        listening ? "bg-red-500 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white"
      }`}
      aria-label={listening ? "Stop recording" : "Start recording"}
    >
      {listening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
}
