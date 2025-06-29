// components/ToastContainer.jsx — Pro-Level Notification System

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdClose,
  MdCheckCircle,
  MdErrorOutline,
  MdInfoOutline,
} from "react-icons/md";

// Icon + style mapping
const toastVariants = {
  success: {
    icon: <MdCheckCircle className="text-green-400 text-xl shrink-0" />,
    bg: "bg-zinc-800 border-green-500",
  },
  error: {
    icon: <MdErrorOutline className="text-red-400 text-xl shrink-0" />,
    bg: "bg-zinc-800 border-red-500",
  },
  info: {
    icon: <MdInfoOutline className="text-blue-400 text-xl shrink-0" />,
    bg: "bg-zinc-800 border-blue-500",
  },
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  const timeouts = useRef({});

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.message) {
        const id = Date.now();
        setToasts((prev) => [...prev, { ...e.detail, id }]);

        // Auto-dismiss with cleanup
        const timeout = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
          delete timeouts.current[id];
        }, e.detail.duration || 4000);

        timeouts.current[id] = timeout;
      }
    };

    const escHandler = (e) => {
      if (e.key === "Escape") setToasts([]);
    };

    window.addEventListener("toast", handler);
    window.addEventListener("keydown", escHandler);

    return () => {
      window.removeEventListener("toast", handler);
      window.removeEventListener("keydown", escHandler);
      Object.values(timeouts.current).forEach(clearTimeout);
    };
  }, []);

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timeouts.current[id]);
    delete timeouts.current[id];
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm">
      <AnimatePresence>
        {toasts.map(({ id, message, type = "info" }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: 60, blur: 8 }}
            animate={{ opacity: 1, x: 0, blur: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            role="alert"
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border-l-4 shadow-2xl backdrop-blur-sm ${toastVariants[type].bg}`}
          >
            {toastVariants[type].icon}
            <div className="flex-1 text-sm text-white font-medium leading-tight">
              {message}
            </div>
            <button
              onClick={() => dismiss(id)}
              className="text-zinc-400 hover:text-white transition"
              aria-label="Dismiss notification"
            >
              <MdClose size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

