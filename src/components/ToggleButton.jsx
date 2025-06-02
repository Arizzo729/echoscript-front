import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function ToggleButton({
  onToggle,
  initial = false,
  labelOn = "On",
  labelOff = "Off",
  iconOn = null,
  iconOff = null,
  size = 'md',
  className = "",
}) {
  const [toggled, setToggled] = useState(initial);

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg",
  };

  const handleClick = () => {
    const newState = !toggled;
    setToggled(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <button
      onClick={handleClick}
      className={twMerge(
        `inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-300
         focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500
         ${toggled ? 'bg-teal-600 text-white shadow-md hover:bg-teal-700' : 'bg-zinc-600 text-white hover:bg-zinc-500'}`,
        sizes[size],
        className
      )}
    >
      {toggled ? iconOn : iconOff}
      {toggled ? labelOn : labelOff}
    </button>
  );
}
