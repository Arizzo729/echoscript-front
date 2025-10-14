import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900 px-2 sm:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-6 max-w-lg">
        <motion.h1
          className="text-7xl font-extrabold bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          404
        </motion.h1>

        <p className="text-lg text-zinc-400">{t("not_found.description")}</p>

        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-lg transition duration-300"
        >
          ⬅ {t("not_found.back_home")}
        </Link>
      </div>
    </motion.div>
  );
}
