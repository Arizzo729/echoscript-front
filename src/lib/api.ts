// src/lib/api.ts
// Robust, cookie-including API client that ALWAYS uses the relative /api prefix.
// Netlify will proxy /api/* → https://api.echoscript.ai/api/* per your redirects.
// This prevents malformed URLs like "/https://api.echoscript.ai/...".

type Json = Record<string, any>;

// Normalize a relative prefix (never allow absolute here)
function normalizeRelPrefix(v: unknown): string {
  let s = String(v || "").trim();
  if (!s) return "/api";
  // If someone sets an absolute URL here by mistake, ignore it and use /api.
  if (/^https?:\/\//i.test(s)) return "/api";
  if (!s.startsWith("/")) s = `/${s}`;
  // Remove trailing slashes
  s = s.replace(/\/+$/, "");
  return s || "/api";
}

// Use env if present, otherwise /api.
const REL_PREFIX = normalizeRelPrefix((import.meta as any)?.env?.VITE_API_BASE || "/api");

// Join helper
function join(base: string, path: string) {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

// Core caller: always send credentials so your HttpOnly cookie is included.
async function call(path: string, opts: RequestInit = {}) {
  const url = join(REL_PREFIX, path);
  const res = await fetch(url, {
    credentials: "include",
    ...opts,
    headers: {
      Accept: "application/json",
      ...(opts.headers || {}),
    },
  });

  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }

  if (!res.ok) {
    const err: any = new Error(body?.detail || body?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

// ---------- Auth ----------
export async function me(): Promise<Json> {
  return call("/auth/me");
}

export async function signup(payload: { email: string; password: string }): Promise<Json> {
  return call("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { email: string; password: string; remember?: boolean }): Promise<Json> {
  try {
    // Use real signin if available
    return await call("/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, remember: !!payload.remember }),
    });
  } catch (e: any) {
    // If your backend uses signup-as-login, fall back gracefully
    if (e?.status === 404) {
      return await signup({ email: payload.email, password: payload.password });
    }
    throw e;
  }
}

export async function logout(): Promise<void> {
  try { await call("/auth/logout", { method: "POST" }); } catch {}
}

// ---------- Stripe helpers (if you call them from components) ----------
export async function createCheckoutSession(plan: string) {
  return call("/stripe/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
}

export async function createPortalSession() {
  try {
    return await call("/stripe/create-portal-session", { method: "POST" });
  } catch (e: any) {
    if (e?.status === 404) {
      return await call("/stripe/create-customer-portal-session", { method: "POST" });
    }
    throw e;
  }
}

const api = { call, me, signup, login, logout, createCheckoutSession, createPortalSession };
export default api;
