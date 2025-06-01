// ✅ EchoScript.AI: BubbleButton — Comfort + Joy UX
import React from "react";
import { twMerge } from "tailwind-merge";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  ...props
}) {
  const base = `
    relative inline-flex items-center justify-center font-semibold
    rounded-full transition-all duration-300 ease-in-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    active:scale-95 hover:scale-[1.025] transform-gpu
    overflow-hidden shadow-sm group
  `;

  const sizes = {
    xs: "px-3 py-1 text-xs gap-1",
    sm: "px-3.5 py-1.5 text-sm gap-1.5",
    md: "px-4.5 py-2 text-base gap-2",
    lg: "px-5.5 py-2.5 text-lg gap-2.5",
  };

  const variants = {
    primary: `
      bg-gradient-to-br from-teal-400 to-blue-500 text-white
      shadow-md hover:shadow-lg
      hover:from-blue-500 hover:to-teal-400
      focus-visible:ring-teal-300
    `,
    secondary: `
      bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-white
      hover:bg-zinc-300 dark:hover:bg-zinc-600
      focus-visible:ring-zinc-400
    `,
    ghost: `
      bg-transparent text-teal-600 dark:text-teal-400
      hover:bg-teal-100 dark:hover:bg-teal-800/20
      focus-visible:ring-teal-400
    `,
    danger: `
      bg-gradient-to-br from-red-500 to-red-700 text-white
      hover:from-red-600 hover:to-red-800 hover:shadow-lg
      focus-visible:ring-red-400
    `,
  };

  return (
    <button
      disabled={loading || props.disabled}
      className={twMerge(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {/* 🫧 Bubble shimmer effect on loading */}
      {loading && (
        <span className="absolute inset-0 animate-pulse-slow bg-gradient-to-r from-white/10 via-white/30 to-white/10 z-0 rounded-full" />
      )}

      {/* Content Layer */}
      <span className="relative z-10 inline-flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </button>
  );
}


