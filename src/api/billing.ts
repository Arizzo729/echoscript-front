// src/api/billing.ts
export async function stripeCreateCheckout(plan: string) {
  const res = await fetch("/api/billing/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) throw new Error("Checkout failed");
  const { url } = await res.json();
  window.location.href = url;
}
