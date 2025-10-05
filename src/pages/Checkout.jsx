import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Loader2, CreditCard, ShieldCheck, ArrowLeftCircle } from "lucide-react";
import api from "../lib/api"; // ⬅️ use the same API client

const planDetails = {
  pro: {
    nameKey: "purchase.plans.pro.name",
    price: "$9.99",
    featuresKey: "purchase.plans.pro.features",
    color: "teal",
  },
  enterprise: {
    nameKey: "purchase.plans.enterprise.name",
    price: "Custom",
    featuresKey: "purchase.plans.enterprise.features",
    color: "purple",
  },
};

const colorMap = {
  teal: { bg: "bg-teal-600", hover: "hover:bg-teal-500" },
  purple: { bg: "bg-purple-600", hover: "hover:bg-purple-500" },
};

export default function Checkout() {
  const { t } = useTranslation();
  const { plan } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedPlan = useMemo(() => planDetails[plan], [plan]);

  useEffect(() => {
    if (!selectedPlan) navigate("/purchase");
  }, [selectedPlan, navigate]);

  const handlePayment = async () => {
    if (plan === "enterprise") return navigate("/contact");

    setLoading(true);
    setError(null);

    try {
      // ✅ backend expects { plan: "pro" } and returns { url }
      const { url } = await api.createCheckoutSession(plan);
      if (!url) throw new Error("No Stripe session URL returned");
      window.location.href = url;
    } catch (err) {
      setError(
        t("checkout.error") ||
          `Something went wrong during checkout.\n${String(err?.message || err)}`
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
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/purchase")}
          className="text-sm text-teal-400 hover:underline flex items-center gap-1 mb-4"
        >
          <ArrowLeftCircle className="w-4 h-4" />
          {t("checkout.back")}
        </button>

        <h1 className="text-3xl font-bold text-center text-white mb-5">
          {t("checkout.title")}
        </h1>

        <div className="rounded-2xl border border-zinc-700 shadow-xl bg-zinc-900 p-7 space-y-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t(selectedPlan?.nameKey || "")}</h2>
            <span className="text-lg font-bold">{selectedPlan?.price || ""}</span>
          </div>

          <ul className="list-disc list-inside text-base text-zinc-300 space-y-1">
            {(t(selectedPlan?.featuresKey || "", { returnObjects: true }) || []).map((feat, i) => (
              <li key={i}>{feat}</li>
            ))}
          </ul>

          {error && (
            <div className="text-red-400 text-sm font-medium whitespace-pre-wrap">{error}</div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-3 px-4 text-base rounded-xl font-bold transition-colors focus-visible:ring-2 focus-visible:ring-teal-400 
              ${color.bg} ${color.hover} ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                {t("checkout.processing")}
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                {plan === "enterprise" ? t("checkout.contactUs") : t("checkout.payNow")}
              </>
            )}
          </button>

          <div className="text-xs text-center text-zinc-500 mt-3">
            <ShieldCheck className="inline w-4 h-4 mr-1 text-green-400" />
            {t("checkout.secure")}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
