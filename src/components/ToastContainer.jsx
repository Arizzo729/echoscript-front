```jsx
// src/components/ToastContainer.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

// Create context
const ToastContext = createContext();

// Hook to use toast
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastContainer");
  return ctx.addToast;
};

// Preset positions
const POSITIONS = {
  "top-right": "fixed top-4 right-4 flex-col items-end",
  "top-left": "fixed top-4 left-4 flex-col items-start",
  "bottom-right": "fixed bottom-4 right-4 flex-col items-end",
  "bottom-left": "fixed bottom-4 left-4 flex-col items-start",
};

// Icon & border by type
const VARIANTS = {
  success: { icon: <CheckCircle className="text-green-400" />, border: "border-green-500" },
  error:   { icon: <AlertCircle className="text-red-400" />, border: "border-red-500" },
  info:    { icon: <Info className="text-blue-400" />, border: "border-blue-500" },
};

// Reducer
function toastReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "REMOVE":
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
}

// Provider component
function ToastContainer({ children, limit = 5, position = "top-right" }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    dispatch({ type: "REMOVE", payload: id });
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const addToast = useCallback(
    ({ message, type = "info", duration = 4000, action }) => {
      const id = Date.now().toString() + "-" + Math.random().toString();
      dispatch({ type: "ADD", payload: { id, message, type, duration, action } });
      if (timers.current[id]) clearTimeout(timers.current[id]);
      timers.current[id] = setTimeout(() => removeToast(id), duration);

      // enforce limit
      if (limit && toasts.length >= limit) {
        const [oldest] = toasts;
        if (oldest) removeToast(oldest.id);
      }
    },
    [limit, toasts, removeToast]
  );

  // cleanup on unmount
  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  return (
    <ToastContext.Container value={{ addToast, removeToast }}>
      {children}
      <div className={POSITIONS[position] + " z-50 space-y-3 p-2 max-w-sm"}>
        <AnimatePresence>
          {toasts.map((t) => {
            const v = VARIANTS[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onMouseEnter={() => clearTimeout(timers.current[t.id])}
                onMouseLeave={() => { timers.current[t.id] = setTimeout(() => removeToast(t.id), t.duration); }}
                role="status"
                className={
                  "flex items-start gap-3 p-4 bg-gray-900 border-l-4 shadow-md backdrop-blur-sm rounded-lg " +
                  v.border
                }
              >
                {v.icon}
                <div className="flex-1 text-sm text-white font-medium">{t.message}</div>
                {t.action && (
                  <button
                    onClick={() => { t.action.callback(t.action.meta); removeToast(t.id); }}
                    className="ml-2 px-3 py-1 text-xs font-semibold rounded hover:bg-gray-800 transition"
                  >
                    {t.action.label}
                  </button>
                )}
                <button
                  onClick={() => removeToast(t.id)}
                  aria-label="Dismiss notification"
                  className="text-gray-400 hover:text-white transition"
                >
                  <XCircle size={18} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Container>
  );
}

// Default export for Layout import
export default ToastContainer;
```

