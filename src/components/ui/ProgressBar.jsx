import React from "react";

export default function ProgressBar({ value = 0 }) {
  return (
    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-teal-400 to-blue-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
