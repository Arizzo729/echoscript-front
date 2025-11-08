// src/lib/apiBase.ts  (use .js if your project is JS)
export const API_BASE = (
  import.meta.env.VITE_API_BASE ??
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API ??
  '/api'
).replace(/\/+$/, '')

export default API_BASE
