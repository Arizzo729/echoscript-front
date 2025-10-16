// Defines the base URL for API calls, falling back to a proxy.
export const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");