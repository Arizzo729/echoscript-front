// src/lib/api.ts
// Final API helper wired for Netlify -> Railway proxy
// - Uses relative '/api' in production so Netlify forwards to https://api.echoscript.ai/:splat
// - Still allows VITE_API_URL for local/dev override

type Json = Record<string, any>;

const BASE_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    (import.meta as any).env.VITE_API_URL) ||
  "/api"; // Netlify proxy in production

// ---- low-level fetch wrapper -------------------------------------------------
async function apiFetch<T = any>(
  path: string,
  opts: RequestInit = {},
  expectJson = true
): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, {
    // CORS is handled by the backend; credentials are not needed unless you add cookies
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });

  // attempt to parse body (even on error) so callers get details
  const text = await res.text();
  const body = text ? safeJson(text) : null;

  if (!res.ok) {
    const detail =
      (body && (body.detail || body.message)) || `${res.status} ${res.statusText}`;
    throw new Error(detail);
  }

  return (expectJson ? (body as T) : (text as unknown as T))!;
}

function safeJson(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return { raw: s };
  }
}

// ---- Auth -------------------------------------------------------------------
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
  // store token for convenience
  if (data?.access_token) localStorage.setItem("auth_token", data.access_token);
  return data;
}

// ---- Stripe -----------------------------------------------------------------
/** Optional: sanity endpoint that returns which prices are configured */
export async function stripeDebug() {
  // Backend expects POST for this helper in your current app
  return apiFetch<Json>("/stripe/_debug-env", { method: "POST" });
}

/**
 * Create a Checkout Session.
 * @param plan one of: 'pro' | 'premium' | 'edu'
 * @param useAuth when true, sends Authorization header with stored token
 */
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

  // If the backend returns {url: "..."} – send user to Stripe
  if (data?.url) {
    location.href = data.url as string;
  }

  return data;
}

// ---- Health (useful for quick checks) ---------------------------------------
export async function healthz() {
  return apiFetch<Json>("/healthz", { method: "GET" });
}

// ---- Transcription (example file upload) ------------------------------------
export async function transcribe(file: File, opts?: { vad?: boolean; diarize?: boolean; lang?: string }) {
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
