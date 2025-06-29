// ✅ EchoScript.AI — Payment Success Page
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Success() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/account");
    }, 7000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      className="max-w-md mx-auto px-6 py-12 text-center text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-2">{t("success.title", "Payment Successful!")}</h1>
      <p className="text-zinc-400 mb-6">
        {t("success.message", "Thank you! Your payment was processed successfully.")}
      </p>

      <button
        onClick={() => navigate("/account")}
        className="inline-flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-white transition"
      >
        <Home className="w-4 h-4" />
        {t("success.cta", "Go to Dashboard")}
      </button>

      <p className="text-xs text-zinc-600 mt-6">
        {t("success.redirect_note", "You’ll be redirected shortly...")}
      </p>
    </motion.div>
  );
}

