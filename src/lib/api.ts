const API = import.meta.env.VITE_API_BASE || "https://api.echoscript.ai";

function authHeader() {
  const token = localStorage.getItem("auth_token"); // store this after login
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function api(path: string, init: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...authHeader(),
    ...(init.headers || {}),
  };
  const res = await fetch(`${API}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }
  return res;
}

export async function login(email: string, password: string) {
  const r = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await r.json();
  localStorage.setItem("auth_token", data.access_token);
  return data;
}

export async function signup(email: string, password: string) {
  const r = await api("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return r.json();
}

export async function createCheckout(plan: "pro" | "premium" | "edu" = "pro") {
  const r = await api("/api/stripe/create-checkout-session", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
  return r.json();
}
