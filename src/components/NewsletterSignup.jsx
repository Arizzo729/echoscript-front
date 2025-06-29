// ✅ components/NewsletterSignup.jsx — Enhanced & Polished
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";
import { CheckCircle, XCircle } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      setStatus("success");
      setMessage("✅ You're subscribed!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "⚠️ Something went wrong. Try again.");
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

      <Button type="submit" variant="primary" size="sm" className="w-full">
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </Button>

      <AnimatePresence>
        {status !== "idle" && (
          <motion.div
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 text-sm justify-center ${
              status === "success" ? "text-teal-400" : "text-red-400"
            }`}
          >
            {status === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}


