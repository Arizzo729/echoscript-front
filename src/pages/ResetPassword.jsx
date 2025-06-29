import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sendCode = async () => {
    setError("");
    const res = await fetch("/api/auth/send-reset-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = await res.json();
    if (result.status === "ok") {
      setStep(2);
      setMessage(t("reset.code_sent"));
    } else {
      setError(result.error || t("reset.email_not_found"));
    }
  };

  const verifyCode = async () => {
    setError("");
    const res = await fetch("/api/auth/verify-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, new_password: newPassword }),
    });
    const result = await res.json();
    if (result.status === "ok") {
      setMessage(t("reset.success"));
      setStep(3);
    } else {
      setError(t("reset.failure"));
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 px-6"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-xl bg-zinc-900 border border-zinc-700">
        <h1 className="text-3xl font-bold text-center text-white">
          {t("reset.title")}
        </h1>
        <p className="text-sm text-center text-zinc-400">
          {t("reset.subtitle")}
        </p>

        {error && (
          <div className="bg-red-500/10 text-red-300 px-4 py-2 rounded-md text-sm text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-500/10 text-green-300 px-4 py-2 rounded-md text-sm text-center">
            {message}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                  {t("reset.email")}
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("reset.email_placeholder")}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <Mail className="absolute right-3 top-2.5 w-5 h-5 text-zinc-400" />
                </div>
              </div>
              <button
                onClick={sendCode}
                className="w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-md"
              >
                {t("reset.send_code")}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="code" className="text-sm font-medium text-zinc-300">
                  {t("reset.code")}
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t("reset.code_placeholder")}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="newPass" className="text-sm font-medium text-zinc-300">
                  {t("reset.new_password")}
                </label>
                <input
                  id="newPass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("reset.new_password_placeholder")}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={verifyCode}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-md"
              >
                {t("reset.reset_button")}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.3 }}
              className="text-center text-sm text-zinc-300 space-y-4"
            >
              <ShieldCheck className="w-12 h-12 mx-auto text-green-400" />
              <p>{t("reset.done")}</p>
              <Link
                to="/signin"
                className="inline-block text-teal-400 hover:underline font-medium"
              >
                {t("reset.return_signin")}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
