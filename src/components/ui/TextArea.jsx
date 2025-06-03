// ✅ EchoScript.AI — Final Polished TextArea
import React from "react";

export function TextArea({
  label,
  placeholder = "Enter text...",
  rows = 4,
  className = "",
  ...props
}) {
  const id = props.id || `textarea-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 ${className}`}
        {...props}
      />
    </div>
  );
}
