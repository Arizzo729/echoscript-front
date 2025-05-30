import React from "react";
import { motion } from "framer-motion";
import { BsMic, BsMicMute } from "react-icons/bs";
import useVoiceInput from "./useVoiceInput";

export default function VoiceInputButton({ onTranscript }) {
  const { listening, startListening, stopListening } = useVoiceInput({ onTranscript });

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={listening ? stopListening : startListening}
      className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all
        ${listening ? "bg-teal-500 text-white" : "bg-zinc-700 text-zinc-300"}`}
    >
      {listening ? <BsMic /> : <BsMicMute />}
    </motion.button>
  );
}
