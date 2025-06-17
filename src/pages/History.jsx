// src/pages/History.jsx
import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const historyMock = [
  {
    id: 1,
    title: "Team Standup",
    date: "June 1, 2025",
    duration: "18:34",
    status: "Completed",
  },
  {
    id: 2,
    title: "Investor Call",
    date: "May 30, 2025",
    duration: "42:01",
    status: "Summarized",
  },
];

export default function History() {
  return (
    <motion.div
      className="max-w-5xl mx-auto px-6 py-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-extrabold text-center mb-6 text-yellow-500 dark:text-yellow-400">
        ⏱️ Transcript History
      </h1>
      <p className="text-center text-zinc-600 dark:text-zinc-300 mb-10">
        Review your recent transcription sessions and track your progress.
      </p>

      <div className="space-y-6">
        {historyMock.map((h) => (
          <div
            key={h.id}
            className="bg-zinc-100 dark:bg-zinc-800 p-5 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {h.title}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {h.date} • {h.duration}
                </p>
              </div>
              <span className="text-sm font-medium px-3 py-1 bg-teal-500 text-white rounded-full shadow">
                {h.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
