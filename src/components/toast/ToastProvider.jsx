```jsx
// src/components/toast/ToastProvider.jsx
import React, { createContext, useReducer, useCallback, useRef, useEffect } from 'react';

// Export context so ToastContainer can consume it
export const ToastContext = createContext({ toasts: [], addToast: () => {}, removeToast: () => {} });

// Reducer for toast actions
function toastReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'REMOVE':
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
}

// Provider without UI—UI is handled by ToastContainer
export function ToastProvider({ children, limit = 5 }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE', payload: id });
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const addToast = useCallback(
    ({ message, type = 'info', duration = 4000, action }) => {
      const id = Date.now().toString() + '-' + Math.random().toString();
      dispatch({ type: 'ADD', payload: { id, message, type, duration, action } });
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

  // clear all timers on unmount
  useEffect(() => {
    return () => Object.values(timers.current).forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}
```

