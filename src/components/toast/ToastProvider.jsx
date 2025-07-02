// src/components/toast/ToastProvider.jsx
import React, { createContext, useReducer, useRef, useCallback } from 'react';

export const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

function toastReducer(state, { type, payload }) {
  switch (type) {
    case 'ADD':
      return [...state, payload];
    case 'REMOVE':
      return state.filter(t => t.id !== payload);
    default:
      return state;
  }
}

export function ToastProvider({ children, limit = 5 }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const timers = useRef({});

  const removeToast = useCallback(id => {
    dispatch({ type: 'REMOVE', payload: id });
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const addToast = useCallback(({ type = 'info', message = '', duration = 4000, action }) => {
    const id = `${Date.now()}-${Math.random()}`;
    const toast = { id, type, message, duration, action };
    dispatch({ type: 'ADD', payload: toast });
    timers.current[id] = setTimeout(() => removeToast(id), duration);

    // enforce limit
    if (toasts.length >= limit) {
      const [oldest] = toasts;
      removeToast(oldest.id);
    }
  }, [limit, toasts, removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

