import React from "react";
import { ChevronDown } from "lucide-react";

export function SelectDropdown({
  label,
  options = [],
  placeholder = "Select an option",
  value,
  onChange,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
      {label && <span className="mb-1 block">{label}</span>}
      <div className="relative">
        <select
          className={`w-full appearance-none rounded-lg border px-3 py-2 text-sm pr-10 shadow-sm transition-all
            focus:outline-none focus:ring-2 focus:ring-teal-500
            dark:bg-zinc-800 dark:border-zinc-700 dark:text-white ${className}`}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-label={label}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      </div>
    </label>
  );
}
