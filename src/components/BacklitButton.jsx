import React from "react";
import clsx from "clsx";

export default function BacklitButton({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={clsx(
        "relative px-6 py-3 rounded-full font-semibold text-white text-lg tracking-tight",
        "bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-lg",
        "hover:from-fuchsia-500 hover:to-purple-500 transition-all duration-300 ease-out",
        "before:absolute before:inset-0 before:rounded-full before:blur-xl before:opacity-30 before:bg-fuchsia-500",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
