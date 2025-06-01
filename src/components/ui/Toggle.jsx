// src/components/ui/Toggle.jsx

import React from "react";
import { Switch } from "@headlessui/react";
import { twMerge } from "tailwind-merge";

/**
 * EchoScript.AI Enhanced Toggle Switch
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
}) {
  const colors = {
    primary: "bg-teal-600 dark:bg-teal-500",
    danger: "bg-red-600 dark:bg-red-500",
    success: "bg-green-600 dark:bg-green-500",
  };

  return (
    <div className="flex items-center justify-between rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-800 shadow-sm">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 font-medium text-sm text-zinc-800 dark:text-white">
          {Icon && <Icon className="w-4 h-4 text-teal-500" />}
          {label}
        </div>
        {description && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {description}
          </span>
        )}
      </div>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={twMerge(
          "relative inline-flex h-6 w-11 items-center rounded-full transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2",
          enabled ? colors[variant] : "bg-zinc-300 dark:bg-zinc-600",
          className
        )}
      >
        <span
          className={twMerge(
            "inline-block h-4 w-4 transform bg-white rounded-full transition duration-300",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </Switch>
    </div>
  );
}
