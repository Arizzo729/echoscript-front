// src/pages/Purchase.jsx
import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

export default function Purchase() {
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [err, setErr] = useState("");

  const startStripeCheckout = async () => {
    setErr("");
    setLoadingStripe(true);
    try {
      const res = await fetch("/api/stripe/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "subscription" }),
      });
      if (!res.ok) throw new Error(`Stripe: ${res.status}`);
      const { url } = await res.json();
      if (!url) throw new Error("Stripe: missing checkout url");
      window.location.href = url;
    } catch (e) {
      setErr(e.message || "Stripe checkout failed");
    } finally {
      setLoadingStripe(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Purchase</h1>
      <p>Choose your payment method:</p>

      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <h3>Stripe (Card)</h3>
          <p>$10 / month (example)</p>
          <button
            onClick={startStripeCheckout}
            disabled={loadingStripe}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              background: "#635bff",
              color: "white",
              cursor: "pointer",
            }}
          >
            {loadingStripe ? "Redirecting…" : "Checkout with Stripe"}
          </button>
        </div>

        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <h3>PayPal</h3>
          <p>One-time $10 (example)</p>

          <PayPalScriptProvider options={{ "client-id": paypalClientId, currency: "USD" }}>
            <PayPalButtons
              style={{ layout: "horizontal" }}
              createOrder={async () => {
                const res = await fetch("/paypal/create-order", { method: "POST" });
                if (!res.ok) {
                  const text = await res.text();
                  throw new Error(`create-order failed: ${text}`);
                }
                const data = await res.json();
                return data.id;
              }}
              onApprove={async (data) => {
                try {
                  const res = await fetch("/paypal/capture-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderID: data.orderID }),
                  });
                  if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`capture failed: ${text}`);
                  }
                  window.location.href = "/checkout?paypal=success";
                } catch (e) {
                  setErr(e.message || "PayPal capture failed");
                }
              }}
              onError={(e) => setErr(e?.message || "PayPal error")}
            />
          </PayPalScriptProvider>
        </div>
      </div>

      {err ? (
        <div style={{ marginTop: 16, color: "#b91c1c", fontWeight: 600 }}>
          {err}
        </div>
      ) : null}
    </div>
  );
}
