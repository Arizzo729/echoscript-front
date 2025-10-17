// src/hooks/useTranslation.jsx
import { useCallback } from 'react';

import i18n from '../i18n'; // single source of truth (re-export from i18n.js or i18n/index.js)

export default function useTranslation() {

  const t = useCallback(
    (key, options) => {
      try {
        return i18n.t(key, options);
      } catch {
        return key;
      }
    },
    []
  );

  return t;
}