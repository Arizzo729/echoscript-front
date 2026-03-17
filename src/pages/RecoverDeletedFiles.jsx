import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function RecoverDeletedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [deletedItems, setDeletedItems] = useState(() => {
    const raw = localStorage.getItem("deletedHistory");
    return raw ? JSON.parse(raw) : [];
  });

  const handleRecover = (id) => {
    const itemToRecover = deletedItems.find(item => item.id === id);
    if (itemToRecover) {
      const history = JSON.parse(localStorage.getItem("transcriptHistory") || "[]");
      localStorage.setItem("transcriptHistory", JSON.stringify([itemToRecover, ...history]));
      
      const newDeleted = deletedItems.filter(item => item.id !== id);
      setDeletedItems(newDeleted);
      localStorage.setItem("deletedHistory", JSON.stringify(newDeleted));
    }
  };

  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-10 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">{t("history.recover_deleted_files")}</h1>

      {deletedItems.length === 0 ? (
        <p className="text-zinc-400 text-sm">{t("history.no_deleted_items")}</p>
      ) : (
        <div className="grid gap-6">
          {deletedItems.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold mb-1">{item.label}</h2>
                  <p className="text-sm text-zinc-400 mb-2">{item.date}</p>
                  <p className="text-sm text-zinc-300 max-h-24 overflow-hidden whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <button
                    onClick={() => handleRecover(item.id)}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t("history.recover")}
                  </button>
                  <button
                    onClick={() => handleDownload(item.content, `${item.label}.txt`)}
                    className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    {t("history.download")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => navigate("/history")}
          className="text-sm bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> {t("checkout.back")}
        </button>
      </div>
    </motion.div>
  );
}