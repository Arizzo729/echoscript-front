import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.section
      className="w-full h-full flex flex-col justify-center items-center px-6 py-16 text-center bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white max-w-4xl leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        The Best Listener in the World.
        <br />
        <span className="text-primary">EchoScript.AI</span> understands everyone.
      </motion.h1>

      <motion.p
        className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        Upload your audio, speak into the mic, or paste a link — EchoScript converts every voice into perfect, professional transcripts.
      </motion.p>

      <motion.div
        className="mt-10 flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          to="/dashboard"
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-light transition"
        >
          Get Started
        </Link>
        <Link
          to="/upload"
          className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition"
        >
          Try Uploading
        </Link>
      </motion.div>

      <motion.div
        className="mt-20 text-sm text-gray-400 dark:text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
      >
        EchoScript.AI is secure, smart, and always improving. <br className="hidden sm:inline" />
        Built with love for podcasters, creators, and every voice that deserves to be heard.
      </motion.div>
    </motion.section>
  );
}
