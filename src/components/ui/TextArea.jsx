// src/components/ui/TextArea.jsx
import React from "react";

export function TextArea({ label, placeholder, rows = 4, ...props }) {
  return (
    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
      {label && <span className="mb-1 block">{label}</span>}
      <textarea
        rows={rows}
        className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
        placeholder={placeholder}
        {...props}
      ></textarea>
    </label>
  );
}
