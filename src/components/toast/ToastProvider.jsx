```tsx
// src/components/toast/ToastProvider.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
} from "lucide-react";

// Toast types and context
type ToastType = "success" | "error" | "info";

type ToastAction = {
  label: string;
  callback: (meta?: any) => void;
  meta?: any;
};

type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  action?: ToastAction;
};

type ToastContextProps = {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = (): ToastContextProps["addToast"] => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.addToast;
};

// Layout presets
const POSITIONS: Record<string, string> = {
  "top-right": "fixed top-4 right-4 flex-col items-end",
  "top-left": "fixed top-4 left-4 flex-col items-start",
  "bottom-right": "fixed bottom-4 right-4 flex-col items-end",
  "bottom-left": "fixed bottom-4 left-4 flex-col items-start",
};

// Icon and border by type
const VARIANTS: Record<ToastType, { icon: ReactNode; border: string }> = {
  success: { icon: <CheckCircle className="text-green-400" />, border: "border-green-500" },
  error:   { icon: <AlertCircle className="text-red-400" />, border: "border-red-500" },
  info:    { icon: <Info className="text-blue-400" />, border: "border-blue-500" },
};

// Reducer
function toastReducer(state: Toast[], action: { type: string; payload?: any }) {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "REMOVE":
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
}

export const ToastProvider = ({
  children,
  limit = 5,
  position = "top-right",
}: {
  children: ReactNode;
  limit?: number;
  position?: keyof typeof POSITIONS;
}) => {
  const [toasts, dispatch] = useReducer(toastReducer, [] as Toast[]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const addToast = useCallback(
    (opts: Omit<Toast, "id">) => {
      const id = `${Date.now()}-${Math.random()}`;
      const toast: Toast = { id, ...opts };
      dispatch({ type: "ADD", payload: toast });
      if (timers.current[id]) clearTimeout(timers.current[id]);
      timers.current[id] = setTimeout(() => removeToast(id), opts.duration);

      // Enforce limit
      if (limit && toasts.length >= limit) {
        const [oldest] = toasts;
        removeToast(oldest.id);
      }
    },
    [limit, toasts]
  );

  const removeToast = useCallback((id: string) => {
    dispatch({ type: "REMOVE", payload: id });
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className={`;{POSITIONS[position]} z-50 space-y-3 p-2 max-w-sm`}>        
        <AnimatePresence>
          {toasts.map((t) => {
            const variant = VARIANTS[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onMouseEnter={() => clearTimeout(timers.current[t.id])}
                onMouseLeave={() => {
                  timers.current[t.id] = setTimeout(() => removeToast(t.id), t.duration);
                }}
                role="status"
                className={
                  `flex items-start gap-3 p-4 bg-gray-900 border-l-4 shadow-md backdrop-blur-sm rounded-lg ` +
                  variant.border
                }
              >
                {variant.icon}
                <div className="flex-1 text-sm text-white font-medium">
                  {t.message}
                </div>
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
    </ToastContext.Provider>
  );
};
```


