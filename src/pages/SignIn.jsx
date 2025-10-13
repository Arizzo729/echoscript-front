<<<<<<< Updated upstream
// src/pages/SignIn.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
=======
// src/components/SignIn.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
>>>>>>> Stashed changes
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();
<<<<<<< Updated upstream
  const { user, signIn } = useAuth() || {};
=======
  const { signIn } = useAuth();
>>>>>>> Stashed changes

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

<<<<<<< Updated upstream
  useEffect(() => { if (user?.email) navigate("/account"); }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn({ email, password, remember: rememberMe });
      navigate("/account");
    } catch (err) {
      setError(err?.message || t("signin_error") || "Sign in failed.");
=======
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
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
<<<<<<< Updated upstream
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 px-2 sm:px-0"
=======
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 px-4"
>>>>>>> Stashed changes
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
<<<<<<< Updated upstream
      <motion.div
        className="w-full max-w-[410px] space-y-5 p-6 xs:p-8 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-800 rounded-3xl shadow-2xl backdrop-blur-lg"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.35, type: "spring" }}
      >
        <Link to={user ? "/account" : "/"} className="flex items-center text-sm font-semibold text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {user ? t("account", "Account") : t("home", "Home")}
        </Link>

        <div className="space-y-1 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t("signin_title", "Welcome Back")}
          </h1>
          <p className="text-base text-zinc-400 font-medium">
            {t("signin_subtitle", "Sign in to")} <span className="text-teal-400 font-bold">EchoScript.AI</span>
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 text-sm text-red-300 bg-red-700/15 rounded-lg text-center border border-red-500/30 shadow">
            {error}
          </motion.div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-medium text-zinc-400">{t("email", "Email")}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                id="email" type="email" autoComplete="username"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email", "Email")} required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
=======
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
>>>>>>> Stashed changes
              />
            </div>
          </div>

<<<<<<< Updated upstream
          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-medium text-zinc-400">{t("password", "Password")}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                id="password" autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password", "Password")} required
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full"
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="w-5 h-5 text-zinc-400" /> : <Eye className="w-5 h-5 text-zinc-400" />}
=======
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
>>>>>>> Stashed changes
              </button>
            </div>
          </div>

<<<<<<< Updated upstream
          <div className="flex items-center justify-between text-xs text-zinc-400 gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(v => !v)} className="h-4 w-4 accent-teal-500 rounded" />
              {t("remember_me", "Remember me")}
            </label>
            <Link to="/reset" className="text-teal-400 hover:underline">
              {t("forgot_password", "Forgot password?")}
            </Link>
          </div>

          <motion.button type="submit" whileTap={{ scale: 0.96 }} disabled={loading}
            className={`w-full py-3 text-base font-semibold rounded-xl shadow-xl transition ${loading ? "bg-teal-700 opacity-80" : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400"}`}>
            {loading ? t("signing_in", "Signing in…") : t("sign_in_button", "Sign in")}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
=======
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

>>>>>>> Stashed changes
