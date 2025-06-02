import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import Button from "../components/ui/Button";

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    monthly: true,
    features: [
      "10 minutes/month transcription",
      "Basic audio upload",
      "Light GPT cleanup",
    ],
    suggestedFor: "New users or personal use",
  },
  {
    name: "Pro",
    price: "$14",
    monthly: true,
    features: [
      "1,000 minutes/month",
      "Priority queue processing",
      "Advanced GPT enhancement",
      "Export to PDF & DOCX",
    ],
    suggestedFor: "Podcasters, teams, businesses",
  },
  {
    name: "Enterprise",
    price: "Custom",
    monthly: false,
    features: [
      "Unlimited transcription",
      "Custom tools & branding",
      "Slack & Teams integration",
      "Analytics dashboard",
    ],
    suggestedFor: "Organizations & heavy users",
  },
];

export default function Purchase() {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAssistant, setShowAssistant] = useState(true);

  const handleSelect = (plan) => {
    setSelected(plan.name);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Redirecting to checkout for: ${plan.name}`);
    }, 1500);
  };

  const PlanCard = ({ plan }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`flex-1 rounded-2xl border p-6 space-y-4 shadow-lg transition ${
        plan.name === "Pro"
          ? "bg-gradient-to-br from-teal-600 to-blue-600 text-white border-none"
          : "bg-zinc-900 border border-zinc-800 text-white"
      }`}
    >
      <div>
        <h2 className="text-2xl font-semibold">{plan.name}</h2>
        <p className="text-sm italic text-teal-300">{plan.suggestedFor}</p>
      </div>

      <p className="text-3xl font-bold text-teal-400">
        {plan.price}
        {plan.monthly && <span className="text-base font-light">/mo</span>}
      </p>

      <ul className="space-y-2 text-sm text-zinc-300">
        {plan.features.map((f, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            {f}
          </li>
        ))}
      </ul>

      <Button
        onClick={() => handleSelect(plan)}
        loading={loading && selected === plan.name}
        variant={plan.name === "Pro" ? "secondary" : "primary"}
        size="md"
        className="w-full mt-2"
      >
        {loading && selected === plan.name
          ? "Processing..."
          : plan.name === "Starter"
          ? "Use for Free"
          : "Get Started"}
      </Button>
    </motion.div>
  );

  const Assistant = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-10 rounded-2xl p-6 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 shadow-md space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-teal-400" />
        <h3 className="text-lg font-semibold text-white">AI Plan Assistant</h3>
      </div>
      <p className="text-sm text-zinc-300">
        Not sure which plan to pick? Most users start with{" "}
        <strong className="text-teal-300">Pro</strong> for advanced features and scale to Enterprise.
      </p>
      <ul className="text-xs text-zinc-400 list-disc list-inside">
        <li><strong>Starter</strong> is perfect for testing or students</li>
        <li><strong>Pro</strong> unlocks full AI tools and exports</li>
        <li><strong>Enterprise</strong> includes API, branding, and admin analytics</li>
      </ul>
      <p className="text-sm italic text-blue-400">
        Tip: You can upgrade, downgrade, or cancel anytime.
      </p>
    </motion.div>
  );

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-4 gap-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5 }}
    >
      {/* Assistant */}
      {showAssistant && (
        <div className="hidden lg:block col-span-1">
          <Assistant />
        </div>
      )}

      {/* Plans */}
      <div className="col-span-3 flex flex-col lg:flex-row gap-6">
        {pricingPlans.map((plan, idx) => (
          <PlanCard key={idx} plan={plan} />
        ))}
      </div>

      {/* Notes */}
      <div className="col-span-full mt-12 text-sm text-zinc-400 text-center flex flex-col gap-3 items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          Secure Stripe checkout — encrypted & trusted
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-400" />
          No card data stored — cancel anytime from Dashboard
        </div>
        <button
          onClick={() => setShowAssistant(!showAssistant)}
          className="mt-2 text-xs hover:underline flex items-center gap-1 text-teal-400"
        >
          <HelpCircle className="w-3 h-3" />
          {showAssistant ? "Hide Assistant" : "Show Plan Assistant"}
        </button>
      </div>
    </motion.div>
  );
}

