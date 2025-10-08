// src/lib/api.ts
// Minimal, safe API client. Uses absolute URL so Netlify proxy issues don't matter.

const raw =
  import.meta.env.VITE_API_BASE ??
  import.meta.env.VITE_API_URL ??
  "https://api.echoscript.ai";

const API_BASE = String(raw).replace(/\/+$/, ""); // trim trailing slash

async function asJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
  }
  return (await res.json()) as T;
}

function get<T>(path: string) {
  return fetch(`${API_BASE}${path}`).then(asJson<T>);
}

function post<T>(path: string, body?: unknown) {
  return fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  }).then(asJson<T>);
}

export type StripeCheckoutRes = { url: string };

export const api = {
  health: () => get<{ status: "ok" }>("/api/healthz"),
  stripeDebugPrices: () => get<Record<string, string>>("/api/stripe/_debug-prices"),
  stripeCreateCheckout: (plan: string) =>
    post<StripeCheckoutRes>("/api/stripe/create-checkout-session", { plan }),

  // Keep PayPal server endpoints available for future, but **do not** use on the client
  // until we re-introduce them without leaking the client ID to the bundle.
  // paypalCreateOrder: (payload: { amount: string; currency: string; plan: string }) =>
  //   post<{ id: string }>("/api/paypal/create-order", payload),
  // paypalCapture: (orderID: string) => post<{ status: string }>(`/api/paypal/capture-order/${orderID}`),
};

export default api;
