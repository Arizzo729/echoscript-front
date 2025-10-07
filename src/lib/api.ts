// src/lib/api.js
const API_BASE =
  (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '') ||
  'https://your-app.up.railway.app'; // fallback production API

async function j(path, opts = {}) {
  const r = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!r.ok) throw new Error(await r.text().catch(() => `${r.status} ${r.statusText}`));
  const ct = r.headers.get('content-type') || '';
  return ct.includes('application/json') ? r.json() : r.text();
}

export const api = {
  health: () => j('/api/healthz', { method: 'GET' }),
  stripeCreateSession: (planOrPrice) =>
    j('/api/stripe/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(
        typeof planOrPrice === 'string'
          ? { plan: planOrPrice }
          : planOrPrice
      ),
    }),
  stripeSession: (session_id) =>
    j(`/api/stripe/checkout/session?session_id=${encodeURIComponent(session_id)}`, { method: 'GET' }),
  // add any other endpoints here...
};
