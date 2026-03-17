// ✅ EchoScript.AI – Upgraded Checkout Page with Stripe Integration & Secure Paywall
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import * as api from "../lib/api";
import {
  Loader2,
  Lock,
  CreditCard,
  ShieldCheck,
  ArrowLeftCircle,
  ShoppingCart,
  Gift,
  Trash2
} from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const planDetails = {
  pro: {
    nameKey: "purchase.plans.pro.name",
    price: "$14.99",
    minutesNumber: 160,
    minutesKey: "checkout.pro_minutes",
    breakdownKey: "checkout.pro_breakdown",
    featuresKey: "purchase.plans.pro.features",
    color: "teal",
    stripeId: "price_12345",
  },
  premium: {
    nameKey: "purchase.plans.premium.name",
    price: "$29.99",
    minutesNumber: 320,
    minutesKey: "checkout.premium_minutes",
    breakdownKey: "checkout.premium_breakdown",
    featuresKey: "purchase.plans.premium.features",
    color: "teal",
    stripeId: "price_67890",
  },
  ultra: {
    nameKey: "purchase.plans.ultra.name",
    price: "$59.99",
    minutesNumber: 740,
    minutesKey: "checkout.ultra_minutes",
    breakdownKey: "checkout.ultra_breakdown",
    featuresKey: "purchase.plans.ultra.features",
    color: "teal",
    stripeId: "price_ultra",
  },
};

const colorMap = {
  teal: {
    bg: "bg-teal-600",
    hover: "hover:bg-teal-500",
    border: "border-teal-600",
  },
  purple: {
    bg: "bg-purple-600",
    hover: "hover:bg-purple-500",
    border: "border-purple-600",
  },
};

export default function Checkout() {
  const { t } = useTranslation();
  const { plan } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGift, setIsGift] = useState(false);
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
      const res = await fetch(api.SERVER_URL + "/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan_id: plan, is_gift: isGift }),
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

  const color = colorMap[selectedPlan?.color || "teal"];

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 px-2 sm:px-0 py-8"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-2xl space-y-6">
        <button
          onClick={() => navigate("/purchase")}
          className="text-sm text-teal-400 hover:underline flex items-center gap-1 mb-4"
        >
          <ArrowLeftCircle className="w-4 h-4" />
          {t("checkout.back", "Back to Purchase")}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {Object.entries(planDetails).map(([key, details]) => (
             <div key={key} className={`p-6 rounded-2xl border-2 ${plan === key ? 'border-teal-500 bg-teal-500/5' : 'border-zinc-800 bg-zinc-900'} text-center space-y-2`}>
                <div className="text-2xl font-bold">{details.price}</div>
                <div className="text-teal-400 font-medium">{t(details.minutesKey)} <span className="text-zinc-500 text-xs">{t(details.breakdownKey)}</span></div>
                <div className="text-teal-500 text-2xl">+</div>
             </div>
           ))}
        </div>

        <div className="rounded-2xl border border-zinc-700 shadow-xl bg-zinc-900 overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-teal-400 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              {t("checkout.cart", "Cart")}
            </h2>
            <span className="text-zinc-500 text-sm">{selectedPlan ? t(selectedPlan.minutesKey) : t("checkout.total_minutes_default")}</span>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="space-y-1">
              {selectedPlan ? (
                  <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-teal-400">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-zinc-300 font-bold">{t(selectedPlan.minutesKey)}</p>
                      <p className="text-zinc-500 text-sm">{selectedPlan.price}</p>
                    </div>
                  </div>
                  <button className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-teal-400">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-zinc-300 font-bold">{t("checkout.pro_minutes")}</p>
                        <p className="text-zinc-500 text-sm">$14.99</p>
                      </div>
                    </div>
                    <button className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-teal-400">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-zinc-300 font-bold">{t("checkout.premium_minutes")}</p>
                        <p className="text-zinc-500 text-sm">$29.99</p>
                      </div>
                    </div>
                    <button className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">{t("checkout.total_minutes", "Total Minutes:")}</span>
                <span className="font-bold text-white text-xl">{selectedPlan ? selectedPlan.minutesNumber : 480}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">{t("checkout.total_cost", "Total Cost:")}</span>
                <span className="font-bold text-white text-xl">{selectedPlan ? selectedPlan.price : t("checkout.total_cost_default")}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="gift-option"
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-teal-500 focus:ring-teal-500"
              />
              <label htmlFor="gift-option" className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                <Gift className="w-4 h-4 text-teal-400" />
                {t("checkout.gift_option", "Gift")}
              </label>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-teal-900/20"
            >
              {loading ? t("checkout.processing", "Processing...") : t("checkout.checkout_btn", "Checkout")}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
