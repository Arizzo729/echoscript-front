import React, { useState, useContext, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GPTContext } from "../context/GPTContext";
import { BsRobot, BsMicFill, BsX } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { useOnClickOutside } from "../context/useOnClickOutside";

export default function SmartAIAssistant() {
  const { sendPrompt, isLoading } = useContext(GPTContext) || {};
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "assistant", text: "Hi there! Need help with transcription?" }
  ]);

  const ref = useRef();
  useOnClickOutside(ref, () => setOpen(false));

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Echo thinking...
    const thinking = { sender: "assistant", text: "..." };
    setMessages((prev) => [...prev, thinking]);

    const reply = sendPrompt
      ? await sendPrompt(input).then((res) => res?.reply || "No response.")
      : "I'm offline right now.";

    setMessages((prev) => [
      ...prev.filter((msg) => msg.text !== "..."),
      { sender: "assistant", text: reply }
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-teal-500 hover:bg-teal-600 p-4 rounded-full shadow-xl text-white transition-all duration-200"
          aria-label="Open Echo Assistant"
        >
          <BsRobot size={24} />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] max-h-[500px] bg-zinc-900 border border-zinc-700 text-white rounded-2xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-zinc-700">
              <div className="flex items-center gap-2 text-teal-400 font-semibold">
                <BsRobot />
                <span>Echo Assistant</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white"
                aria-label="Close assistant"
              >
                <BsX size={20} />
              </button>
            </div>

            {/* Message log */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 scrollbar-thin scrollbar-thumb-zinc-600">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] px-3 py-2 text-sm rounded-xl ${
                    msg.sender === "assistant"
                      ? "bg-zinc-700 text-zinc-100 self-start"
                      : "bg-teal-600 text-white self-end ml-auto"
                  }`}
                >
                  {msg.text === "..." ? (
                    <span className="italic text-zinc-300 animate-pulse">Echo is thinking...</span>
                  ) : (
                    msg.text
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t border-zinc-700">
              <input
                className="flex-1 bg-zinc-800 text-sm text-white rounded-xl px-3 py-2 focus:outline-none placeholder:text-zinc-400"
                type="text"
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-xl transition ${
                  isLoading || !input.trim()
                    ? "bg-zinc-600 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600 text-white"
                }`}
                aria-label="Send message"
              >
                <IoSend size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
