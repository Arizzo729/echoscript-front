import React from "react";
import { twMerge } from "tailwind-merge";

/**
 * Unified Button component
 * Props:
 * - variant: "primary" | "secondary" | "ghost" | "danger"
 * - size: "sm" | "md" | "lg"
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg";

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  const variants = {
    primary:
      "bg-teal-600 text-white hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 focus-visible:ring-teal-400",
    secondary:
      "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 focus-visible:ring-zinc-500",
    ghost:
      "bg-transparent text-teal-600 hover:bg-teal-100 dark:text-teal-400 dark:hover:bg-teal-500/10 focus-visible:ring-teal-400",
    danger:
      "bg-red-600 text-white hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500 focus-visible:ring-red-400",
  };

  return (
    <button
      className={twMerge(
        base,
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
