// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/toast/ToastProvider";
import HistoryItem from "../components/HistoryItem";

const HISTORY_KEY = "transcriptHistory";
const ITEMS_PER_PAGE = 8;

const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
};
const saveHistory = (h) => localStorage.setItem(HISTORY_KEY, JSON.stringify(h));

export default function HistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  const [history, setHistory] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => setHistory(loadHistory()), []);
  const updateHistory = (h) => { setHistory(h); saveHistory(h); };

  const filtered = history.filter((h) =>
    h.label.toLowerCase().includes(search.toLowerCase()) ||
    h.preview.toLowerCase().includes(search.toLowerCase())
  );
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const currentItems = filtered.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const selectAll = () => setSelectedIds(new Set(history.map((h) => h.id)));
  const deselectAll = () => setSelectedIds(new Set());

  const handleDelete = (id) => { updateHistory(history.filter((h) => h.id !== id)); toast({ message: t("Deleted"), type: "info" }); };
  const handleDownload = (text, label) => {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${label}.txt`;
    link.click();
  };
  const handleCopy = async (text) => { await navigator.clipboard.writeText(text); toast({ message: t("Saved to clipboard"), type: "success" }); };

  const exportSelected = () => {
    const items = history.filter((h) => selectedIds.has(h.id));
    const combined = items.map((i) => `=== ${i.label} ===\n${i.preview}`).join("\n\n");
    const blob = new Blob([combined], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "export_selected.txt";
    link.click();
  };
  const saveSelected = async () => {
    const items = history.filter((h) => selectedIds.has(h.id));
    const combined = items.map((i) => `=== ${i.label} ===\n${i.preview}`).join("\n\n");
    await navigator.clipboard.writeText(combined);
    toast({ message: t("Selected saved to clipboard"), type: "success" });
  };
  const handleDeleteSelected = () => {
    const next = history.filter((h) => !selectedIds.has(h.id));
    updateHistory(next);
    deselectAll();
    toast({ message: t("Selected entries deleted"), type: "error" });
  };
  const exportAll = () => {
    const combined = history.map((i) => `=== ${i.label} ===\n${i.preview}`).join("\n\n");
    const blob = new Blob([combined], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "export_all.txt";
    link.click();
  };
  const saveAll = async () => {
    const combined = history.map((i) => `=== ${i.label} ===\n${i.preview}`).join("\n\n");
    await navigator.clipboard.writeText(combined);
    toast({ message: t("All items saved to clipboard"), type: "success" });
  };
  const handleClearAll = () => {
    if (window.confirm(t("Clear all history?"))) {
      updateHistory([]);
      deselectAll();
      toast({ message: t("History cleared"), type: "success" });
    }
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-10 text-white space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">{t("Your History")}</h1>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder={t("Search history...")}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-teal-500"
          />
          <button onClick={selectAll} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm">{t("Select All")}</button>
          <button onClick={deselectAll} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm">{t("Deselect All")}</button>
          <button onClick={exportSelected} disabled={!selectedIds.size} className="px-3 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm disabled:opacity-50">{t("Export Selected")}</button>
          <button onClick={saveSelected} disabled={!selectedIds.size} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm disabled:opacity-50">{t("Save Selected")}</button>
          <button onClick={handleDeleteSelected} disabled={!selectedIds.size} className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm disabled:opacity-50">{t("Clear Selected")}</button>
          <button onClick={exportAll} disabled={!history.length} className="px-3 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm disabled:opacity-50">{t("Export All")}</button>
          <button onClick={saveAll} disabled={!history.length} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm disabled:opacity-50">{t("Save All")}</button>
          <button onClick={handleClearAll} disabled={!history.length} className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm disabled:opacity-50">{t("Clear All")}</button>
        </div>
      </div>

      {currentItems.length === 0 ? (
        <p className="text-zinc-400">{t("No entries found.")}</p>
      ) : (
        <div className="space-y-4">
          {currentItems.map((h) => (
            <HistoryItem
              key={h.id}
              item={h}
              expanded={expandedId === h.id}
              onToggleExpand={setExpandedId}
              selected={selectedIds.has(h.id)}
              onSelect={toggleSelect}
              onDownload={handleDownload}
              onCopy={handleCopy}
              onDelete={handleDelete}
            />
          ))}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page===1} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-50">{t("Prev")}</button>
            <span className="text-sm">{page} / {pageCount}</span>
            <button onClick={() => setPage((p) => Math.min(pageCount, p+1))} disabled={page===pageCount} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-50">{t("Next")}</button>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/recover")}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-blue-500 text-blue-300 hover:text-white rounded-lg text-sm transition"
        >
          <RotateCcw className="w-4 h-4" />
          {t("Recover Deleted Files")}
        </button>
      </div>
    </motion.div>
  );
}