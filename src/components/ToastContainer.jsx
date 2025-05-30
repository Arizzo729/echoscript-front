// components/ToastContainer.jsx — Advanced Notification System

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdCheckCircle, MdErrorOutline, MdInfoOutline } from "react-icons/md";

const toastVariants = {
  success: {
    icon: <MdCheckCircle className="text-green-400 text-xl" />,
    bg: "bg-zinc-800 border-green-500"
  },
  error: {
    icon: <MdErrorOutline className="text-red-400 text-xl" />,
    bg: "bg-zinc-800 border-red-500"
  },
  info: {
    icon: <MdInfoOutline className="text-blue-400 text-xl" />,
    bg: "bg-zinc-800 border-blue-500"
  }
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail && e.detail.message) {
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
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg ${toastVariants[type].bg}`}
          >
            {toastVariants[type].icon}
            <div className="flex-1 text-sm text-white font-medium leading-tight">
              {message}
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== id))}
              className="text-zinc-400 hover:text-white"
            >
              <MdClose />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// USAGE
// Dispatch a toast from anywhere:
// window.dispatchEvent(new CustomEvent("toast", { detail: { type: "success", message: "Transcript saved!" } }))
