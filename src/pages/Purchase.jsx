// ✅ EchoScript.AI — Purchase.jsx (i18n-Enabled, Ultra-Polished, Payment-Redirect Enabled)
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Purchase() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  const pricingPlans = [
    {
      key: "starter",
      price: "$0",
      monthly: true,
      features: t("purchase.plans.starter.features", { returnObjects: true }),
      suggestedFor: t("purchase.plans.starter.suggested"),
      theme: "from-sky-700 to-cyan-800",
      text: "text-white",
      buttonColor: "bg-sky-700 hover:bg-sky-600",
      ring: "ring-1 ring-sky-400/30",
      route: "/signup?plan=starter",
    },
    {
      key: "pro",
      price: "$14",
      monthly: true,
      features: t("purchase.plans.pro.features", { returnObjects: true }),
      suggestedFor: t("purchase.plans.pro.suggested"),
      theme: "from-teal-700 to-emerald-700",
      text: "text-white",
      buttonColor: "bg-teal-700 hover:bg-teal-600",
      ring: "ring-2 ring-teal-400/40",
      route: "/checkout/pro",
    },
    {
      key: "enterprise",
      price: t("purchase.plans.enterprise.price"),
      monthly: false,
      features: t("purchase.plans.enterprise.features", { returnObjects: true }),
      suggestedFor: t("purchase.plans.enterprise.suggested"),
      theme: "from-emerald-700 to-indigo-800",
      text: "text-white",
      buttonColor: "bg-emerald-700 hover:bg-emerald-600",
      ring: "ring-2 ring-indigo-400/30",
      route: "/contact?type=enterprise",
    },
  ];

  const handleSelect = (plan) => {
    setSelected(plan.key);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(plan.route);
    }, 800);
  };

  const PlanCard = ({ plan }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className={`rounded-2xl border border-white/10 p-6 space-y-4 shadow-lg transition bg-gradient-to-br ${plan.theme} ${plan.text} ${plan.ring}`}
    >
      <div>
        <h2 className="text-2xl font-semibold">{t(`purchase.plans.${plan.key}.name`)}</h2>
        <p className="text-sm italic text-teal-200">{plan.suggestedFor}</p>
      </div>

      <p className="text-3xl font-bold">
        {plan.price}
        {plan.monthly && <span className="text-base font-light">{t("purchase.perMonth")}</span>}
      </p>

      <ul className="space-y-2 text-sm text-white/90">
        {plan.features.map((f, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-300" />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => handleSelect(plan)}
        disabled={loading && selected === plan.key}
        className={`w-full text-sm py-2 px-4 rounded-lg font-medium transition-all duration-300 ${plan.buttonColor} border border-white/10 shadow-inner text-white`}
      >
        {loading && selected === plan.key
          ? t("purchase.processing")
          : plan.key === "starter"
          ? t("purchase.free")
          : t("purchase.getStarted")}
      </button>
    </motion.div>
  );

  const Assistant = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-6 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 shadow-md space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-teal-400" />
        <h3 className="text-lg font-semibold text-white">{t("purchase.assistant.title")}</h3>
      </div>
      <p className="text-sm text-zinc-300">{t("purchase.assistant.body")}</p>
      <ul className="text-xs text-zinc-400 list-disc list-inside">
        {t("purchase.assistant.tips", { returnObjects: true }).map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
      <p className="text-sm italic text-blue-400">{t("purchase.assistant.note")}</p>
    </motion.div>
  );

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5 }}
    >
      {showAssistant && (
        <div className="hidden lg:block col-span-1">
          <Assistant />
        </div>
      )}

      <div className="col-span-3 flex flex-col gap-6 lg:flex-row">
        {pricingPlans.map((plan, idx) => (
          <div key={idx} className="w-full sm:max-w-md mx-auto">
            <PlanCard plan={plan} />
          </div>
        ))}
      </div>

      {!showAssistant && (
        <div className="block lg:hidden mt-6 text-center">
          <button
            onClick={() => setShowAssistant(true)}
            className="text-sm text-teal-400 hover:underline"
          >
            {t("purchase.assistant.show")}
          </button>
        </div>
      )}

      <div className="col-span-full mt-12 text-sm text-zinc-400 text-center flex flex-col gap-3 items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          {t("purchase.footer.secure")}
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-400" />
          {t("purchase.footer.privacy")}
        </div>
        <button
          onClick={() => setShowAssistant(!showAssistant)}
          className="mt-2 text-xs hover:underline flex items-center gap-1 text-teal-400"
        >
          <HelpCircle className="w-3 h-3" />
          {showAssistant ? t("purchase.assistant.hide") : t("purchase.assistant.show")}
        </button>
      </div>
    </motion.div>
  );
}



