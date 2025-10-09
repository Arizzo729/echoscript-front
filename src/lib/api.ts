// src/lib/api.ts
type Json = Record<string, any>;

const REL_BASE = (import.meta as any)?.env?.VITE_API_BASE || "/api";
const ABS_BASE = (import.meta as any)?.env?.VITE_API_URL  || "https://api.echoscript.ai/api";

function join(base: string, path: string) {
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

async function call(path: string, opts: RequestInit = {}, useAbsolute = false) {
  const url = join(useAbsolute ? ABS_BASE : REL_BASE, path);
  const res = await fetch(url, {
    credentials: "include",            // ← always send cookies
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
    // Prefer dedicated signin if available
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

// ---------- Export a single API object ----------
const api = { call, me, signup, login, logout };
export default api;

