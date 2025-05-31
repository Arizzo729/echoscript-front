import React from "react";
import { twMerge } from "tailwind-merge";

export default function IconButton({ icon, label, size = 'md', className = "", ...props }) {
  const sizes = {
    sm: "p-2 text-sm",
    md: "p-2.5 text-base",
    lg: "p-3 text-lg",
  };

  return (
    <button
      className={twMerge(
        `inline-flex items-center justify-center rounded-full transition-all duration-300 ease-out
         bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700
         text-teal-600 dark:text-teal-400 shadow-sm hover:shadow-md
         focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2`,
        sizes[size],
        className
      )}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}