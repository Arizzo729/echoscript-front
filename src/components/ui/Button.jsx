import React from "react";
import { twMerge } from "tailwind-merge";

/**
 * EchoScript Button — Fully styled, animated, brand-aligned
 *
 * Props:
 * - variant: "primary" | "secondary" | "ghost" | "danger"
 * - size: "xs" | "sm" | "md" | "lg"
 * - loading: boolean (optional)
 * - icon: ReactNode (optional)
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  ...props
}) {
  const base =
    "relative inline-flex items-center justify-center font-medium rounded-md select-none transition-all duration-300 ease-out group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97] overflow-hidden";

  const sizes = {
    xs: "px-2.5 py-1 text-xs gap-1",
    sm: "px-3 py-1.5 text-sm gap-2",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-3",
  };

  const variants = {
    primary: `
      bg-gradient-to-r from-teal-500 to-teal-600
      text-white shadow-md
      hover:from-teal-600 hover:to-teal-700
      dark:from-teal-400 dark:to-teal-500
      dark:hover:from-teal-500 dark:hover:to-teal-600
      focus-visible:ring-teal-400
      before:absolute before:inset-0 before:bg-white/10 before:opacity-0 group-hover:before:opacity-10 before:transition-opacity
    `,
    secondary: `
      bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-white
      hover:bg-zinc-200 dark:hover:bg-zinc-600
      focus-visible:ring-zinc-400
    `,
    ghost: `
      bg-transparent text-teal-600 dark:text-teal-400
      hover:bg-teal-100 dark:hover:bg-teal-600/10
      focus-visible:ring-teal-300
    `,
    danger: `
      bg-red-600 text-white hover:bg-red-500
      dark:bg-red-500 dark:hover:bg-red-400
      focus-visible:ring-red-400
    `,
  };

  return (
    <button
      disabled={loading || props.disabled}
      className={twMerge(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {/* Loading shimmer effect */}
      {loading && (
        <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 animate-pulse-slow z-0 rounded-md" />
      )}

      {/* Content with optional icon */}
      <span className="relative z-10 inline-flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </button>
  );
}
