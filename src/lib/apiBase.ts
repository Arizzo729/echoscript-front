// src/lib/apiBase.ts
const raw = import.meta.env.VITE_API_BASE ?? "/api";
export const API_BASE = raw.replace(/\/+$/, ""); // strip trailing slash(es)
