// ✅ EchoScript.AI — Checkout.jsx (Polished Payment Page w/ Stripe Placeholder)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Loader2, Lock, CreditCard, ShieldCheck } from "lucide-react";

const planDetails = {
  pro: {
    nameKey: "purchase.plans.pro.name",
    price: "$14.00",
    featuresKey: "purchase.plans.pro.features",
    color: "teal-600",
  },
};

export default function Checkout() {
  const { t } = useTranslation();
  const { plan } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const selectedPlan = planDetails[plan];

  useEffect(() => {
    if (!selectedPlan) navigate("/purchase");
  }, [plan]);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(t("checkout.success"));
      navigate("/account");
    }, 2000);
  };

  return (
    <motion.div
      className="max-w-xl mx-auto px-6 py-12 space-y-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center text-zinc-900 dark:text-white">
        {t("checkout.title")}
      </h1>

      <div className={`rounded-xl border border-zinc-700 shadow-xl bg-zinc-900 p-6 space-y-4 text-white`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t(selectedPlan.nameKey)}</h2>
          <span className="text-lg font-bold">{selectedPlan.price}</span>
        </div>
        <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
          {t(selectedPlan.featuresKey, { returnObjects: true }).map((feat, i) => (
            <li key={i}>{feat}</li>
          ))}
        </ul>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 py-2 px-4 rounded-lg bg-${selectedPlan.color} hover:bg-${selectedPlan.color.replace("600", "500")} transition text-white font-semibold`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              {t("checkout.processing")}
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              {t("checkout.payNow")}
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
