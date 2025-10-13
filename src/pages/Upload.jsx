import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import UploadAndTranscribe from "../components/UploadAndTranscribe";
import PaywallModal from "../components/PaywallModal";
import CountdownSelector from "../components/CountdownSelector";
import LiveWaveform from "../components/LiveWaveform";
import TranscriptEditor from "../components/TranscriptEditor";
import TranscriptExportPanel from "../components/TranscriptExportPanel";

import {
  Mic,
  MicOff,
  Timer,
  Download,
  Globe,
  FileText,
  Subtitles,
  Info,
  Upload as UploadIcon,
  StopCircle,
  Play,
  XCircle,
} from "lucide-react";

const ACCEPTED_AUDIO_FORMATS = ["mp3", "wav", "flac", "m4a", "aac", "ogg"];
const ACCEPTED_VIDEO_FORMATS = ["mp4", "mkv", "mov"];
const MAX_FILE_SIZE_MB = 500;

export default function UploadPage() {
  const { t } = useTranslation();

  // UI state
  const [countdown, setCountdown] = useState(3);
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [translated, setTranslated] = useState("");
  const [translateEnabled, setTranslateEnabled] = useState(false);
  const [paywall, setPaywall] = useState(null);
  const [note, setNote] = useState(null);

  // Recorder hook
  const { recording, permissionError, start, stop } = useSimpleRecorder();

  // Restore draft for a specific file
  useEffect(() => {
    if (!file) return;
    const key = `draft_${file.name}`;
    try {
      const draft = localStorage.getItem(key);
      if (draft) {
        const d = JSON.parse(draft);
        setTranscript(d.transcript || "");
        setTranslated(d.translated || "");
        setNote(t("Loaded previous draft."));
      }
    } catch {
      /* ignore */
    }
  }, [file, t]);

  // Auto-clear notes
  useEffect(() => {
    if (!note) return;
    const id = setTimeout(() => setNote(null), 3000);
    return () => clearTimeout(id);
  }, [note]);

  const handleFile = useCallback(
    (uploaded) => {
      if (!uploaded) return;
      const ext = uploaded.name.split(".").pop()?.toLowerCase() || "";
      const valid = AUDIO.includes(ext) || VIDEO.includes(ext);
      const tooBig = uploaded.size > MAX_MB * 1024 * 1024;

      if (!valid || tooBig) {
        alert(
          `${t("Invalid file or too large")} (max ${MAX_MB}MB). ${t("Accepted formats")}: ${[
            ...AUDIO,
            ...VIDEO,
          ]
            .map((f) => f.toUpperCase())
            .join(", ")}.`
        );
        return;
      }
      setFile(uploaded);
      setTranscript("");
      setTranslated("");
    },
    [t]
  );

  const onInputChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleTranscript = useCallback(
    (res) => {
      if (!res) return;
      if (res?.status === 403 && res.detail) {
        setPaywall(res.detail);
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
