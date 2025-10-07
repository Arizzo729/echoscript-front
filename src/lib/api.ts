// src/lib/api.ts
const BASE = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/+$/, "");

type Json = Record<string, unknown>;

async function j<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include", // <- send/receive session cookie
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const ct = res.headers.get("content-type") || "";
  const body = ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) throw new Error(typeof body === "string" ? body : body?.detail || res.statusText);
  return body as T;
}

export default {
  // --- Auth ---
  signup(email: string, password: string) {
    return j("/api/auth/signup", { method: "POST", body: JSON.stringify({ email, password }) });
  },
  login(email: string, password: string, remember = true) {
    return j("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password, remember }) });
  },
  me() {
    return j("/api/auth/me", { method: "GET" });
  },
  logout() {
    return j("/api/auth/logout", { method: "POST" });
  },

  // --- Payments ---
  createCheckoutSession(plan: string) {
    // backend expects { plan: "pro" | "premium" | "edu" } → returns { url }
    return j<{ url: string }>("/api/stripe/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
  },
};
