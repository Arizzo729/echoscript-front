import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Zap, Sparkles } from "lucide-react";

export default function Purchase() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["30 mins/month", "Basic transcript", "No AI cleanup"],
    },
    {
      name: "Pro",
      price: billingCycle === "monthly" ? "$19/mo" : "$190/year",
      features: [
        "Unlimited uploads",
        "AI cleanup & summary",
        "Priority support",
        "Early feature access",
      ],
      highlight: true,
    },
  ];

  return (
    <motion.div
      className="p-8 max-w-6xl mx-auto space-y-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-zinc-800 dark:text-white">Choose Your Plan</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Flexible pricing tailored for creators, teams, and pros.</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center gap-4">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium border ${
            billingCycle === "monthly"
              ? "bg-teal-600 text-white border-teal-600"
              : "text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-600"
          }`}
          onClick={() => setBillingCycle("monthly")}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium border ${
            billingCycle === "yearly"
              ? "bg-teal-600 text-white border-teal-600"
              : "text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-600"
          }`}
          onClick={() => setBillingCycle("yearly")}
        >
          Yearly (2 months free)
        </button>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            className={`p-6 rounded-2xl shadow-md border transition-all duration-300 ${
              plan.highlight
                ? "border-teal-600 bg-gradient-to-br from-teal-600 to-teal-700 text-white"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
            }`}
            whileHover={{ scale: 1.03 }}
          >
            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <p className="text-3xl font-extrabold mb-4">{plan.price}</p>
            <ul className="space-y-2 text-sm mb-6">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  {feat}
                </li>
              ))}
            </ul>
            <button className="w-full py-2 px-4 rounded-md font-medium transition-all bg-white text-teal-700 hover:bg-teal-100 dark:bg-zinc-100 dark:hover:bg-zinc-200">
              {plan.highlight ? (
                <span className="flex items-center justify-center gap-2">
                  <Zap size={16} /> Upgrade Now
                </span>
              ) : (
                "Stay on Free"
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Testimonials */}
      <motion.div
        className="mt-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <h3 className="text-2xl font-bold text-center mb-6 text-zinc-800 dark:text-white">What users are saying</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-zinc-600 dark:text-zinc-300">
          <blockquote className="bg-white dark:bg-zinc-900 p-4 rounded-lg border dark:border-zinc-700 shadow">
            “EchoScript helped us transcribe interviews flawlessly. We saved hours every week.”
            <footer className="mt-2 text-xs text-right">— Maya L., Podcaster</footer>
          </blockquote>
          <blockquote className="bg-white dark:bg-zinc-900 p-4 rounded-lg border dark:border-zinc-700 shadow">
            “The AI cleanup is phenomenal. No more filler words, and it understands accents perfectly.”
            <footer className="mt-2 text-xs text-right">— Jordan B., Startup Founder</footer>
          </blockquote>
          <blockquote className="bg-white dark:bg-zinc-900 p-4 rounded-lg border dark:border-zinc-700 shadow">
            “I love the free plan but I upgraded to Pro after seeing the speed + quality. Worth it.”
            <footer className="mt-2 text-xs text-right">— Priya K., Creator</footer>
          </blockquote>
        </div>
      </motion.div>
    </motion.div>
  );
}
