
// src/components/ui/SelectDropdown.jsx
import React from "react";

export function SelectDropdown({ label, options = [], ...props }) {
  return (
    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
      {label && <span className="mb-1 block">{label}</span>}
      <select
        className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
