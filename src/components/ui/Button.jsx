// ✅ EchoScript.AI — Final Polished SmartButton
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
  const base =
    "relative inline-flex items-center justify-center font-medium select-none rounded-full transition-all duration-300 ease-out group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 shadow-sm";

  const sizes = {
    xs: "px-3 py-1 text-xs gap-1.5",
    sm: "px-4 py-1.5 text-sm gap-2",
    md: "px-5 py-2 text-sm gap-2.5",
    lg: "px-6 py-2.5 text-base gap-3",
  };

  const variants = {
    primary: `
      bg-teal-600 text-white
      hover:bg-teal-500
      hover:shadow-teal-500/30
      shadow-md
      focus-visible:ring-teal-400
      dark:shadow-teal-400/20
    `,
    secondary: `
      bg-zinc-200 text-zinc-800
      hover:bg-zinc-300
      dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600
      focus-visible:ring-zinc-400
    `,
    ghost: `
      bg-transparent text-teal-600 dark:text-teal-400
      hover:bg-teal-100 dark:hover:bg-teal-700/10
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
      {loading && (
        <span className="absolute inset-0 animate-pulse bg-white/10 rounded-full" />
      )}
      <span className="relative z-10 inline-flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </button>
  );
}


