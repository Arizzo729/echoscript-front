// EchoAssistantUltra.jsx (Mobile-Ready + Polished)
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Loader2, Wand2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const persona = {
  name: "Echo",
  greeting:
    "Hi, I'm Echo — your smart assistant. Ask me anything about transcripts, plans, tools, or try commands like `/summarize`, `/clarify`, `/lookup keyword`, `/export`, or `/feedback`.",
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

  const toggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handler = (e) => e.shiftKey && e.key === "A" && toggle();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const parseCommand = (text) => {
    if (text.startsWith("/lookup ")) return { command: "lookup", arg: text.replace("/lookup ", "") };
    if (text.startsWith("/summarize")) return { command: "summarize" };
    if (text.startsWith("/clarify")) return { command: "clarify" };
    if (text.startsWith("/export")) return { command: "export" };
    if (text.startsWith("/feedback")) return { command: "feedback" };
    return null;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setHistory((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const cmd = parseCommand(input);
    if (cmd?.command === "lookup") {
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: `🌐 Looking up **"${cmd.arg}"**...` },
      ]);
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { role: "assistant", content: `🔎 **Result:** _Coming soon — EchoScript external AI search integration._` },
        ]);
        setLoading(false);
      }, 1500);
      return;
    }

    const systemPrompt = `You are Echo, a helpful and intelligent assistant in a smart transcription tool. The user is currently on the "${context}" page. Use the transcript context below for commands like summarize, clarify, or feedback.`;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/assistant/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_prompt: systemPrompt,
          transcript,
          question: input,
          history: history.map((h) => ({ role: h.role, content: h.content })),
          user_id: user.id,
          mode: "auto",
          tone: "friendly",
          voice: "coach",
        }),
      });

      const data = await res.json();
      const reply = data.response || "⚠️ No response from assistant.";
      setHistory((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error contacting the assistant." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Open Button */}
      <motion.button
        onClick={toggle}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        aria-label="Toggle Echo Assistant"
      >
        <Wand2 className="w-5 h-5" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-28 right-4 sm:bottom-24 sm:right-6 w-[92vw] sm:w-[360px] max-w-sm max-h-[75vh] bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-2xl shadow-2xl z-50 flex flex-col"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-zinc-700">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                Echo AI Assistant
              </h2>
              <button onClick={toggle} className="text-zinc-400 hover:text-red-500" aria-label="Close assistant panel">
                <X size={18} />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto px-4 py-3 text-sm space-y-3">
              {history.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`px-3 py-2 rounded-xl whitespace-pre-line max-w-[85%] ${
                    msg.role === "user"
                      ? "ml-auto bg-teal-100 dark:bg-teal-700 text-black dark:text-white"
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </motion.div>
              ))}
              {loading && (
                <div className="text-zinc-400 dark:text-zinc-500 text-sm flex items-center gap-1">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Echo is thinking...
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center border-t dark:border-zinc-700 px-3 py-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Echo or type a command..."
                className="flex-1 px-3 py-2 text-sm rounded-md bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white focus:outline-none"
                aria-label="Message input"
              />
              <button
                type="submit"
                className="ml-2 p-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md"
                disabled={loading}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

