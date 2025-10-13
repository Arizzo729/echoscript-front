<<<<<<< Updated upstream
// src/pages/Checkout.jsx
import React, { useEffect, useState } from "react";

function useQuery() {
  const params = new URLSearchParams(window.location.search);
  return {
    success: params.get("success"),
    canceled: params.get("canceled"),
    session_id: params.get("session_id"),
    paypal: params.get("paypal"),
  };
}

export default function Checkout() {
  const [status, setStatus] = useState("Checking…");
  const [details, setDetails] = useState(null);
  const q = useQuery();

  useEffect(() => {
    const run = async () => {
      if (q.paypal === "success") {
        setStatus("PayPal payment captured ✅");
        return;
      }
      if (q.success === "1" && q.session_id) {
        try {
          const res = await fetch(`/api/stripe/checkout/session?session_id=${encodeURIComponent(q.session_id)}`);
          if (res.ok) {
            const data = await res.json();
            setDetails(data);
            setStatus("Stripe checkout complete ✅");
          } else {
            setStatus("Completed (unable to verify session)");
          }
        } catch {
          setStatus("Completed (unable to verify session)");
        }
        return;
      }
      if (q.canceled === "1") {
        setStatus("Checkout canceled.");
        return;
      }
      setStatus("Ready.");
    };
    run();
  }, []); // eslint-disable-line

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Checkout</h1>
      <p>{status}</p>
      {details ? (
        <pre
          style={{
            background: "#0b1220",
            color: "#cbd5e1",
            padding: 16,
            borderRadius: 12,
            overflowX: "auto",
          }}
        >
{JSON.stringify(details, null, 2)}
        </pre>
      ) : null}
      <a href="/purchase" style={{ display: "inline-block", marginTop: 16 }}>
        ← Back to purchase
      </a>
    </div>
  );
}
=======
// ✅ EchoScript.AI – Updated Checkout Page with Stripe Integration & Secure Paywall
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Loader2,
  Lock,
  CreditCard,
  ShieldCheck,
  ArrowLeftCircle,
} from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const planDetails = {
  pro: {
    nameKey: "purchase.plans.pro.name",
    price: "$14.00",
    featuresKey: "purchase.plans.pro.features",
    color: "teal",
    stripeId: "price_12345", // Replace with your live Stripe price ID
  },
  enterprise: {
    nameKey: "purchase.plans.enterprise.name",
    price: "Custom",
    featuresKey: "purchase.plans.enterprise.features",
    color: "purple",
    stripeId: null,
  },
};

export default function Checkout() {
  const { t } = useTranslation();
  const { plan } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const selectedPlan = planDetails[plan];

  useEffect(() => {
    if (!selectedPlan) navigate("/purchase");
  }, [plan]);

  const handlePayment = async () => {
    if (plan === "enterprise") return navigate("/contact");

    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan_id: plan }),
      });

      const { url, error: apiError } = await res.json();

      if (apiError) throw new Error(apiError);
      if (!url) throw new Error("No Stripe session URL returned");

      window.location.href = url;
    } catch (err) {
      setError(
        t("checkout.error") ||
          "Something went wrong during checkout. Please try again."
      );
      console.error("[Checkout Error]", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto px-6 py-12 space-y-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={() => navigate("/purchase")}
        className="text-sm text-teal-400 hover:underline flex items-center gap-1 mb-2"
      >
        <ArrowLeftCircle className="w-4 h-4" />
        {t("checkout.back")}
      </button>

      <h1 className="text-3xl font-bold text-center text-white">
        {t("checkout.title")}
      </h1>

      <div className="rounded-xl border border-zinc-700 shadow-xl bg-zinc-900 p-6 space-y-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {t(selectedPlan.nameKey)}
          </h2>
          <span className="text-lg font-bold">{selectedPlan.price}</span>
        </div>

        <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
          {t(selectedPlan.featuresKey, { returnObjects: true }).map(
            (feat, i) => (
              <li key={i}>{feat}</li>
            )
          )}
        </ul>

        {error && (
          <div className="text-red-400 text-sm font-medium">{error}</div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 py-2 px-4 rounded-lg transition text-white font-semibold bg-${selectedPlan.color}-600 hover:bg-${selectedPlan.color}-500`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              {t("checkout.processing")}
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              {plan === "enterprise"
                ? t("checkout.contactUs")
                : t("checkout.payNow")}
            </>
          )}
        </button>

        <div className="text-xs text-center text-zinc-500 mt-4">
          <ShieldCheck className="inline w-4 h-4 mr-1 text-green-400" />
          {t("checkout.secure")}
        </div>
      </div>
    </motion.div>
  );
}
>>>>>>> Stashed changes
