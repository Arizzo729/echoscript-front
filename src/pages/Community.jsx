import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaDiscord,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
} from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const communityLinks = [
  {
    name: "Discord",
    href: "https://discord.com/invite/echoscriptai",
    icon: FaDiscord,
    color: "bg-indigo-600",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/echoscriptai",
    icon: FaInstagram,
    color: "bg-pink-500",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/echoscriptai",
    icon: FaLinkedin,
    color: "bg-blue-700",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@echoscriptai",
    icon: FaTiktok,
    color: "bg-black",
  },
];

export default function Community() {
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${t("community.subscribed")} ${email}`);
    setEmail("");
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-6 py-16 text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex flex-col items-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Sparkles className="w-8 h-8 text-teal-400 mb-2 animate-pulse" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          {t("community.title")}
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg mt-4 max-w-2xl">
          {t("community.description")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-14">
        {communityLinks.map(({ name, href, icon: Icon, color }) => (
          <motion.a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center justify-center p-6 rounded-xl text-white shadow-md hover:scale-[1.05] transform transition ${color}`}
            whileHover={{ scale: 1.1 }}
          >
            <Icon className="w-9 h-9 mb-2" />
            <span className="text-sm font-semibold">{name}</span>
          </motion.a>
        ))}
      </div>

      <motion.div
        className="bg-zinc-800 border border-zinc-700 rounded-xl p-8 max-w-xl mx-auto shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          {t("community.subscribeTitle")}
        </h2>
        <p className="text-zinc-400 text-sm mb-5">
          {t("community.subscribeDescription")}
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("community.placeholder")}
            required
            className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-lg text-sm transition"
          >
            {t("community.subscribe")}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
