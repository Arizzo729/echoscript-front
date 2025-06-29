import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Trash2, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]); // Starts empty
  const [usedHistory, setUsedHistory] = useState(0); // Starts at 0
  const historyLimit = 30;

  const handleDelete = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    setUsedHistory((prev) => Math.max(0, prev - 1));
  };

  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const percentUsed = Math.min((usedHistory / historyLimit) * 100, 100);

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-10 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">{t("Your History")}</h1>

      {history.length === 0 ? (
        <p className="text-zinc-400 text-sm">{t("No past sessions found.")}</p>
      ) : (
        <div className="grid gap-6">
          {history.map((h) => (
            <div
              key={h.id}
              className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold mb-1">{h.label}</h2>
                  <p className="text-sm text-zinc-400 mb-2">{h.date}</p>
                  <p className="text-sm text-zinc-300 max-h-20 overflow-hidden whitespace-pre-wrap">
                    {h.preview}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 ml-4">
                  <button
                    onClick={() => handleDownload(h.preview, `${h.label}.txt`)}
                    className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    {t("Download")}
                  </button>
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t("Delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-zinc-400">
            {usedHistory} / {historyLimit} history items used
          </p>
          <button
            onClick={() => navigate("/purchase")}
            className="text-sm bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
          >
            {t("Upgrade Plan")}
          </button>
        </div>
        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full"
            style={{ width: `${percentUsed}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${percentUsed}%` }}
            transition={{ duration: 0.7 }}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/recover")}
          className="bg-zinc-800 hover:bg-zinc-700 border border-blue-500 text-blue-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4" />
          {t("Recover Deleted Files")}
        </button>
      </div>
    </motion.div>
  );
}

