import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BadgeCheck, Sparkles, GraduationCap, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  const isGuest = !user || !user.email;

  const handleCheckout = async (planId) => {
    try {
      const res = await fetch(`/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Payment error. Please try again.");
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-gradient-to-br ${plan.bg} border-l-4 ${plan.border} rounded-xl shadow-lg p-6 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {plan.icon}
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                </div>
                <p className={`${plan.id === "enterprise" ? "text-base font-medium text-blue-300" : "text-3xl font-bold text-white"} mb-1`}>
                  {plan.price}
                </p>
                <p className="text-sm text-zinc-400 italic mb-4">{plan.suggested}</p>
                <ul className="space-y-2 text-sm text-zinc-300">
                  {plan.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => {
                  if (plan.id === "guest") return navigate("/upload");
                  if (isGuest) return navigate("/signin");
                  return plan.checkout ? handleCheckout(plan.id) : navigate(plan.link);
                }}
                className="mt-6 inline-flex items-center justify-center text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
              >
                {t("get_started", "Get Started")}
              </button>
            </div>
          ))}
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
