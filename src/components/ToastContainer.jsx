// src/components/toast/ToastProvider.jsx — Advanced ; Notification System

import React, { createContext, useContext, useReducer, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

// Context and hook
const ToastContext = createContext();
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.addToast;
};

// Position presets
const POSITIONS = {
  "top-right": "fixed top-4 right-4 items-end",
  "top-left": "fixed top-4 left-4 items-start",
  "bottom-right": "fixed bottom-4 right-4 items-end",
  "bottom-left": "fixed bottom-4 left-4 items-start",
};

// Type variants
const VARIANTS = {
  success: { icon: <CheckCircle className="text-green-400 text-xl" />, border: "border-green-500" },
  error:   { icon: <AlertCircle className="text-red-400 text-xl" />,   border: "border-red-500" },
  info:    { icon: <Info className="text-blue-400 text-xl" />,      border: "border-blue-500" },
};

// Reducer actions
type Toast = {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  action?: { label: string; callback: (meta?: any) => void; meta?: any };
};

function reducer(state: Toast[], action: { type: string; toast?: Toast; id?: string; limit?: number }) {
  switch (action.type) {
    case "ADD":
      const list = [...state, action.toast];
      if (action.limit && list.length > action.limit) list.shift();
      return list;
    case "REMOVE":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

export function ToastProvider({
  children,
  limit = 3,
  position = "top-right",
}) {
  const [toasts, dispatch] = useReducer(reducer, []);
  const timers = useRef({} as Record<string, ReturnType<typeof setTimeout>>);

  const addToast = ({ message, type = "info", duration = 4000, action }: Omit<Toast, "id">) => {
    const id = `${Date.now()}_${Math.random()}`;
    const toast: Toast = { id, message, type, duration, action };
    dispatch({ type: "ADD", toast, limit });
    timers.current[id] = setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id: string) => {
    dispatch({ type: "REMOVE", id });
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className={`${POSITIONS[position]} flex flex-col gap-3 z-50 max-w-sm p-2`}>        
        <AnimatePresence>
          {toasts.map((t) => {
            const v = VARIANTS[t.type] || VARIANTS.info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onMouseEnter={() => clearTimeout(timers.current[t.id])}
                onMouseLeave={() => {
                  timers.current[t.id] = setTimeout(() => removeToast(t.id), t.duration);
                }}
                role="alert"
                className={
                  `flex items-start gap-3 p-4 bg-zinc-800 border-l-4 shadow-xl backdrop-blur-sm rounded-lg ` +
                  v.border
                }
              >
                {v.icon}
                <div className="flex-1 text-sm text-white font-medium">
                  {t.message}
                </div>
                {t.action && (
                  <button
                    onClick={() => { t.action.callback(t.action.meta); removeToast(t.id); }}
                    className="ml-2 px-3 py-1 text-xs font-semibold rounded hover:bg-zinc-700 transition"
                  >
                    {t.action.label}
                  </button>
                )}
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-zinc-400 hover:text-white transition"
                  aria-label="Dismiss toast"
                >
                  <XCircle size={18} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

