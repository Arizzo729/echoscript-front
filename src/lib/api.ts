// src/lib/api.ts
// Final API helper wired for Netlify proxy: use "/api" in prod, VITE_API_URL for local

type Json = Record<string, any>;

const BASE_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    (import.meta as any).env.VITE_API_URL) ||
  "/api";

async function apiFetch<T = any>(
  path: string,
  opts: RequestInit = {},
  expectJson = true
): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });

  const text = await res.text();
  const parsed = text ? safeJson(text) : null;

  if (!res.ok) {
    const detail =
      (parsed && (parsed.detail || parsed.message)) ||
      `${res.status} ${res.statusText}`;
    throw new Error(detail);
  }
  return (expectJson ? (parsed as T) : (text as unknown as T))!;
}

function safeJson(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return { raw: s };
  }
}

// --- Auth ---
export async function signup(email: string, password: string) {
  return apiFetch<Json>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string) {
  const data = await apiFetch<Json>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data?.access_token) localStorage.setItem("auth_token", data.access_token);
  return data;
}

// --- Stripe ---
export async function stripeDebug() {
  // Your backend expects POST here
  return apiFetch<Json>("/stripe/_debug-env", { method: "POST" });
}

export async function createCheckoutSession(
  plan: "pro" | "premium" | "edu",
  useAuth = false
) {
  const headers: Record<string, string> = {};
  if (useAuth) {
    const token = localStorage.getItem("auth_token") || "";
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const data = await apiFetch<Json>(
    "/stripe/create-checkout-session",
    {
      method: "POST",
      headers,
      body: JSON.stringify({ plan }),
    },
    true
  );

  if ((data as any)?.url) location.href = (data as any).url as string;
  return data;
}

// --- Health ---
export async function healthz() {
  return apiFetch<Json>("/healthz");
}

// --- Transcription ---
export async function transcribe(
  file: File,
  opts?: { vad?: boolean; diarize?: boolean; lang?: string }
) {
  const fd = new FormData();
  fd.append("file", file);
  if (opts?.vad != null) fd.append("vad", String(opts.vad));
  if (opts?.diarize != null) fd.append("diarize", String(opts.diarize));
  if (opts?.lang) fd.append("lang", opts.lang);

  const url = `${BASE_URL}/v1/transcribe`;
  const res = await fetch(url, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || "Transcription failed");
  return data;
}

// Keep named exports (above) AND provide a default export bundle,
// so existing `import api from "../lib/api"` works.
const api = {
  signup,
  login,
  stripeDebug,
  createCheckoutSession,
  healthz,
  transcribe,
};

export default api;

