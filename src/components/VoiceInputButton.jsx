import React from "react";
import { Mic, MicOff } from "lucide-react";
import useVoiceInput from "../hooks/useVoiceInput";

/**
 * VoiceInputButton — toggles microphone for live voice input
 * - Safe fallback if `onTranscript` not provided
 * - Color-coded for recording state
 * - Fully accessible and dark-mode friendly
 */
export default function VoiceInputButton({ onTranscript = () => {} }) {
  const { listening, startListening, stopListening } = useVoiceInput({ onTranscript });

  const handleClick = () => {
    listening ? stopListening() : startListening();
  };

  return (
    <button
      onClick={handleClick}
      className={`p-3 rounded-full shadow-md border transition-all duration-300 ease-out 
        ${listening 
          ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
          : "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-700"
        }`}
      aria-label={listening ? "Stop recording" : "Start recording"}
      title={listening ? "Stop recording" : "Start recording"}
    >
      {listening ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  );
}
