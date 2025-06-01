// ✅ SwitchToggle.jsx — Clean, consistent, and integrated with EchoScript UI
import React from "react";
import { Switch } from "@headlessui/react";
import { twMerge } from "tailwind-merge";

/**
 * Reusable SwitchToggle
 * - Applies EchoScript teal branding
 * - Smooth, modern toggle
 */
export default function SwitchToggle({ enabled, onChange, label }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {label}
      </span>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={twMerge(
          "relative inline-flex h-6 w-11 items-center rounded-full shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400",
          enabled ? "bg-teal-600 dark:bg-teal-500" : "bg-zinc-300 dark:bg-zinc-600"
        )}
      >
        <span
          className={twMerge(
            "inline-block h-4 w-4 transform rounded-full bg-white transition",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </Switch>
    </div>
  );
}
