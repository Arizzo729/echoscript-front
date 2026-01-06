import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Heart, 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  ThumbsDown,
  Sparkles,
  Bug
} from "lucide-react";
import Button from "../components/ui/Button";

export default function Feedback() {
  const { t } = useTranslation();
  const [category, setCategory] = useState("feature");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center px-4 bg-zinc-950 text-white"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="max-w-md w-full text-center space-y-6 bg-zinc-900 p-10 rounded-3xl border border-zinc-800 shadow-2xl">
          <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10 text-teal-400" />
          </div>
          <h1 className="text-3xl font-bold">Thank You!</h1>
          <p className="text-zinc-400">
            Your feedback helps us make EchoScript better for everyone. We've received your message.
          </p>
          <Button variant="primary" fullWidth onClick={() => window.location.href='/'}>
            Back to Home
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen px-4 py-12 bg-zinc-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Help us improve
          </div>
          <h1 className="text-4xl font-bold">Share Your Thoughts</h1>
          <p className="text-zinc-400 text-lg">
            Have a suggestion, found a bug, or just want to say hi?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setCategory("feature")}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                category === "feature" 
                  ? "bg-teal-500/10 border-teal-500 text-teal-400" 
                  : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              <Sparkles className="w-6 h-6" />
              <span className="font-medium">Feature Request</span>
            </button>
            <button
              type="button"
              onClick={() => setCategory("bug")}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                category === "bug" 
                  ? "bg-red-500/10 border-red-500 text-red-400" 
                  : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              <Bug className="w-6 h-6" />
              <span className="font-medium">Report a Bug</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 px-1">Message</label>
            <textarea 
              required
              rows={5}
              placeholder="Tell us what's on your mind..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition placeholder:text-zinc-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <div className="flex gap-4">
              <button type="button" className="text-zinc-500 hover:text-teal-400 transition">
                <ThumbsUp className="w-6 h-6" />
              </button>
              <button type="button" className="text-zinc-500 hover:text-red-400 transition">
                <ThumbsDown className="w-6 h-6" />
              </button>
            </div>
            <Button type="submit" variant="primary" icon={<Send />}>
              Send Feedback
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
