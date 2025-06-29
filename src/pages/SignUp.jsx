// src/components/SignUp.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError(t("signup_error_invalid_email"));
      return;
    }
    if (password.length < 6) {
      setError(t("signup_error_short_password"));
      return;
    }
    if (password !== confirm) {
      setError(t("signup_error_password_mismatch"));
      return;
    }

    setLoading(true);
    try {
      await signUp({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || t("signup_error_general"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 px-4"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-sm space-y-8 p-8 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold text-white">
            {t("signup_title") || "Create Account"}
          </h1>
          <p className="text-sm text-zinc-400">
            {t("signup_subtitle")}{" "}
            <span className="text-teal-400 font-semibold">EchoScript.AI</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-2 text-sm text-red-300 bg-red-500/10 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-xs font-medium text-zinc-400"
            >
              {t("email_label")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email_placeholder")}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-xs font-medium text-zinc-400"
            >
              {t("password_label")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password_placeholder")}
                required
                disabled={loading}
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full focus:outline-none focus:ring-0"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-zinc-400 hover:text-white" />
                ) : (
                  <Eye className="w-5 h-5 text-zinc-400 hover:text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm"
              className="block mb-1 text-xs font-medium text-zinc-400"
            >
              {t("confirm_password_label")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                id="confirm"
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={t("password_placeholder")}
                required
                disabled={loading}
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            className={`w-full py-2 text-sm font-semibold rounded-lg shadow-sm transition ${
              loading
                ? "bg-teal-600 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-400"
            } focus:outline-none focus:ring-2 focus:ring-teal-400`}
          >
            {loading
              ? t("creating_account")
              : t("create_account_button")}
          </motion.button>
        </form>

        {/* Already Have Account */}
        <p className="text-center text-xs text-zinc-500">
          {t("already_have_account")}{" "}
          <Link
            to="/signin"
            className="text-teal-400 font-medium hover:underline focus:outline-none"
          >
            {t("sign_in_link")}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

