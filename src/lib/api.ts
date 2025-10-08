// src/lib/api.ts
// Frontend API client (Vite)
// - Proxies through Netlify to your Railway API when using relative "/api/*"
// - Keeps a default export for existing imports (AuthContext, pages, etc.)

type PlanId = "pro" | "premium" | "edu";

type Json =
  | null
  | string
  | number
  | boolean
  | Json[]
  | { [k: string]: Json | undefined };

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString().trim() || "/api";

async function http<T = Json>(
  path: string,
  init?: RequestInit & { expectText?: boolean }
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, init);

  // Handle empty body / 204
  const hasBody =
    res.headers.get("content-length") !== "0" &&
    res.status !== 204 &&
    res.status !== 205;

  if (!res.ok) {
    const txt = hasBody ? await res.text().catch(() => "") : "";
    throw new Error(`${res.status} ${res.statusText}${txt ? ` — ${txt}` : ""}`);
  }

  if (!hasBody) return null as unknown as T;
  if (init?.expectText) return (await res.text()) as unknown as T;

  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    // If the server returned plain text but caller expected JSON
    return text as unknown as T;
  }
}

/* ----------------------- Health & Debug helpers ----------------------- */

async function health(): Promise<{ ok: boolean } | number> {
  // Some deployments just return 200 with no body
  try {
    const status = await fetch(`${API_BASE}/healthz`).then((r) => r.status);
    return status === 200 ? { ok: true } : status;
  } catch {
    return { ok: false };
  }
}

async function getStripePriceMap(): Promise<Record<string, string>> {
  // e.g. { pro: 'price_...', premium: 'price_...', edu: 'price_...' }
  return http<Record<string, string>>("/stripe/_debug-prices");
}

/* ---------------------------- Stripe flows ---------------------------- */

async function createCheckoutSession(
  plan: PlanId
): Promise<{ url: string }> {
  // Matches backend router: prefix `/api/stripe/checkout` + POST `/create`
  // (Your previous 502s were from calling `/api/stripe/create-checkout-session`)
  return http<{ url: string }>("/stripe/checkout/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
}

/* ---------------------------- PayPal flows ---------------------------- */

async function createPayPalOrder(args: {
  amount?: string; // optional if server derives from plan
  currency?: string; // default "USD" on server
  plan?: PlanId;
}): Promise<{ id: string }> {
  return http<{ id: string }>("/paypal/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
}

async function capturePayPalOrder(orderID: string): Promise<Json> {
  return http<Json>(`/paypal/capture-order/${orderID}`, {
    method: "POST",
  });
}

/* ------------------------------ Exports ------------------------------ */

export {
  API_BASE,
  health,
  getStripePriceMap,
  createCheckoutSession,
  createPayPalOrder,
  capturePayPalOrder,
};

// Keep default export for existing imports across the app
const api = {
  API_BASE,
  health,
  getStripePriceMap,
  createCheckoutSession,
  createPayPalOrder,
  capturePayPalOrder,
};

export default api;
