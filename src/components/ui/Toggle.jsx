// ✅ EchoScript.AI — Polished Enhanced Toggle with Audio
import React from "react";
import { Switch } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { useSound } from "../../context/SoundContext";

/**
 * Toggle switch with icon, label, and description
 * Variants: "primary", "danger", "success"
 */
export default function Toggle({
  enabled,
  onChange,
  label,
  description,
  Icon,
  variant = "primary",
  className = "",
  disableSound = false,
}) {
  const { playClick, isMuted } = useSound(); // ✅ Correct sound function

  const handleToggle = (val) => {
    if (!disableSound && !isMuted) playClick(); // ✅ Proper audio
    onChange(val);
  };

  const colors = {
    primary: "bg-teal-600 dark:bg-teal-500",
    danger: "bg-red-600 dark:bg-red-500",
    success: "bg-green-600 dark:bg-green-500",
  };

  return (
    <div className="flex items-center justify-between rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-800 shadow-sm transition-colors">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-white">
          {Icon && <Icon className="w-4 h-4 text-teal-500 shrink-0" />}
          {label}
        </div>
        {description && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
            {description}
          </span>
        )}
      </div>

      <Switch
        checked={enabled}
        onChange={handleToggle}
        className={twMerge(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-1 dark:focus:ring-offset-zinc-900",
          enabled ? colors[variant] : "bg-zinc-300 dark:bg-zinc-600",
          className
        )}
      >
        <span
          className={twMerge(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-out",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </Switch>
    </div>
  );
}

