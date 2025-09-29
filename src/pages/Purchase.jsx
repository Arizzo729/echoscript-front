import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BadgeCheck, Sparkles, GraduationCap, Users, Zap, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const HAS_PAYPAL = Boolean(import.meta.env.VITE_PAYPAL_CLIENT_ID);

// ===== DEV/TEST AUTH BYPASS =====
const DEV_BYPASS_FLAG = import.meta.env.VITE_BYPASS_AUTH_FOR_PAY === "1";
const hasDemoParam = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("demo");
const isLocalHost = typeof window !== "undefined" && (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "::1" ||
  window.location.hostname.endsWith(".ngrok-free.app")
);
const ALLOW_BYPASS = import.meta.env.DEV || isLocalHost;
const DEV_BYPASS_ACTIVE = ALLOW_BYPASS && (DEV_BYPASS_FLAG || hasDemoParam);

// Map plan -> PayPal amount (USD)
const PLAN_AMOUNTS = {
  pro: "9.99",
  premium: "19.99",
  edu: "4.99",
};

const plans = [
  {
    id: "guest",
    icon: <BadgeCheck className="w-6 h-6 text-lime-400" />,
    name: "Guest Plan",
    price: "$0",
    suggested: "Perfect for new users exploring EchoScript.AI",
    features: [
      "60 minutes/month transcription",
      "Ad-supported experience",
      "Save up to 3 transcripts",
      "Basic AI summaries",
      "Community access",
    ],
    bg: "from-zinc-800 to-zinc-900",
    border: "border-lime-400",
    checkout: false,
    link: "/upload",
  },
  {
    id: "pro",
    icon: <Sparkles className="w-6 h-6 text-yellow-400" />,
    name: "Pro Plan",
    price: "$9.99",
    suggested: "Ideal for professionals and content creators",
    features: [
      "1,000 minutes/month transcription",
      "Ad-free experience",
      "Unlimited transcript storage",
      "Advanced summaries & formatting",
      "Priority support",
    ],
    bg: "from-yellow-900 to-yellow-950",
    border: "border-yellow-400",
    checkout: true,
  },
  {
    id: "premium",
    icon: <Zap className="w-6 h-6 text-pink-500" />,
    name: "Premium Plan",
    price: "$19.99",
    suggested: "Best for power users and high-volume needs",
    features: [
      "Unlimited transcription",
      "Faster AI enhancements",
      "Audio export tools",
      "Usage analytics",
      "Early access to new features",
    ],
    bg: "from-pink-800 to-pink-950",
    border: "border-pink-500",
    checkout: true,
  },
  {
    id: "edu",
    icon: <GraduationCap className="w-6 h-6 text-sky-400" />,
    name: "EDU Plan",
    price: "$4.99",
    suggested: "Designed for students, educators, and researchers",
    features: [
      "500 minutes/month",
      "Note formatting tools",
      "Group project support",
      "Educational license",
      "Faster turnaround",
    ],
    bg: "from-sky-900 to-sky-950",
    border: "border-sky-400",
    checkout: true,
  },
  {
    id: "enterprise",
    icon: <Users className="w-6 h-6 text-blue-400" />,
    name: "Enterprise Plan",
    price: "Click below for more details",
    suggested: "For teams, businesses, and large-scale operations",
    features: [
      "Unlimited transcription",
      "Team collaboration tools",
      "Dedicated onboarding & support",
      "Private cloud or on-premise options",
      "Priority API & compute access",
    ],
    bg: "from-zinc-800 to-zinc-950",
    border: "border-blue-400",
    checkout: false,
    link: "/contact",
  },
];

export default function PurchasePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const SHOW_SIGNIN = (!user || !user.email) && !DEV_BYPASS_ACTIVE;

  const handleCheckout = async (planId) => {
    try {
      const res = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId }) // ⬅ unified with Checkout.jsx
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else if (data?.id) {
        window.location.href = `https://checkout.stripe.com/c/pay/${data.id}`;
      } else {
        throw new Error("No checkout URL or session id in response");
      }
    } catch (err) {
      console.error("Stripe checkout error →", err);
      alert(`Payment error. Please try again.\n\nDetails: ${err?.message || err}`);
    }
  };

  return (
    <motion.div
      className="min-h-screen px-4 py-10 md:px-10 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold">🛒 Choose the Perfect EchoScript Plan</h1>
          <p className="text-zinc-400 text-sm">
            {t("secure_checkout", "Secure checkout")} · {t("privacy_respect", "We respect your privacy")}
          </p>
        </div>

        {DEV_BYPASS_ACTIVE && (
          <div className="max-w-3xl mx-auto flex items-center gap-3 rounded-lg border border-yellow-400/40 bg-yellow-500/10 text-yellow-200 p-3">
            <TriangleAlert className="w-5 h-5" />
            <p className="text-sm">
              Dev payment test mode is <strong>ON</strong>: sign-in requirement bypassed. Remove <code>VITE_BYPASS_AUTH_FOR_PAY</code> or <code>?demo=1</code> before production.
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const amount = PLAN_AMOUNTS[plan.id];
            return (
              <div
                key={plan.id}
                className={`bg-gradient-to-br ${plan.bg} border-l-4 ${plan.border} rounded-xl shadow-lg p-6 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {plan.icon}
                    <h2 className="text-xl font-semibold">{plan.name}</h2>
                  </div>
                  <p
                    className={`${plan.id === "enterprise" ? "text-base font-medium text-blue-300" : "text-3xl font-bold text-white"} mb-1`}
                  >
                    {plan.price}
                  </p>
                  <p className="text-sm text-zinc-400 italic mb-4">{plan.suggested}</p>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    {plan.features.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>

                {!plan.checkout ? (
                  <button
                    onClick={() => (plan.id === "guest" ? navigate("/upload") : navigate(plan.link))}
                    className="mt-6 inline-flex items-center justify-center text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    {t("get_started", "Get Started")}
                  </button>
                ) : SHOW_SIGNIN ? (
                  <button
                    onClick={() => navigate("/signin")}
                    className="mt-6 inline-flex items-center justify-center text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    {t("sign_in_to_continue", "Sign in to continue")}
                  </button>
                ) : (
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => handleCheckout(plan.id)}
                      className="w-full inline-flex items-center justify-center text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      {t("pay_with_card_stripe", "Pay with card (Stripe)")}
                    </button>

                    {HAS_PAYPAL ? (
                      <div className="w-full rounded-lg border border-white/10 bg-white/5 p-2">
                        <PayPalScriptProvider
                          options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: "USD" }}
                        >
                          <PayPalButtons
                            style={{ layout: "horizontal", height: 42 }}
                            createOrder={async () => {
                              const r = await fetch(`${API_BASE}/paypal/create-order`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ amount: amount || "9.99", currency: "USD", plan: plan.id }),
                              });
                              if (!r.ok) throw new Error("create-order failed");
                              const data = await r.json();
                              return data.id;
                            }}
                            onApprove={async (data) => {
                              const r = await fetch(`${API_BASE}/paypal/capture-order/${data.orderID}`, { method: "POST" });
                              if (!r.ok) throw new Error("capture failed");
                              alert("PayPal payment captured ✅");
                            }}
                            onError={(err) => {
                              console.error("PayPal error", err);
                              alert("PayPal error — check console.");
                            }}
                          />
                        </PayPalScriptProvider>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400 text-center">
                        Set <code>VITE_PAYPAL_CLIENT_ID</code> to enable PayPal.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full bg-zinc-800/70 border border-zinc-700 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 mt-12 shadow-inner">
          <button
            onClick={() => navigate("/purchase/minutes")}
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-6 py-3 rounded-lg"
          >
            {t("buy_extra_minutes", "Need More Minutes?")}
          </button>
          <p className="text-sm text-zinc-400 text-center md:text-left">
            {t("need_help_choosing", "Need help choosing the right plan?")}{" "}
            <a href="/assistant" className="text-teal-400 underline">
              {t("help_choose_plan", "Ask our AI assistant →")}
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

