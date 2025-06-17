import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

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

    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Signup failed");

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("guest", "false");

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-white dark:bg-zinc-900 px-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md p-8 space-y-6 rounded-xl shadow-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        <h1 className="text-3xl font-extrabold text-center text-zinc-900 dark:text-white">
          {t("signup_title")}
        </h1>
        <p className="text-sm text-center text-zinc-500 dark:text-zinc-400">
          {t("signup_subtitle")}{" "}
          <span className="text-teal-500 font-medium">EchoScript.AI</span>
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t("email_label")}
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t("email_placeholder")}
                className="w-full px-4 py-2 pr-10 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Mail className="absolute right-3 top-2.5 w-5 h-5 text-zinc-400" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t("password_label")}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t("password_placeholder")}
                className="w-full px-4 py-2 pr-10 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="confirm" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t("confirm_password_label")}
            </label>
            <div className="relative">
              <input
                id="confirm"
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder={t("password_placeholder")}
                className="w-full px-4 py-2 pr-10 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Lock className="absolute right-3 top-2.5 w-5 h-5 text-zinc-400" />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 rounded-md transition"
          >
            {t("create_account_button")}
          </motion.button>
        </form>

        {/* Already have an account */}
        <p className="text-sm text-center text-zinc-500 dark:text-zinc-400">
          {t("already_have_account")}{" "}
          <Link to="/signin" className="text-teal-500 hover:underline">
            {t("sign_in_link")}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
