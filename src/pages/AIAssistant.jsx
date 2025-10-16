import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your EchoScript Assistant. How can I help?" },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { role: "user", text: trimmed };
    const placeholder = { role: "assistant", text: "⏳ Thinking..." };

    setMessages((prev) => [...prev, userMsg, placeholder]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          messages: [
            ...messages.map(({ role, text }) => ({ role, content: text })),
            { role: "user", content: trimmed },
          ],
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Request failed with ${res.status}`);
      }
      const data = await res.json();
      const assistantText =
        data?.reply ??
        "I’m here and listening, but I didn’t receive any content. Try again?";

      setMessages((prev) =>
        prev.map((m, i) => (i === prev.length - 1 ? { ...m, text: assistantText } : m))
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? {
                ...m,
                text:
                  "⚠️ There was a problem contacting the assistant. Please try again.\n\n" +
                  String(err?.message || err),
              }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to="/dashboard" className="text-sm text-teal-500 hover:underline mb-6 inline-block">
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">AI Assistant</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        Ask EchoScript anything — transcription, AI tips, language questions, or feature walkthroughs.
      </p>
      <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-md">
        {/* ... content identical, removed for brevity ... */}
      </div>
    </motion.div>
  );
}
