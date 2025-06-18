import React from "react";
import { motion } from "framer-motion";
import UploadAndTranscribe from "../components/UploadandTranscribe";
import { Languages, Mic, FileAudio2, Globe2 } from "lucide-react";
import LanguageDropdown from "../components/LanguageDropdown";

export default function UploadPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen px-6 py-16 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white"
    >
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Upload & Transcribe Audio
          </h1>
          <p className="text-zinc-400 text-sm">
            Accepts all common audio formats — MP3, WAV, FLAC, OGG, M4A, AAC and more.
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-teal-400" />
            <span className="text-sm text-zinc-300">Transcription Language</span>
          </div>
          <LanguageDropdown placeholder="Select Language" type="transcription" />

          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-zinc-300">Translate To</span>
          </div>
          <LanguageDropdown placeholder="Optional Translation" type="translation" />
        </div>

        {/* Upload Widget */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <FileAudio2 className="w-6 h-6 text-teal-500" />
            <h2 className="text-lg font-semibold tracking-wide">Audio Upload</h2>
          </div>
          <UploadAndTranscribe />
        </div>

        {/* Tips or Future Features */}
        <div className="mt-10 bg-zinc-800 border border-zinc-700 rounded-xl p-5 text-sm text-zinc-400 space-y-2">
          <p><Mic className="inline w-4 h-4 mr-1 text-teal-400" /> Coming soon: microphone recording directly in browser</p>
          <p><Languages className="inline w-4 h-4 mr-1 text-teal-400" /> Auto language detection & subtitle styling options in the works!</p>
        </div>
      </div>
    </motion.div>
  );
}