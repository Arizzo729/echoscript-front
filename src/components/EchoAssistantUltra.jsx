// ✅ EchoAssistantUltra.jsx — Enhanced, Optimized, and Advanced
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Loader2, Wand2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const persona = {
  name: "Echo",
  greeting:
    "Hi, I'm Echo — your smart assistant. Try commands like `/summarize`, `/clarify`, `/lookup`, `/export`, or `/feedback`.",
};

const suggestions = [
  { label: "Summarize Transcript", command: "/summarize" },
  { label: "Clarify a Section", command: "/clarify" },
  { label: "Look Up Topic", command: "/lookup AI models" },
  { label: "Export Content", command: "/export" },
];

const fuzzyMatch = (input) => {
  const clean = input.toLowerCase().trim();
  if (clean.startsWith("/sum")) return { command: "summarize" };
  if (clean.startsWith("/clar")) return { command: "clarify" };
  if (clean.startsWith("/look")) return { command: "lookup", arg: clean.split(" ").slice(1).join(" ") };
  if (clean.startsWith("/feed")) return { command: "feedback" };
  if (clean.startsWith("/exp")) return { command: "export" };
  if (clean.match(/help|tools|suggest/i)) return { command: "suggest" };
  return null;
};

export default function EchoAssistantUltra({
  user = { name: "User", plan: "Free", id: "anon" },
  context = "Dashboard",
  transcript = "",
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([{ role: "assistant", content: persona.greeting }]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const toggle = () => setOpen(!open);

  useEffect(() => {
    const handler = (e) => e.shiftKey && e.key === "A" && toggle();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const sendRequest = async (msg, cmd) => {
    setLoading(true);

    const systemPrompt = `You are Echo, a helpful and intuitive assistant. Context: ${context}. Transcript: ${transcript}. Assist clearly and professionally.`;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/assistant/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_prompt: systemPrompt,
          transcript,
          question: msg,
          history,
          user_id: user.id,
          mode: "auto",
          tone: "friendly",
          voice: "coach",
        }),
      });
      const data = await res.json();
      const reply = data?.response?.trim();

      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: reply || "🤔 I'm not sure I understood that—could you rephrase?" },
      ]);
    } catch {
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ An error occurred. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msg = input.trim();
    setInput("");
    setHistory((prev) => [...prev, { role: "user", content: msg }]);

    const cmd = fuzzyMatch(msg);

    if (cmd?.command === "lookup") {
      setHistory((prev) => [...prev, { role: "assistant", content: `🔍 Looking up **${cmd.arg}**...` }]);
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { role: "assistant", content: "📘 Real-time lookup is coming soon!" },
        ]);
        setLoading(false);
      }, 1200);
      return;
    }

    if (cmd?.command === "suggest") {
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: suggestions.map((s) => `- \`${s.command}\`: ${s.label}`).join("\n") },
      ]);
      setLoading(false);
      return;
    }

    sendRequest(msg, cmd);
  };

  return (
    <>
      <motion.button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-tr from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 text-white rounded-full shadow-xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        aria-label="Toggle Echo Assistant"
      >
        <Wand2 className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-20 right-6 w-80 max-h-[70vh] bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-xl shadow-xl z-50 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* Header and messages UI remains the same, trimmed for brevity */}

            <form onSubmit={handleSend} className="flex p-2 border-t dark:border-zinc-700">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Echo anything..."
                className="flex-1 p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-sm"
              />
              <button className="ml-2 bg-teal-600 hover:bg-teal-700 rounded text-white p-2" disabled={loading}>
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

