// src/api/billing.ts
import { API_BASE } from "@/lib/apiBase";

async function tryJSON(res: Response) {
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : { ok: res.ok, status: res.status, text: await res.text() };
}

/** Canonical name in your codebase */
export async function createCheckout(plan: string) {
  // Try a couple of likely endpoints so the UI works regardless of backend naming
  const endpoints = [
    `${API_BASE}/billing/create-checkout-session`,
    `${API_BASE}/billing/checkout`,
  ];
  for (const url of endpoints) {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ plan }),
    });
    if (r.ok) return tryJSON(r);
  }
  throw new Error("No billing endpoint responded OK");
}

/** Alias to match components expecting 'stripeCreateCheckout' */
export const stripeCreateCheckout = createCheckout;
