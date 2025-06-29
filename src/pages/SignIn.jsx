// src/components/SignIn.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 6) {
      setError(t("signin_error"));
      return;
    }

    setLoading(true);
    try {
      await signIn({ email, password, remember: rememberMe });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || t("signin_error"));
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
        {/* New header */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-sm text-zinc-400">
            {t("signin_subtitle")}{" "}
            <span className="text-teal-400 font-semibold">EchoScript.AI</span>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-2 text-sm text-red-300 bg-red-500/10 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-6">
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
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full focus:outline-none focus:ring-0"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-zinc-400 hover:text-white" />
                ) : (
                  <Eye className="w-5 h-5 text-zinc-400 hover:text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 accent-teal-500 focus:outline-none"
              />
              {t("remember_me")}
            </label>
            <Link
              to="/reset"
              className="text-teal-400 hover:underline focus:outline-none"
            >
              {t("forgot_password")}
            </Link>
          </div>

          {/* Submit */}
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
            {loading ? t("signing_in") : t("sign_in_button")}
          </motion.button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-xs text-zinc-500">
          {t("no_account")}{" "}
          <Link to="/signup" className="text-teal-400 font-medium hover:underline">
            {t("sign_up_link")}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

