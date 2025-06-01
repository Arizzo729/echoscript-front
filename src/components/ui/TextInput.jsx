// ✅ TextInput.jsx
import React from "react";
import { twMerge } from "tailwind-merge";

export default function TextInput({ label, value, onChange, placeholder, className = "", ...props }) {
  return (
    <label className="block w-full text-sm font-medium text-zinc-700 dark:text-zinc-300">
      {label && <span className="block mb-1 font-semibold">{label}</span>}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={twMerge(
          "w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light",
          className
        )}
        {...props}
      />
    </label>
  );
}