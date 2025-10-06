// src/lib/payments.js (or wherever your click handler lives)
export async function startCheckout(plan = 'pro') {
  const res = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan })
  });

  // If backend returns an error JSON, surface it
  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch { /* leave as {} */ }

  if (!res.ok) {
    const msg = data?.detail || data?.error || `Checkout failed (HTTP ${res.status})`;
    throw new Error(msg);
  }

  // Success -> redirect to Stripe Checkout
  if (data?.url) {
    window.location.assign(data.url); // or window.location.href = data.url
    return;
  }

  throw new Error('Checkout failed: missing URL from server');
}
