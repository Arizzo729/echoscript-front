// src/lib/api.ts

type Json = Record<string, any>;

function normalizeRelPrefix(v: unknown): string {
  let s = String(v || "").trim();
  if (!s) return "/api/v1";

  // If absolute URL => keep it & append /api/v1
  if (/^https?:\/\//i.test(s)) {
    return s.replace(/\/+$/, "") + "/api/v1";
  }

  // If relative => ensure leading slash and remove trailing slashes
  if (!s.startsWith("/")) s = `/${s}`;
  s = s.replace(/\/+$/, "");

  return s || "/api/v1";
}

const RAW_ENV_PREFIX = (import.meta as any)?.env?.VITE_API_BASE;
const IS_DEV = Boolean((import.meta as any)?.env?.DEV);

// In development, default to the local backend at port 8000 so Vite doesn't
// accidentally send API calls to the frontend dev server when no VITE_API_BASE
// is configured. In production the frontend is typically served from the
// backend so a relative `/api/v1` path is acceptable.
const DEFAULT_BACKEND_BASE = IS_DEV ? "http://127.0.0.1:8000" : "/api/v1";

const REL_PREFIX = normalizeRelPrefix(RAW_ENV_PREFIX ?? DEFAULT_BACKEND_BASE);

// src/lib/api.ts
export const SERVER_URL = ((import.meta as any)?.env?.VITE_API_BASE || (IS_DEV ? "http://127.0.0.1:8000" : "")).replace(/\/+$/, "");

// Debug logs
console.log("VITE_API_BASE raw:", RAW_ENV_PREFIX);
console.log("REL_PREFIX:", REL_PREFIX);

// Join helper
function join(base: string, path: string) {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

// Get access token from localStorage
function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

// Core caller: always send credentials and include JWT token if available
async function call(path: string, opts: RequestInit = {}) {
  const url = join(REL_PREFIX, path);
  
  // Get access token and add to headers if available
  const accessToken = getAccessToken();
  
  // Build headers object
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  
  // Add Content-Type for non-FormData requests
  if (!(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  
  // Add Authorization header if token exists
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  
  // Merge with any provided headers
  const finalHeaders = { ...headers, ...(opts.headers as Record<string, string>) };
  
  const res = await fetch(url, {
    credentials: "include",
    ...opts,
    headers: finalHeaders,
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

// Profile: richer profile data if backend exposes /profile
export async function profile(): Promise<Json> {
  return call("/profile");
}

export async function signup(payload: { email: string; password: string; username?: string }): Promise<Json> {
  return call("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { email: string; password: string; remember?: boolean }): Promise<Json> {
  try {
    // Try signin endpoint first
    return await call("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ ...payload, remember: !!payload.remember }),
    });
  } catch (e: any) {
    // If signin doesn't exist, try login endpoint
    if (e?.status === 404) {
      try {
        return await call("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: payload.email, password: payload.password }),
        });
      } catch (loginErr: any) {
        // If both fail, throw the original error
        throw e;
      }
    }
    throw e;
  }
}

export async function logout(): Promise<void> {
  try { 
    await call("/auth/logout", { method: "POST" }); 
  } catch (err) {
    console.error('Logout error:', err);
  }
}

export async function refreshToken(): Promise<Json> {
  // Refresh token endpoint should rely on HttpOnly cookies set by backend
  // Never send refresh tokens in the request body (security risk)
  return call("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

// ---------- Transcripts ----------
export async function getTranscripts(): Promise<Json[]> {
  try {
    return await call("/transcripts/");
  } catch (err) {
    console.error('Failed to fetch transcripts:', err);
    return [];
  }
}

export async function getTranscript(id: number): Promise<Json> {
  return call(`/transcripts/${id}`);
}

export async function createTranscript(data: any): Promise<Json> {
  return call("/transcripts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTranscript(id: number, data: any): Promise<Json> {
  return call(`/transcripts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteTranscript(id: number): Promise<Json> {
  return call(`/transcripts/${id}`, {
    method: "DELETE",
  });
}

// ---------- Stripe helpers (if you call them from components) ----------
export async function createCheckoutSession(plan: string) {
  return call("/stripe/create-checkout-session", {
    method: "POST",
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

// ---------- Contact ----------
export async function contact(payload: { name: string; email: string; subject: string; message: string; to?: string; hp?: string }) {
  // Use REL_PREFIX and ensure we use the /api/v1/contact endpoint if available
  // or fallback to whatever prefix is configured.
  return call("/contact", {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

const api = { 
  call, 
  me, 
  signup, 
  login, 
  logout, 
  refreshToken,
  getTranscripts,
  getTranscript,
  createTranscript,
  updateTranscript,
  deleteTranscript,
  createCheckoutSession, 
  createPortalSession 
  , contact
};

export default api;
