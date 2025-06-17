import React, { useState } from "react";
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
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  const pricingPlans = [
    {
      key: "guest",
      name: "Guest Plan",
      price: "$0",
      monthly: true,
      suggestedFor: "Casual users, first-time visitors",
      features: [
        "60 minutes/month transcription",
        "Ad-supported experience",
        "Save up to 3 transcripts",
        "Basic AI summaries",
        "Community access"
      ],
      theme: "from-zinc-700 to-slate-800",
      text: "text-white",
      buttonColor: "bg-zinc-700 hover:bg-zinc-600",
      ring: "ring-1 ring-zinc-400/30",
      route: "/signup?plan=guest",
    },
    {
      key: "pro",
      name: "Pro Plan",
      price: "$9.99",
      monthly: true,
      suggestedFor: "Content creators, professionals",
      features: [
        "1,000 minutes/month transcription",
        "Ad-free experience",
        "Unlimited transcript storage",
        "Advanced summaries & formatting",
        "Priority support"
      ],
      theme: "from-teal-700 to-emerald-700",
      text: "text-white",
      buttonColor: "bg-teal-700 hover:bg-teal-600",
      ring: "ring-2 ring-teal-400/40",
      route: "/checkout/pro",
    },
    {
      key: "enterprise",
      name: "Enterprise Plan",
      price: "Custom Pricing",
      monthly: false,
      suggestedFor: "Teams, agencies, business use",
      features: [
        "Unlimited transcription limits",
        "Team collaboration & admin analytics",
        "Dedicated support & onboarding",
        "Private cloud or on-prem options",
        "Priority API & compute access"
      ],
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
        <h2 className="text-2xl font-semibold">{plan.name}</h2>
        <p className="text-sm italic text-teal-200">{plan.suggestedFor}</p>
      </div>

      <p className="text-3xl font-bold">
        {plan.price}
        {plan.monthly && <span className="text-base font-light"> / month</span>}
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
          ? "Redirecting..."
          : plan.key === "enterprise"
          ? "Contact Us"
          : "Get Started"}
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
        <h3 className="text-lg font-semibold text-white">Need help choosing a plan?</h3>
      </div>
      <p className="text-sm text-zinc-300">
        EchoScript adapts to your needs. Here's how to pick:
      </p>
      <ul className="text-xs text-zinc-400 list-disc list-inside">
        <li>Guests can try the platform without signing up.</li>
        <li>Pro is ideal for professionals and creators.</li>
        <li>Enterprise offers custom infrastructure for teams.</li>
      </ul>
      <p className="text-sm italic text-blue-400">
        Still unsure? Reach out and we’ll guide you.
      </p>
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
        {pricingPlans.map((plan) => (
          <div key={plan.key} className="w-full sm:max-w-md mx-auto">
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
            Help me choose a plan
          </button>
        </div>
      )}

      <div className="col-span-full mt-12 text-sm text-zinc-400 text-center flex flex-col gap-3 items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          Secure checkout & payment protection
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-400" />
          We respect your privacy — no data sold
        </div>
        <button
          onClick={() => setShowAssistant(!showAssistant)}
          className="mt-2 text-xs hover:underline flex items-center gap-1 text-teal-400"
        >
          <HelpCircle className="w-3 h-3" />
          {showAssistant ? "Hide Help" : "Need Help Choosing?"}
        </button>
      </div>
    </motion.div>
  );
}




