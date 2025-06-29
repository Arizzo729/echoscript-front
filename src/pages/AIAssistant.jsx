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

    // Simulated GPT reply — replace this block with real GPT fetch later
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? {
                ...m,
                text: `✅ EchoScript understands. Here's a helpful response to: "${trimmed}"\n\n[Future GPT output goes here]`,
              }
            : m
        )
      );
      setLoading(false);
    }, 1500);
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

      {/* Chat UI */}
      <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-md">
        {/* Messages */}
        <div className="p-4 space-y-4 h-[420px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`text-sm flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 max-w-[80%] whitespace-pre-wrap rounded-lg shadow-sm ${
                  msg.role === "user"
                    ? "bg-teal-600 text-white"
                    : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-zinc-300 dark:border-zinc-700 p-3 bg-white dark:bg-zinc-950">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something…"
            className="flex-grow resize-none bg-transparent focus:outline-none px-3 py-2 text-sm rounded-md text-zinc-900 dark:text-white"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`p-2 rounded-full transition ${
              input.trim() && !loading
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-zinc-300 dark:bg-zinc-700 text-white cursor-not-allowed"
            }`}
            title="Send"
          >
            <PaperAirplaneIcon className="w-5 h-5 rotate-45" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}


