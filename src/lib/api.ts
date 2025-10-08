// src/lib/api.ts
// Default export with the exact methods AuthContext expects.
// Also exports named helpers if you want to import them elsewhere.

export type Json =
  | null
  | string
  | number
  | boolean
  | Json[]
  | { [k: string]: Json | undefined };

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString().trim() || "https://api.echoscript.ai";

async function request<T = Json>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    ...init,
  });

  const contentType = res.headers.get("content-type") || "";
  const hasBody =
    res.status !== 204 &&
    res.status !== 205 &&
    res.headers.get("content-length") !== "0";

  if (!res.ok) {
    const txt = hasBody ? await res.text().catch(() => "") : "";
    throw new Error(`${res.status} ${res.statusText}${txt ? ` — ${txt}` : ""}`);
  }

  if (!hasBody) return null as unknown as T;
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  // fallback if server returned text
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

/* ------------------------------ Auth ------------------------------ */

export function me() {
  return request<{ id: number; email: string; mode?: string }>("/api/auth/me");
}

export function signup(payload: { email: string; password: string }) {
  return request<{ id: number; email: string }>("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return request<{ ok: boolean; access_token: string; token_type: string }>(
    "/api/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
}

export function logout() {
  return request<{ ok: true }>("/api/auth/logout", { method: "POST" });
}

/* ------------------------------ Stripe ------------------------------ */

export function createCheckoutSession(plan: "pro" | "premium" | "edu" = "pro") {
  // This path matches the working endpoint you tested
  return request<{ url: string }>("/api/stripe/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
}

/* ------------------------------ Health ------------------------------ */

export function health() {
  return request<{ ok: boolean }>("/api/healthz");
}

/* --------------------------- Default export ------------------------- */

const api = {
  base: API_BASE,
  // auth
  me,
  signup,
  login,
  logout,
  // stripe
  createCheckoutSession,
  // misc
  health,
};

export default api;

