import React from "react";
import { twMerge } from "tailwind-merge";

/**
 * EchoScript.AI Smart Button
 * Variants: "primary", "secondary", "ghost", "danger"
 * Sizes: "xs", "sm", "md", "lg"
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
    "relative inline-flex items-center justify-center font-medium select-none rounded-xl transition-all duration-300 ease-out group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97] overflow-hidden";

  const sizes = {
    xs: "px-2 py-1 text-xs gap-1",
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-5 py-2.5 text-lg gap-2.5",
  };

  const variants = {
    primary: `
      bg-teal-600 text-white shadow hover:bg-teal-700
      dark:bg-teal-500 dark:hover:bg-teal-600
      focus-visible:ring-teal-400
    `,
    secondary: `
      bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-white
      hover:bg-zinc-300 dark:hover:bg-zinc-600
      focus-visible:ring-zinc-500
    `,
    ghost: `
      bg-transparent text-teal-500 dark:text-teal-400
      hover:bg-teal-100 dark:hover:bg-teal-600/10
      focus-visible:ring-teal-400
    `,
    danger: `
      bg-red-500 text-white hover:bg-red-600
      dark:bg-red-600 dark:hover:bg-red-700
      focus-visible:ring-red-400
    `,
  };

  return (
    <button
      disabled={loading || props.disabled}
      className={twMerge(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {/* Optional shimmer loading effect */}
      {loading && (
        <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 animate-pulse-slow z-0 rounded-xl" />
      )}

      <span className="relative z-10 inline-flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </button>
  );
}

