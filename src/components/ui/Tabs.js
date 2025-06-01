// src/components/ui/Tabs.jsx

import React from "react";
import { twMerge } from "tailwind-merge";

/**
 * EchoScript.AI Smart Tabs
 * Usage:
 * <Tabs tabs={...} activeTab={...} onTabChange={...} />
 */
export default function Tabs({
  tabs = [],
  activeTab,
  onTabChange,
  direction = "horizontal", // or "vertical"
  className = "",
}) {
  return (
    <div
      className={twMerge(
        "flex",
        direction === "vertical" ? "flex-col gap-2" : "flex-row gap-4",
        className
      )}
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = id === activeTab;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={twMerge(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition duration-300 ease-in-out",
              isActive
                ? "text-teal-600 bg-teal-50 dark:text-teal-300 dark:bg-teal-800/20 shadow-primary-glow"
                : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
