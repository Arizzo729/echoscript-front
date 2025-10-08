// Centralized API client using VITE_API_BASE
const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function api(
  path: string,
  init: RequestInit = {}
): Promise<{ ok: boolean; status: number; body: any }> {
  if (!API_BASE) throw new Error("VITE_API_BASE is not set");
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...init,
  });
  const ct = res.headers.get("content-type") || "";
  const body = ct.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);
  return { ok: res.ok, status: res.status, body };
}

// Example usage:
// const me = await api("/api/auth/me");
// const session = await api("/api/stripe/create-checkout-session", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ plan: "pro" }),
// });

