import React from "react";

export default function IconButton({
  title,
  "aria-label": ariaLabel,
  className = "",
  onClick,
  disabled = false,
  children,
  type = "button",
}) {
  return (
    <button
      type={type}
      title={title || ariaLabel || "Button"}
      aria-label={ariaLabel || title || "Button"}
      className={`inline-flex items-center justify-center rounded-lg px-3 py-2 border shadow-sm transition-opacity disabled:opacity-50 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}