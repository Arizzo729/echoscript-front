// Updated UploadPage.jsx with integrated LiveWaveform for recording
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import UploadAndTranscribe from "../components/UploadAndTranscribe";
import PaywallModal from "../components/PaywallModal";
import CountdownSelector from "../components/CountdownSelector";
import CountdownTimer from "../components/CountdownTimer";
import LiveWaveform from "../components/LiveWaveform";
import {
  Mic,
  MicOff,
  Timer,
  Download,
  Globe,
  FileText,
  Subtitles,
  Info,
  XCircle,
} from "lucide-react";

const ACCEPTED_AUDIO_FORMATS = ["mp3", "wav", "flac", "m4a", "aac", "ogg"];
const ACCEPTED_VIDEO_FORMATS = ["mp4", "mkv", "mov"];
const MAX_FILE_SIZE_MB = 500;

export default function UploadPage() {
  const { t } = useTranslation();

  const [isRecording, setIsRecording] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const [transcript, setTranscript] = useState("");
  const [translated, setTranslated] = useState("");
  const [enableTranslation, setEnableTranslation] = useState(false);
  const [file, setFile] = useState(null);
  const [paywallInfo, setPaywallInfo] = useState(null);

  const handleTranscript = useCallback(
    (response) => {
      if (response?.status === 403 && response?.detail) {
        setPaywallInfo(response.detail);
        setTranscript("");
        setTranslated("");
        return;
      }
      setPaywallInfo(null);
      if (response?.transcript) {
        setTranscript(response.transcript);
        setTranslated(
          enableTranslation
            ? `🌍 [${t("Translated")}]: ${response.transcript}`
            : ""
        );
      }
    },
    [enableTranslation, t]
  );

  const handleDownload = useCallback((text, filename) => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    const uploaded = e.dataTransfer.files[0];
    if (uploaded) handleFileUpload(uploaded);
  };

  const handleFileUpload = (uploaded) => {
    const ext = uploaded.name.split(".").pop().toLowerCase();
    const isValid =
      ACCEPTED_AUDIO_FORMATS.includes(ext) ||
      ACCEPTED_VIDEO_FORMATS.includes(ext);
    const isTooLarge = uploaded.size > MAX_FILE_SIZE_MB * 1024 * 1024;

    if (!isValid || isTooLarge) {
      alert(
        `${t("Invalid file or too large")} (max ${MAX_FILE_SIZE_MB}MB). ${t(
          "Accepted formats"
        )}: ${[...ACCEPTED_AUDIO_FORMATS, ...ACCEPTED_VIDEO_FORMATS]
          .map((f) => f.toUpperCase())
          .join(", ")}.`
      );
      return;
    }

    setFile(uploaded);
    setTranscript("");
    setTranslated("");
  };

  const clearFile = () => setFile(null);
  const closePaywallModal = () => setPaywallInfo(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen px-4 py-10 md:px-10 md:py-16 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white"
      >
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">
              {t("Upload or Record Audio/Video")}
            </h1>
            <p className="text-zinc-400 text-sm md:text-base">
              {t("Supports")} MP3, WAV, MP4, MKV, MOV, FLAC — {t("click or drag to upload, or record live.")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-teal-400" />
              <CountdownSelector value={countdown} onChange={setCountdown} />
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-yellow-400" />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox accent-teal-600"
                  checked={enableTranslation}
                  onChange={() => setEnableTranslation(!enableTranslation)}
                  aria-label={t("Enable translation")}
                />
                {t("Enable Translation")}
              </label>
            </div>
            {file && (
              <button
                onClick={clearFile}
                className="flex items-center gap-2 text-sm text-red-400 hover:underline"
              >
                <XCircle className="w-5 h-5" /> {t("Clear File")}
              </button>
            )}
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl space-y-6">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("hiddenFileInput")?.click()}
              className="p-6 border-2 border-dashed border-teal-600 bg-zinc-800 rounded-lg text-sm text-zinc-300 text-center cursor-pointer hover:bg-zinc-700 transition"
            >
              {file ? file.name : t("Click or drag your audio/video file here")}
              <input
                id="hiddenFileInput"
                type="file"
                accept={ACCEPTED_AUDIO_FORMATS.concat(ACCEPTED_VIDEO_FORMATS).map((f) => `.${f}`).join(",")}
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
            </div>

            {showCountdown ? (
              <CountdownTimer
                seconds={countdown}
                onComplete={() => {
                  setShowCountdown(false);
                  setIsRecording(true);
                }}
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => {
                    if (isRecording) {
                      setIsRecording(false);
                    } else {
                      countdown > 0 ? setShowCountdown(true) : setIsRecording(true);
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  {isRecording ? t("Stop") : t("Record")}
                </button>
                <span className="text-sm text-zinc-400">
                  {isRecording ? t("Recording...") : t("Ready to record")}
                </span>
              </div>
            )}

            {isRecording && (
              <div className="mt-6">
                <LiveWaveform sourceType="mic" />
              </div>
            )}

            {file && (
              <UploadAndTranscribe
                onRecordingStart={() => setIsRecording(true)}
                onRecordingEnd={() => setIsRecording(false)}
                countdown={countdown}
                onTranscriptComplete={handleTranscript}
                fileInput={file}
                translate={enableTranslation}
              />
            )}
          </div>

          {!paywallInfo && transcript && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 space-y-3">
                <h3 className="font-semibold text-lg text-white flex gap-2 items-center">
                  <FileText className="w-5 h-5 text-teal-400" />
                  {t("Transcript")}
                </h3>
                <pre className="text-zinc-300 text-sm whitespace-pre-wrap max-h-64 overflow-auto">
                  {transcript}
                </pre>
                <button
                  onClick={() => handleDownload(transcript, "transcript.txt")}
                  className="text-sm text-teal-400 flex items-center gap-2 hover:underline"
                >
                  <Download className="w-4 h-4" />
                  {t("Download Transcript")}
                </button>
              </div>
              {enableTranslation && translated && (
                <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 space-y-3">
                  <h3 className="font-semibold text-lg text-white flex gap-2 items-center">
                    <Subtitles className="w-5 h-5 text-yellow-400" />
                    {t("Translated Output")}
                  </h3>
                  <pre className="text-zinc-300 text-sm whitespace-pre-wrap max-h-64 overflow-auto">
                    {translated}
                  </pre>
                  <button
                    onClick={() => handleDownload(translated, "translated.txt")}
                    className="text-sm text-yellow-300 flex items-center gap-2 hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    {t("Download Translation")}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 text-sm text-zinc-400 space-y-3 mt-8">
            <p className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-teal-400" />
              {t("Record or upload your voice or video — EchoScript will auto-clean and transcribe it.")}
            </p>
            <p className="flex items-center gap-2">
              <Info className="w-4 h-4 text-zinc-400" />
              {t(`Files up to ${MAX_FILE_SIZE_MB}MB are supported.`)}
            </p>
          </div>
        </div>
      </motion.div>

      {paywallInfo && <PaywallModal info={paywallInfo} onClose={closePaywallModal} />}
    </>
  );
}