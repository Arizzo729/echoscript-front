// src/pages/AIAssistant.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your EchoScript Assistant. How can I help?" },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    const botMsg = { role: "assistant", text: "⏳ Thinking..." };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");

    // Simulated GPT response delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m, i) => (i === prev.length - 1 ? { ...m, text: "✅ GPT logic will go here soon!" } : m))
      );
    }, 1200);
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to="/dashboard" className="text-sm text-blue-500 hover:underline mb-6 inline-block">
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">AI Assistant</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        Ask EchoScript anything. From transcription advice to productivity help.
      </p>

      <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow">
        <div className="p-4 space-y-4 h-[400px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`text-sm ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block px-3 py-2 rounded-md ${
                  msg.role === "user"
                    ? "bg-teal-500 text-white"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-zinc-300 dark:border-zinc-700 p-3 bg-white dark:bg-zinc-950">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-grow bg-transparent focus:outline-none px-3 py-2 rounded-md"
          />
          <button
            onClick={handleSend}
            className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full transition"
            title="Send"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

