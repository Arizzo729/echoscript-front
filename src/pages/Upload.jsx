// src/pages/Upload.jsx

import React from "react";
import UploadAndTranscribe from "../components/UploadandTranscribe";

export default function UploadPage() {
  return (
    <div className="min-h-screen px-4 py-10 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-zinc-800 dark:text-zinc-200">
          Upload & Transcribe Audio
        </h1>
        <UploadAndTranscribe />
      </div>
    </div>
  );
}
