// src/components/TranscriptExportPanel.jsx
import React, { useState } from "react";
import { FileDown, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export default function TranscriptExportPanel({ transcriptText, segments }) {
  const [open, setOpen] = useState(false);

  const handleDownload = async (type) => {
    const plainText = transcriptText || "No transcript available.";
    const baseFilename = `EchoScript_Transcript_${Date.now()}`;

    try {
      switch (type) {
        case "txt":
          const txtBlob = new Blob([plainText], { type: "text/plain" });
          saveAs(txtBlob, `${baseFilename}.txt`);
          break;

        case "json":
          const jsonBlob = new Blob(
            [JSON.stringify({ transcript: plainText, segments }, null, 2)],
            { type: "application/json" }
          );
          saveAs(jsonBlob, `${baseFilename}.json`);
          break;

        case "pdf":
          await generatePDF(plainText, baseFilename);
          break;

        case "docx":
          await generateDOCX(plainText, baseFilename);
          break;

        case "srt":
          if (!segments || segments.length === 0) {
            alert("No segments to export as SRT.");
            return;
          }
          const srt = segments
            .map((seg, i) => {
              const start = formatTime(seg.start);
              const end = formatTime(seg.end);
              return `${i + 1}\n${start} --> ${end}\n${seg.text.trim()}\n`;
            })
            .join("\n");
          const srtBlob = new Blob([srt], { type: "text/plain" });
          saveAs(srtBlob, `${baseFilename}.srt`);
          break;

        default:
          return;
      }
    } catch (error) {
      console.error(`Error exporting ${type}:`, error);
      alert(`Failed to export as ${type.toUpperCase()}. Please try again.`);
    }
  };

  const generatePDF = async (text, filename) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (2 * margin);
    
    doc.setFontSize(16);
    doc.text("EchoScript Transcript", margin, margin);
    
    doc.setFontSize(10);
    doc.text(new Date().toLocaleString(), margin, margin + 10);
    
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(text, maxWidth);
    let y = margin + 25;
    
    lines.forEach((line) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 7;
    });
    
    doc.save(`${filename}.pdf`);
  };

  const generateDOCX = async (text, filename) => {
    const paragraphs = text.split('\n').map(line => 
      new Paragraph({
        children: [new TextRun(line || " ")],
        spacing: { after: 120 }
      })
    );

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "EchoScript Transcript",
                bold: true,
                size: 32
              })
            ],
            spacing: { after: 300 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: new Date().toLocaleString(),
                italics: true,
                size: 20
              })
            ],
            spacing: { after: 400 }
          }),
          ...paragraphs
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename}.docx`);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.floor((seconds % 1) * 1000);
    
    const pad = (num) => String(num).padStart(2, '0');
    const pad3 = (num) => String(num).padStart(3, '0');
    
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad3(millis)}`;
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

