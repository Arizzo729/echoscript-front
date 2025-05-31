import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Bot } from "lucide-react";

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { role: "user", text: input };
    setMessages([...messages, newMsg]);
    setInput("");

    setTimeout(() => {
      const reply = {
        role: "assistant",
        text: `You asked: “${newMsg.text}.” EchoScript.AI is processing it with care.`,
      };
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto px-6 py-12"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-4xl font-bold mb-6 text-indigo-400 flex items-center gap-3">
        <Bot className="w-7 h-7" />
        EchoScript AI Assistant
      </h1>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow space-y-4">
        <div className="h-72 overflow-y-auto space-y-3 pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`px-4 py-2 max-w-[80%] rounded-lg text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-teal-600 text-white"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-zinc-700">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask the assistant anything..."
            className="flex-1 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-md bg-teal-600 hover:bg-teal-500 text-white"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
