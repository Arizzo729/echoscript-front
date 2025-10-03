// src/lib/api.ts
// Works on Netlify and locally. Supports both VITE_API_BASE and VITE_API_URL.
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE ||
  (import.meta as any).env?.VITE_API_URL ||
  "https://api.echoscript.ai";

/** Attach Authorization header if a token is present */
function authHeader() {
  const t = typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") : null;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

/** Low-level fetch wrapper (does not JSON-parse automatically) */
export async function http(path: string, init: RequestInit = {}) {
  const headers = {
    ...(init.headers || {}),
    ...authHeader(),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }
  return res;
}

/** Helpers that do JSON in/out */
export async function getJSON<T = any>(path: string, init: RequestInit = {}) {
  const r = await http(path, init);
  return (await r.json()) as T;
}
export async function postJSON<T = any>(path: string, body: any, init: RequestInit = {}) {
  const r = await http(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    body: JSON.stringify(body ?? {}),
  });
  return (await r.json()) as T;
}

/** Auth */
export async function signup(email: string, password: string, name?: string) {
  return postJSON("/api/auth/signup", { email, password, name });
}
export async function login(email: string, password: string) {
  const data = await postJSON<{ access_token?: string }>("/api/auth/login", { email, password });
  if (data?.access_token && typeof localStorage !== "undefined") {
    localStorage.setItem("auth_token", data.access_token);
  }
  return data;
}

/** Stripe */
export async function createCheckout(plan: "pro" | "premium" | "edu" = "pro") {
  return postJSON<{ url: string }>("/api/stripe/create-checkout-session", { plan });
}

/** Transcription (expects backend to accept multipart form field "file") */
export async function transcribe(file: File, extra?: Record<string, any>) {
  const fd = new FormData();
  fd.append("file", file);
  if (extra) {
    Object.entries(extra).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v));
    });
  }
  const r = await http("/api/transcribe", { method: "POST", body: fd });
  return r.json();
}

/** Default export – what TranscribeUploader imports */
const api = {
  http,
  getJSON,
  postJSON,
  signup,
  login,
  createCheckout,
  transcribe,
};

export default api;
