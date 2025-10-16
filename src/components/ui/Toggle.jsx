<<<<<<< Updated upstream
// ✅ EchoScript.AI — Final Enhanced Universal Toggle.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

/**
 * A reliable, accessible, animated toggle switch
 * - Works across all pages and contexts
 * - Syncs with external state if needed
 * - Can trigger custom callbacks
 * - Includes fallbacks and safe error handling
 */
export default function Toggle({
  checked = false,
  onChange = () => {},
  label = '',
  disabled = false,
  size = 'md',
  className = '',
  controlled = false,
  syncExternal = null,
}) {
  const [isOn, setIsOn] = useState(!!checked);
  const prevExternal = useRef(checked);

  useEffect(() => {
    if (controlled && syncExternal !== null && syncExternal !== prevExternal.current) {
      setIsOn(!!syncExternal);
      prevExternal.current = syncExternal;
    }
  }, [controlled, syncExternal]);

  const handleToggle = () => {
    if (disabled) return;
    const newState = !isOn;
    setIsOn(newState);
    onChange(newState);
  };

  const sizes = {
    sm: {
      width: 'w-9',
      height: 'h-5',
      circle: 'w-4 h-4',
    },
    md: {
      width: 'w-11',
      height: 'h-6',
      circle: 'w-5 h-5',
    },
    lg: {
      width: 'w-14',
      height: 'h-7',
      circle: 'w-6 h-6',
    },
  };

  const { width, height, circle } = sizes[size] || sizes.md;

  return (
    <div
      className={twMerge(
        'inline-flex items-center space-x-2 select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {label && <span className="text-sm text-white whitespace-nowrap">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label={label || 'Toggle'}
        disabled={disabled}
        onClick={handleToggle}
        className={twMerge(
          'relative inline-flex items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none',
          width,
          height,
          isOn ? 'bg-teal-500' : 'bg-zinc-600'
        )}
      >
        <motion.span
          className={twMerge(
            'inline-block transform rounded-full bg-white shadow-md',
            circle
          )}
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
=======
// ✅ EchoScript.AI — Polished Enhanced Toggle with Audio
import React from "react";
import { Switch } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { useSound } from "../../context/SoundContext";

/**
 * Toggle switch with icon, label, and description
 * Variants: "primary", "danger", "success"
 */
export default function Toggle({
  enabled,
  onChange,
  label,
  description,
  Icon,
  variant = "primary",
  className = "",
  disableSound = false,
}) {
  const { playClick, isMuted } = useSound(); // ✅ Correct sound function

  const handleToggle = (val) => {
    if (!disableSound && !isMuted) playClick(); // ✅ Proper audio
    onChange(val);
  };

  const colors = {
    primary: "bg-teal-600 dark:bg-teal-500",
    danger: "bg-red-600 dark:bg-red-500",
    success: "bg-green-600 dark:bg-green-500",
  };

  return (
    <div className="flex items-center justify-between rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-800 shadow-sm transition-colors">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-white">
          {Icon && <Icon className="w-4 h-4 text-teal-500 shrink-0" />}
          {label}
        </div>
        {description && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
            {description}
          </span>
        )}
      </div>

      <Switch
        checked={enabled}
        onChange={handleToggle}
        className={twMerge(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-1 dark:focus:ring-offset-zinc-900",
          enabled ? colors[variant] : "bg-zinc-300 dark:bg-zinc-600",
          className
        )}
      >
        <span
          className={twMerge(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-out",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </Switch>
>>>>>>> Stashed changes
    </div>
  );
}

<<<<<<< Updated upstream
Toggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  controlled: PropTypes.bool,
  syncExternal: PropTypes.bool,
};
=======
>>>>>>> Stashed changes
