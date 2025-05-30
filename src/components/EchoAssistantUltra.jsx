import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Loader2, Wand2, Mic, MicOff } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Persona & system prompt
const persona = {
  name: "Echo",
  greeting: "Hi, I'm Echo — your smart assistant. Ask me anything about transcripts, plans, usage, or even command me with `/summarize`, `/fix grammar`, or `/lookup something`.",
};

const defaultSystemPrompt = (user, context) => `
You are Echo, a super-intelligent assistant helping a user on EchoScript.AI.
The user is ${user.name} and is currently on the "${user.plan}" plan.
They are currently on: "${context}" page.
You are helpful, intelligent, and capable of looking things up if needed.
Always help with transcripts, AI tools, pricing, feedback, or technical questions.
If you are unsure, suggest looking it up with "/lookup {topic}".
Respond kindly and with clarity, like a real support engineer.
`;

const EchoAssistantUltra = ({
  user = { name: "User", plan: "Free" },
  context = "Dashboard",
}) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { role: "assistant", content: persona.greeting },
  ]);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recognitionAvailable, setRecognitionAvailable] = useState(false);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  const toggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    const keyHandler = (e) => {
      if (e.shiftKey && e.key === "A") toggle();
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Voice recognition error:", event.error);
        setRecording(false);
      };

      setRecognitionAvailable(true);
    }
  }, []);

  const startVoiceInput = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.start();
    setRecording(true);
  };

  const stopVoiceInput = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setRecording(false);
  };

  const parseCommands = (text) => {
    if (text.startsWith("/lookup ")) {
      return { command: "lookup", value: text.replace("/lookup ", "") };
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setHistory((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const parsed = parseCommands(input);
    if (parsed?.command === "lookup") {
      const lookupMsg = `🌐 Looking up "${parsed.value}" from external sources...`;
      setHistory((prev) => [...prev, { role: "assistant", content: lookupMsg }]);
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `📘 Here's what I found about "${parsed.value}":\n\n*Coming soon: real-time external lookup integration.*`,
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
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: defaultSystemPrompt(user, context),
            },
            ...history,
            userMessage,
          ],
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "⚠️ Unexpected error.";
      setHistory((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setHistory((prev) => [...prev, { role: "assistant", content: "⚠️ Network error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating AI Trigger Button */}
      <motion.button
        id="echo-assistant-button"
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <Wand2 className="w-5 h-5" />
      </motion.button>

      {/* Assistant Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="echo-assistant"
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
                  <Loader2 className="animate-spin w-4 h-4" /> Echo is thinking...
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center border-t dark:border-zinc-700 px-3 py-2 gap-2"
            >
              <button
                type="button"
                onClick={recording ? stopVoiceInput : startVoiceInput}
                className={`p-2 rounded-full ${
                  recording ? "bg-red-500" : "bg-zinc-200 dark:bg-zinc-800"
                } text-white`}
              >
                {recording ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Echo or use /lookup"
                className="flex-1 px-3 py-2 text-sm rounded-md bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                className="ml-2 p-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md"
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
};

export default EchoAssistantUltra;
