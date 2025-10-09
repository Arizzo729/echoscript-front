// src/lib/api.ts
type Json = Record<string, any>;

function ensureLeadingSlash(s: string) {
  return s.startsWith("/") ? s : `/${s}`;
}
function stripTrailingSlash(s: string) {
  return s.replace(/\/+$/, "");
}
function ensureApiBase(u?: string) {
  const base = stripTrailingSlash(String(u || "").trim());
  if (!base) return "https://api.echoscript.ai/api";
  // if it already ends with /api, keep it; otherwise append /api
  return base.endsWith("/api") ? base : `${base}/api`;
}

const REL_BASE = ensureLeadingSlash(
  (import.meta as any)?.env?.VITE_API_BASE || "/api"
);
const ABS_BASE = ensureApiBase(
  (import.meta as any)?.env?.VITE_API_URL || "https://api.echoscript.ai"
);

function join(base: string, path: string) {
  const b = stripTrailingSlash(base);
  const p = ensureLeadingSlash(path || "/");
  return `${b}${p}`;
}

async function call(path: string, opts: RequestInit = {}, useAbsolute = false) {
  const url = join(useAbsolute ? ABS_BASE : REL_BASE, path);
  const res = await fetch(url, {
    credentials: "include", // ← always send cookies
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
    return await call("/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, remember: !!payload.remember }),
    });
  } catch (e: any) {
    if (e?.status === 404) {
      // fall back if backend uses signup-as-login
      return await signup({ email: payload.email, password: payload.password });
    }
    throw e;
  }
}

export async function logout(): Promise<void> {
  try { await call("/auth/logout", { method: "POST" }); } catch {}
}

const api = { call, me, signup, login, logout };
export default api;
