// src/lib/api.ts
// Unified API client that works with either Netlify proxy (/api/*)
// or a direct API base (VITE_API_BASE / VITE_API_BASE_URL).

const RAW_BASE =
  (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL || "").trim();

// strip trailing slash
const API_BASE = RAW_BASE.replace(/\/+$/, "");

function url(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p; // if no base, use same-origin (/api/...)
}

// --- low-level helpers ---
async function getJson(path: string, init: RequestInit = {}) {
  const res = await fetch(url(path), { method: "GET", credentials: "include", ...init });
  const txt = await res.text();
  let data: any = {};
  try { data = txt ? JSON.parse(txt) : {}; } catch { data = { detail: txt }; }
  if (!res.ok) throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
  return data;
}

async function postJson(path: string, body?: any, init: RequestInit = {}) {
  const res = await fetch(url(path), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    body: JSON.stringify(body ?? {}),
    ...init,
  });
  const txt = await res.text();
  let data: any = {};
  try { data = txt ? JSON.parse(txt) : {}; } catch { data = { detail: txt }; }
  if (!res.ok) throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
  return data;
}

// --- high-level API surface ---
export const api = {
  // health
  healthz: () => getJson("/api/healthz"),

  // auth (NOTE: backend is /signup and /login)
  signup: (payload: { email: string; password: string }) =>
    postJson("/api/auth/signup", payload),
  login: (payload: { email: string; password: string; remember?: boolean }) =>
    postJson("/api/auth/login", payload),
  logout: () => postJson("/api/auth/logout", {}),

  // stripe
  stripeDebugEnv: () => getJson("/api/stripe/_debug-env"),
  stripeCreateCheckout: (plan: "pro" | "premium" | "edu") =>
    postJson("/api/stripe/create-checkout-session", { plan }),

  // transcribe (multipart)
  transcribe: async (formData: FormData) => {
    const res = await fetch(url("/api/v1/transcribe"), {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const txt = await res.text();
    let data: any = {};
    try { data = txt ? JSON.parse(txt) : {}; } catch { data = { detail: txt }; }
    if (!res.ok) throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
    return data;
  },
};

// default export to satisfy imports like `import api from "../lib/api"`
export default api;

