// src/components/SignIn.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
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
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || t("signin_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 px-2 sm:px-0"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-full max-w-[410px] space-y-7 p-6 xs:p-8 bg-zinc-900/95 border border-zinc-800 rounded-3xl shadow-2xl backdrop-blur-lg"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.35, type: "spring" }}
      >
        {/* Home Link */}
        <Link
          to="/"
          className="flex items-center text-sm font-semibold text-teal-400 hover:underline focus-visible:ring-2 focus-visible:ring-teal-400 w-max"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t("home", "Home")}
        </Link>

        {/* Header */}
        <div className="space-y-1 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p className="text-base text-zinc-400">
            {t("signin_subtitle")}{" "}
            <span className="text-teal-400 font-bold">EchoScript.AI</span>
          </p>
        </div>

        {error && (
          <div className="px-4 py-2 text-sm text-red-300 bg-red-500/10 rounded-lg text-center border border-red-500/40">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 text-xs font-medium text-zinc-400">
              {t("email_label")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                id="email"
                autoComplete="username"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email_placeholder")}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-base placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 text-xs font-medium text-zinc-400">
              {t("password_label")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                id="password"
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password_placeholder")}
                required
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-base placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full focus-visible:ring-2 focus-visible:ring-teal-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPassword
                  ? <EyeOff className="w-5 h-5 text-zinc-400 hover:text-white" />
                  : <Eye className="w-5 h-5 text-zinc-400 hover:text-white" />}
              </button>
            </div>
          </div>
          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-xs text-zinc-400 gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((v) => !v)}
                className="h-4 w-4 accent-teal-500 rounded focus-visible:ring-2 focus-visible:ring-teal-400"
              />
              {t("remember_me")}
            </label>
            <Link
              to="/reset"
              className="text-teal-400 hover:underline focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
            >
              {t("forgot_password")}
            </Link>
          </div>
          {/* Submit */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            className={`w-full py-3 text-base font-semibold rounded-xl shadow transition
              ${loading ? "bg-teal-700 cursor-not-allowed opacity-80" : "bg-teal-500 hover:bg-teal-400"}
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
            `}
          >
            {loading ? t("signing_in") : t("sign_in_button")}
          </motion.button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-zinc-500 mt-2">
          {t("no_account", "Don't have an account yet?") + " "}
          <Link
            to="/signup"
            className="font-semibold text-teal-400 hover:underline focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
          >
            {t("sign_up_here", "Sign up here.")}
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
