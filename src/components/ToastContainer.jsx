// src/components/ToastContainer.jsx
import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { ToastContext } from './toast/ToastProvider';

const POSITIONS = {
  'top-right': 'fixed top-4 right-4 flex-col items-end',
  'top-left': 'fixed top-4 left-4 flex-col items-start',
  'bottom-right': 'fixed bottom-4 right-4 flex-col items-end',
  'bottom-left': 'fixed bottom-4 left-4 flex-col items-start',
};

const VARIANTS = {
  success: { icon: <CheckCircle className="text-green-400" />, border: 'border-green-500' },
  error:   { icon: <AlertCircle className="text-red-400" />,   border: 'border-red-500' },
  info:    { icon: <Info className="text-blue-400" />,        border: 'border-blue-500' },
};

export default function ToastContainer({ position = 'top-right' }) {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;
  const { toasts, removeToast } = ctx;
  if (!toasts || toasts.length === 0) return null;

  return createPortal(
    <div className={POSITIONS[position] + ' z-50 space-y-3 p-2 max-w-sm pointer-events-none'}>
      <AnimatePresence>
        {toasts.map(({ id, type, message, action }) => {
          const v = VARIANTS[type] || VARIANTS.info;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={() => removeToast(id)}
              role="status"
              className={
                'pointer-events-auto flex items-start gap-3 p-4 bg-gray-900 border-l-4 shadow-md backdrop-blur-sm rounded-lg ' +
                v.border
              }
            >
              {v.icon}
              <div className="flex-1 text-sm text-white font-medium">{message}</div>
              {action && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    action.callback(action.meta);
                    removeToast(id);
                  }}
                  className="ml-2 px-3 py-1 text-xs font-semibold rounded hover:bg-gray-800 transition"
                >
                  {action.label}
                </button>
              )}
              <button
                onClick={e => {
                  e.stopPropagation();
                  removeToast(id);
                }}
                aria-label="Dismiss notification"
                className="text-gray-400 hover:text-white transition"
              >
                <XCircle size={18} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body
  );
}



