import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";
import { CheckCircle, XCircle } from "lucide-react";

const RAW_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";

const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

// Try the most likely backend paths in order.
const NEWSLETTER_PATHS = [
  "/newsletter/subscribe",
  "/api/v1/newsletter/subscribe",
  "/api/newsletter/subscribe",
];

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const trySubscribe = async (trimmedEmail) => {
    let lastError = null;

    for (const path of NEWSLETTER_PATHS) {
      const endpoint = `${API_BASE_URL}${path}`;
      console.log("Trying newsletter endpoint:", endpoint);

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email: trimmedEmail }),
        });

        const rawText = await res.text();
        let data = {};

        try {
          data = rawText ? JSON.parse(rawText) : {};
        } catch {
          data = {};
        }

        if (res.ok) {
          return {
            ok: true,
            endpoint,
            data,
          };
        }

        lastError =
          data.detail ||
          data.message ||
          data.error ||
          `Request failed with status ${res.status} at ${endpoint}`;

        // If endpoint is not found, continue trying next possible path
        if (res.status === 404) {
          continue;
        }

        // For non-404 errors, stop and report immediately
        throw new Error(lastError);
      } catch (err) {
        lastError = err.message || "Something went wrong.";
      }
    }

    throw new Error(
      lastError ||
        "Newsletter endpoint not found on the live backend. Check API base URL or deployed route."
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!API_BASE_URL) {
      setStatus("error");
      setMessage("Missing API base URL in frontend environment variables.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const result = await trySubscribe(trimmedEmail);

      console.log("Newsletter signup success:", result.endpoint);

      setStatus("success");
      setMessage("You're subscribed!");
      setEmail("");
    } catch (err) {
      console.error("Newsletter signup error:", err);
      setStatus("error");
      setMessage(err.message || "Something went wrong. Try again.");
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
      <label
        htmlFor="email"
        className="block text-sm font-medium text-zinc-300"
      >
        🌟 Join our newsletter for updates
      </label>

      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
      />

      <Button
        type="submit"
        variant="primary"
        size="sm"
        className="w-full"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </Button>

      <AnimatePresence mode="wait">
        {status !== "idle" && (
          <motion.div
            key={`${status}-${message}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`flex items-center gap-2 text-sm justify-center ${
              status === "success" ? "text-teal-400" : "text-red-400"
            }`}
          >
            {status === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <XCircle size={18} />
            )}
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
