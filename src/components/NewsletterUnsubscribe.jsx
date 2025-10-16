// âœ… components/NewsletterUnsubscribe.jsx â€” Clean Unsubscribe Form w/ Redirectimport React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "./ui/Button";

>>>>>>> Stashed changes
export default function NewsletterUnsubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [message, setMessage] = useState("");

<<<<<<< Updated upstream
  const valid = /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }
=======
  const handleSubmit = async (e) => {
    e.preventDefault();    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/newsletter/unsubscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      // âœ… Redirect to confirmation page      window.location.href = "/unsubscribed";
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "âš ï¸ Something went wrong. Try again.");
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
        ðŸ’” Unsubscribe from our newsletter
      </label>

      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
      />

      <Button type="submit" variant="destructive" size="sm" className="w-full">
        {status === "loading" ? "Removing..." : "Unsubscribe"}
      </Button>

      {status === "error" && (
        <div className="text-red-400 text-sm text-center mt-2">{message}</div>
      )}    </motion.form>
  );
}
