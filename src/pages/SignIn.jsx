import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();

    if (!email.includes("@") || password.length < 6) {
      setError("Please enter a valid email and a password with 6+ characters.");
      return;
    }

    setError("");
    console.log("Sign In →", { email, password, rememberMe });
    // TODO: Auth API connection
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-white dark:bg-black px-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-xl border dark:border-gray-800">
        <h1 className="text-3xl font-extrabold text-center text-primary dark:text-primary-light">
          Welcome Back
        </h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Sign in to continue using EchoScript.AI
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-5">
          {/* Email Field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
              />
              <Mail className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="accent-primary dark:accent-primary-light"
              />
              Remember me
            </label>
            <Link to="/reset" className="text-primary dark:text-primary-light hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-primary dark:bg-primary-light text-white dark:text-black py-2 rounded-md font-semibold hover:opacity-90 transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary dark:text-primary-light underline">
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
