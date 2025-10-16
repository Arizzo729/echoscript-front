// src/components/IconButton.jsx
import React from "react";

/**
 * Minimal, build-safe IconButton (single definition).
 * No mid-file imports, no duplicate components.
 */
export default function IconButton({
  icon,
  label,
  tooltip,
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  onClick,
  ...rest
}) {
  const sizeCls =
    size === "sm" ? "h-8 w-8 p-2" :
    size === "lg" ? "h-11 w-11 p-3" :
                    "h-9 w-9 p-2.5";

  const classes = [
    "inline-flex items-center justify-center rounded-lg",
    "bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400",
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    sizeCls,
    className
  ].join(" ").trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label || tooltip}
      title={tooltip || label}
      className={classes}
      {...rest}
    >
      {icon}
    </button>
  );
}