import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Loader2, Wand2, Mic, MicOff } from "lucide-react";
import ReactMarkdown from "react-markdown";

const persona = {
  name: "Echo",
  greeting: "Hi, I'm Echo — your smart assistant. Ask me anything or use slash commands like `/summarize`, `/fix grammar`, or `/keywords`.",
};

const defaultSystemPrompt = (user, context) => `
You are Echo, an AI assistant for EchoScript.AI.
User: ${user.name} (Plan: ${user.plan})
Context: "${context}" page
Always be helpful, concise, and intelligent. 
You support commands like /summarize, /keywords, /fix grammar, /lookup.
`;

export default function EchoAssistantUltra({
  user = { name: "User", plan: "Free" },
  context = "Dashboard",
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([{ role: "assistant", content: persona.greeting }]);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);

  // Toggle visibility
  const toggle = () => setOpen((prev) => !prev);

  // Global hotkey Shift+A
  useEffect(() => {
    const handler = (e) => e.shiftKey && e.key === "A" && toggle();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), [history]);

  // Voice recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (e) => setInput(e.results[0][0].transcript);
      recognitionRef.current.onerror = (e) => {
        console.error("Mic error:", e.error);
        setRecording(false);
      };
    }
  }, []);

  const startMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setRecording(true);
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecording(false);
    }
  };

  const parseCommand = (text) => {
    const command = text.trim().split(" ")[0];
    if (["/summarize", "/keywords", "/fix", "/lookup"].includes(command)) {
      return command;
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const message = { role: "user", content: input };
    const command = parseCommand(input);

    setHistory((prev) => [...prev, message]);
    setInput("");
    setLoading(true);

    // Simulated handling of command
    if (command === "/lookup") {
      const topic = input.replace("/lookup", "").trim();
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: `🔍 Searching for "${topic}"...` },
      ]);
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `📘 *Coming soon:* I'll pull live results for "${topic}".`,
          },
        ]);
        setLoading(false);
      }, 2000);
      return;
    }

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || "sk-xxx"}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: defaultSystemPrompt(user, context) },
            ...history,
            message,
          ],
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "⚠️ Echo couldn’t reply.";
      setHistory((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setHistory((prev) => [...prev, { role: "assistant", content: "⚠️ Network issue." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Orb trigger */}
      <motion.button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <Wand2 className="w-5 h-5" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 w-[380px] max-h-[80vh] bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-2xl shadow-2xl z-50 flex flex-col"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-zinc-700">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                Echo AI Assistant
              </h2>
              <button onClick={toggle} className="text-zinc-400 hover:text-red-500">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 text-sm space-y-3">
              {history.map((msg, i) => (
                <motion.div
                  key={i}
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
                <div className="text-zinc-400 dark:text-zinc-500 flex items-center gap-1 text-sm">
                  <Loader2 className="animate-spin w-4 h-4" /> Echo is thinking...
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input section */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 px-3 py-2 border-t dark:border-zinc-700"
            >
              <button
                type="button"
                onClick={recording ? stopMic : startMic}
                className={`p-2 rounded-full ${recording ? "bg-red-500" : "bg-zinc-200 dark:bg-zinc-800"} text-white`}
              >
                {recording ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Echo or use /command"
                className="flex-1 px-3 py-2 text-sm rounded-md bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                className="ml-2 p-2 bg-teal-600 hover:bg-teal-700 rounded-md text-white"
                disabled={loading}
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

