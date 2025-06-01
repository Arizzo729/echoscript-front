// ✅ EchoScript.AI — Join Our Community Page
import React from "react";
import { motion } from "framer-motion";
import { FaDiscord, FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";

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
  return (
    <motion.div
      className="max-w-4xl mx-auto px-6 py-12 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-4 text-white">Join Our Community</h1>
      <p className="text-zinc-400 mb-10">
        Stay connected with EchoScript.AI and join the conversation. We’re building the future of voice AI together.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {communityLinks.map(({ name, href, icon: Icon, color }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center justify-center p-6 rounded-xl text-white shadow-md hover:scale-105 transition transform ${color}`}
          >
            <Icon className="w-8 h-8 mb-2" />
            <span className="text-sm font-semibold">{name}</span>
          </a>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-zinc-800 rounded-xl p-6 shadow-md border border-zinc-700 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-white mb-2">Stay in the Loop</h2>
        <p className="text-zinc-400 text-sm mb-4">
          Subscribe to our newsletter for AI updates, transcription tips, and exclusive invites.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Your email"
            required
            className="flex-1 p-2 rounded-md bg-zinc-900 border border-zinc-700 text-white text-sm"
          />
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-md text-sm transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </motion.div>
  );
}
