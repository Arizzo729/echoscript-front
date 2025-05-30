import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center text-center bg-gray-50 dark:bg-gray-900 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div>
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 mb-6">
          Oops! Page not found.
        </p>
        <Link
          to="/"
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-light transition"
        >
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}
