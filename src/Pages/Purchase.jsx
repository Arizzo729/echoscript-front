import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Zap } from "lucide-react";

export default function Purchase() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["30 mins/month", "Basic transcript", "No AI cleanup"],
    },
    {
      name: "Pro",
      price: "$19/mo",
      features: ["Unlimited uploads", "AI cleanup & summary", "Priority support"],
      highlight: true,
    },
  ];

  return (
    <motion.div
      className="p-8 max-w-5xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Choose a Plan</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            className={`p-6 border rounded-xl bg-white dark:bg-gray-900 ${
              plan.highlight ? "border-primary shadow-lg" : "border-gray-300 dark:border-gray-700"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              {plan.name}
            </h2>
            <p className="text-2xl font-bold text-primary mb-4">{plan.price}</p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {feat}
                </li>
              ))}
            </ul>
            <button className="w-full bg-primary hover:bg-primary-light text-white py-2 rounded-md">
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
    </motion.div>
  );
}
