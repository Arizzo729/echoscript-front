// ✅ components/NewsletterSignup.jsx — Polished Version
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setStatus(data.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto space-y-4 p-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
        🌟 Join our newsletter for updates
      </label>

      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
      />

      <Button
        type="submit"
        variant="primary"
        size="sm"
        className="w-full"
      >
        {status === "loading" ? "Sending..." : "Subscribe"}
      </Button>

      <AnimatePresence>
        {status === "success" && (
          <motion.p
            className="text-teal-400 text-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            ✅ You're subscribed!
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            className="text-red-400 text-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            ⚠️ Something went wrong. Try again.
          </motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  );
}

