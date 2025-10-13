<<<<<<< Updated upstream
// src/components/IconButton.jsx
import React from "react";

/**
 * Minimal, accessible icon button that forwards all events/props.
 */
export default function IconButton({
  icon,
  label,
  tooltip,
  className = "",
  type = "button",
  onClick,
  disabled = false,
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label || tooltip}
      title={tooltip || label}
      className={[
        "inline-flex items-center justify-center",
        "h-9 w-9 rounded-lg",
        "bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className,
      ].join(" ")}
      {...rest}
=======
import React from "react";
import { twMerge } from "tailwind-merge";

export default function IconButton({
  icon,
  label,
  size = "md",
  className = "",
  tooltip,
  ...props
}) {
  const sizes = {
    sm: "p-2 text-sm",
    md: "p-2.5 text-base",
    lg: "p-3 text-lg",
  };

  return (
    <button
      className={twMerge(
        `inline-flex items-center justify-center rounded-full
         bg-zinc-100 dark:bg-zinc-800
         text-teal-600 dark:text-teal-400
         shadow-sm hover:shadow-md
         hover:bg-zinc-200 dark:hover:bg-zinc-700
         transition-colors duration-200 ease-out
         focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900`,
        sizes[size],
        className
      )}
      aria-label={label}
      title={tooltip || label}
      {...props}
>>>>>>> Stashed changes
    >
      {icon}
    </button>
  );
}
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
