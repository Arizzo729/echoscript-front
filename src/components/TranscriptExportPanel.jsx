// src/components/TranscriptExportPanel.jsx
import React, { useState } from "react";
import { FileDown, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TranscriptExportPanel({ transcriptText, segments }) {
  const [open, setOpen] = useState(false);

  const handleDownload = (type) => {
    let blob, filename;

    const plainText = transcriptText || "No transcript available.";
    const baseFilename = `EchoScript_Transcript_${Date.now()}`;

    switch (type) {
      case "txt":
        blob = new Blob([plainText], { type: "text/plain" });
        filename = `${baseFilename}.txt`;
        break;

      case "json":
        blob = new Blob(
          [JSON.stringify({ transcript: plainText, segments }, null, 2)],
          { type: "application/json" }
        );
        filename = `${baseFilename}.json`;
        break;

      case "pdf":
        const html = `<html><body><pre>${plainText}</pre></body></html>`;
        blob = new Blob([html], { type: "application/pdf" });
        filename = `${baseFilename}.pdf`;
        break;

      case "docx":
        blob = new Blob(
          [
            `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
             <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
               <w:body><w:p><w:r><w:t>${plainText}</w:t></w:r></w:p></w:body>
             </w:document>`
          ],
          { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
        );
        filename = `${baseFilename}.docx`;
        break;

      case "srt":
        if (!segments || segments.length === 0) return alert("No segments to export as SRT.");
        const srt = segments
          .map((seg, i) => {
            const start = formatTime(seg.start);
            const end = formatTime(seg.end);
            return `${i + 1}\n${start} --> ${end}\n${seg.text.trim()}\n`;
          })
          .join("\n");
        blob = new Blob([srt], { type: "text/plain" });
        filename = `${baseFilename}.srt`;
        break;

      default:
        return;
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const formatTime = (seconds) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8).replace(".", ",");
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold flex items-center gap-2 shadow transition-all"
      >
        <FileDown size={18} />
        Export
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-50 overflow-hidden"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {["txt", "pdf", "docx", "srt", "json"].map((type) => (
              <li
                key={type}
                onClick={() => handleDownload(type)}
                className="px-4 py-2 hover:bg-teal-600 text-zinc-200 hover:text-white cursor-pointer text-sm transition"
              >
                .{type.toUpperCase()}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

