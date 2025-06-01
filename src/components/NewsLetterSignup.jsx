// components/NewsletterSignup.jsx
import React, { useState } from "react";
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
    <form onSubmit={handleSubmit} className="space-y-3 max-w-sm mx-auto text-left">
      <label htmlFor="email" className="block text-sm font-medium text-zinc-200">
        Join our newsletter
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full p-2 rounded-md border border-zinc-700 bg-zinc-800 text-white"
      />
      <Button type="submit" variant="primary" size="sm">
        {status === "loading" ? "Sending..." : "Subscribe"}
      </Button>
      {status === "success" && <p className="text-teal-400 text-sm">You're subscribed!</p>}
      {status === "error" && <p className="text-red-400 text-sm">Something went wrong.</p>}
    </form>
  );
}
