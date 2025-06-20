import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SignIn() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      setError(t("signin_error"));
      return;
    }
    setError("");
    console.log("Sign In →", { email, password, rememberMe });
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 px-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-xl bg-zinc-900 border border-zinc-700">
        <h1 className="text-3xl font-bold text-center text-white">{t("signin_title")}</h1>
        <p className="text-sm text-center text-zinc-400">
          {t("signin_subtitle")}{" "}
          <span className="text-teal-400 font-medium">EchoScript.AI</span>
        </p>

        {error && (
          <div className="bg-red-500/10 text-red-300 px-4 py-2 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-5">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-zinc-300">
              {t("email_label")}
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email_placeholder")}
                required
                className="w-full px-4 py-2 pr-10 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Mail className="absolute right-3 top-2.5 w-5 h-5 text-zinc-400" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-zinc-300">
              {t("password_label")}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password_placeholder")}
                required
                className="w-full px-4 py-2 pr-10 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot */}
          <div className="flex items-center justify-between text-sm text-zinc-400">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="accent-teal-500"
              />
              {t("remember_me")}
            </label>
            <Link to="/reset" className="text-teal-400 hover:underline">
              {t("forgot_password")}
            </Link>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-md"
          >
            {t("sign_in_button")}
          </motion.button>
        </form>

        {/* Sign Up */}
        <p className="text-sm text-center text-zinc-400">
          {t("no_account")}{" "}
          <Link to="/signup" className="text-teal-400 hover:underline">
            {t("sign_up_link")}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
