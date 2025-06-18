// src/pages/Upload.jsx — EchoScript.AI Advanced Upload Page

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import UploadAndTranscribe from "../components/UploadandTranscribe";
import LanguageDropdown from "../components/LanguageDropdown";
import CountdownSelector from "../components/CountdownSelector";
import WaveformVisualizer from "../components/WaveformVisualizer";
import {
  Languages,
  Mic,
  FileAudio2,
  Timer,
  Download,
  Globe,
  FileText,
  Subtitles,
  Info,
} from "lucide-react";

export default function UploadPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [transcript, setTranscript] = useState("");
  const [translated, setTranslated] = useState("");
  const [enableTranslation, setEnableTranslation] = useState(false);

  const handleTranscript = useCallback((text) => {
    setTranscript(text);
    if (enableTranslation) {
      setTranslated(`🌍 [Translated] ${text}`);
    }
  }, [enableTranslation]);

  const handleDownload = useCallback((text, filename) => {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }, []);

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
            🎙️ Upload & Transcribe Audio
          </h1>
          <p className="text-zinc-400 text-sm">
            Supports MP3, WAV, FLAC, M4A, AAC, OGG — drag & drop or record directly with real-time waveform visuals.
          </p>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-teal-400" />
            <LanguageDropdown />
          </div>
          <div className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-teal-400" />
            <CountdownSelector value={countdown} onChange={setCountdown} />
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-yellow-400" />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="form-checkbox accent-teal-600"
                checked={enableTranslation}
                onChange={() => setEnableTranslation(!enableTranslation)}
              />
              Enable Translation
            </label>
          </div>
        </div>

        {/* Recorder */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <FileAudio2 className="w-6 h-6 text-teal-500" />
            <h2 className="text-lg font-semibold tracking-wide">Upload or Record</h2>
          </div>

          {isRecording && (
            <div className="mb-4">
              <WaveformVisualizer />
            </div>
          )}

          <UploadAndTranscribe
            onRecordingStart={() => setIsRecording(true)}
            onRecordingEnd={() => setIsRecording(false)}
            countdown={countdown}
            onTranscriptComplete={handleTranscript}
          />
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 space-y-3">
              <h3 className="font-semibold text-lg text-white flex gap-2 items-center">
                <FileText className="w-5 h-5 text-teal-400" /> Transcript
              </h3>
              <pre className="text-zinc-300 text-sm whitespace-pre-wrap max-h-64 overflow-auto">{transcript}</pre>
              <button
                onClick={() => handleDownload(transcript, "transcript.txt")}
                className="text-sm text-teal-400 flex items-center gap-2 hover:underline"
              >
                <Download className="w-4 h-4" /> Download Transcript
              </button>
            </div>

            {enableTranslation && translated && (
              <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 space-y-3">
                <h3 className="font-semibold text-lg text-white flex gap-2 items-center">
                  <Subtitles className="w-5 h-5 text-yellow-400" /> Translated Output
                </h3>
                <pre className="text-zinc-300 text-sm whitespace-pre-wrap max-h-64 overflow-auto">{translated}</pre>
                <button
                  onClick={() => handleDownload(translated, "translated_transcript.txt")}
                  className="text-sm text-yellow-300 flex items-center gap-2 hover:underline"
                >
                  <Download className="w-4 h-4" /> Download Translation
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 text-sm text-zinc-400 space-y-3">
          <p>
            <Mic className="inline w-4 h-4 mr-1 text-teal-400" /> Voice recording is browser-based with ambient waveform visuals.
          </p>
          <p>
            <Languages className="inline w-4 h-4 mr-1 text-teal-400" /> Over 25 languages supported. Auto-detection and translation coming soon.
          </p>
          <p>
            <Info className="inline w-4 h-4 mr-1 text-blue-400" /> Transcripts and translations are downloadable in plain text.
          </p>
        </div>
      </div>
    </motion.div>
  );
}




