// src/lib/api.ts
const API_BASE =
  (import.meta as any).env?.VITE_API_URL ??
  (typeof window !== "undefined" ? "https://api.echoscript.ai" : "https://api.echoscript.ai");

type JSONValue = Record<string, any>;

async function get<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`, {
    mode: "cors",
    ...init,
    method: "GET",
  });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}

async function post<T = any>(path: string, body?: JSONValue, init: RequestInit = {}): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`, {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });
  // many endpoints return JSON error bodies
  const data = await r
    .clone()
    .json()
    .catch(() => ({}));
  if (!r.ok) {
    throw new Error(data?.detail || `${r.status} ${r.statusText}`);
  }
  return data;
}

const api = {
  baseUrl: API_BASE,

  // health
  healthz: () => get("/healthz"),

  // auth (note: your backend uses /api/signup & /api/login)
  signup: (email: string, password: string) =>
    post("/api/signup", { email, password }),
  login: (email: string, password: string) =>
    post("/api/login", { email, password }),

  // stripe
  stripeDebugEnv: () => get("/api/stripe/_debug-env"),
  createCheckoutSession: (plan: "pro" | "premium" | "edu", token?: string) =>
    post(
      "/api/stripe/create-checkout-session",
      { plan },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    ),

  // transcription
  transcribe: async (file: File, opts?: { diarize?: boolean; vad?: boolean; language?: string }) => {
    const fd = new FormData();
    fd.append("file", file);
    if (opts?.diarize != null) fd.append("diarize", String(!!opts.diarize));
    if (opts?.vad != null) fd.append("vad", String(!!opts.vad));
    if (opts?.language) fd.append("language", opts.language);

    const r = await fetch(`${API_BASE}/api/v1/transcribe`, {
      method: "POST",
      body: fd,
    });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json();
  },
};

export default api;
export type ApiClient = typeof api;

