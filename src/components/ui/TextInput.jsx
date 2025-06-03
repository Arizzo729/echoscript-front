// ✅ EchoScript.AI — Final Polished TextInput
import React from "react";
import { twMerge } from "tailwind-merge";

export default function TextInput({
  label,
  value,
  onChange,
  placeholder = "Enter text...",
  type = "text",
  className = "",
  id,
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={twMerge(
          "w-full px-3 py-2 text-sm rounded-lg border shadow-sm transition bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500",
          className
        )}
        {...props}
      />
    </div>
  );
}
