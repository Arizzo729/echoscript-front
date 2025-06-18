// src/pages/Upload.jsx — EchoScript.AI Advanced Upload Page

import React, { useState } from "react";
import { motion } from "framer-motion";
import UploadAndTranscribe from "../components/UploadandTranscribe";
import { Languages, Mic, FileAudio2, Timer } from "lucide-react";
import LanguageDropdown from "../components/LanguageDropdown";
import CountdownSelector from "../components/CountdownSelector";
import WaveformVisualizer from "../components/WaveformVisualizer";

export default function UploadPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen px-6 py-16 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Upload & Transcribe Audio
          </h1>
          <p className="text-zinc-400 text-sm">
            Supports MP3, WAV, FLAC, M4A, AAC, OGG — drag & drop or record directly.
          </p>
        </div>

        {/* Language & Countdown Controls */}
        <div className="flex flex-wrap justify-center items-center gap-6">
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-teal-400" />
            <LanguageDropdown />
          </div>
          <div className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-teal-400" />
            <CountdownSelector value={countdown} onChange={setCountdown} />
          </div>
        </div>

        {/* Waveform + Upload Box */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <FileAudio2 className="w-6 h-6 text-teal-500" />
            <h2 className="text-lg font-semibold tracking-wide">Audio Upload</h2>
          </div>

          {/* Waveform Preview (optional) */}
          {isRecording && (
            <div className="mb-4">
              <WaveformVisualizer />
            </div>
          )}

          {/* Upload or Transcribe */}
          <UploadAndTranscribe
            onRecordingStart={() => setIsRecording(true)}
            onRecordingEnd={() => setIsRecording(false)}
            countdown={countdown}
          />
        </div>

        {/* Footer Info */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 text-sm text-zinc-400 space-y-2">
          <p>
            <Mic className="inline w-4 h-4 mr-1 text-teal-400" />
            Voice recording directly in-browser is supported with visual feedback.
          </p>
          <p>
            <Languages className="inline w-4 h-4 mr-1 text-teal-400" />
            Real-time translation and subtitle formatting coming soon.
          </p>
        </div>
      </div>
    </motion.div>
  );
}


