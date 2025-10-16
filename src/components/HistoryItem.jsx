// src/components/history/HistoryItem.jsx
import React from "react";
import { Download, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HistoryItem({
  item,
  expanded,
  onToggleExpand,
  selected,
  onSelect,
  onDownload,
  onCopy,
  onDelete,
}) {
  const { t } = useTranslation();
  return (
    <div
      className={`bg-zinc-900 border border-zinc-700 rounded-xl p-5 shadow-md flex flex-col md:flex-row gap-4 transition`}
    >
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(item.id)}
          className="mt-1 mr-3 accent-teal-500"
          aria-label={t("Select entry")}
        />
      </div>
      <div className="flex-1">
        <div
          className="cursor-pointer"
          onClick={() => onToggleExpand(item.id)}
        >
          <h2 className="text-lg font-semibold mb-1">{item.label}</h2>
          <p className="text-sm text-zinc-400 mb-2">{item.date}</p>
        </div>
        <p
          className={`text-sm text-zinc-300 whitespace-pre-wrap overflow-hidden transition-max-h ${
            expanded ? "max-h-screen" : "max-h-20"
          }`}
        >
          {item.preview}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => onDownload(item.preview, item.label)}
          className="flex items-center gap-1 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs rounded transition"
        >
          <Download className="w-4 h-4" />
          {t("Export")}
        </button>
        <button
          onClick={() => onCopy(item.preview)}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition"
        >
          {t("Save")}
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition"
        >
          <Trash2 className="w-4 h-4" />
          {t("Delete")}
        </button>
      </div>
    </div>
  );
}
