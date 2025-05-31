// components/ToastContainer.jsx — Advanced Notification System

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdClose,
  MdCheckCircle,
  MdErrorOutline,
  MdInfoOutline,
} from "react-icons/md";

// Icon + Style mapping for each toast type
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

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.message) {
        const id = Date.now();
        setToasts((prev) => [...prev, { ...e.detail, id }]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, e.detail.duration || 4000);
      }
    };
    window.addEventListener("toast", handler);
    return () => window.removeEventListener("toast", handler);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm">
      <AnimatePresence>
        {toasts.map(({ id, message, type = "info" }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border-l-4 shadow-2xl ${toastVariants[type].bg}`}
          >
            {toastVariants[type].icon}
            <div className="flex-1 text-sm text-white font-medium leading-tight">
              {message}
            </div>
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== id))
              }
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

