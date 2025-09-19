import React from "react";
import { motion } from "framer-motion";
import { FaDiscord, FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";

/**
 * HomePage.jsx — drop‑in replacement
 *
 * Goals
 * - Keep the general look/feel of a bold hero and a social grid
 * - Make the social buttons properly interactable & accessible
 * - Leave clean placeholders for your real links (you fill them in)
 * - Light, dependency‑free (only framer‑motion + react‑icons)
 * - TailwindCSS classes are used for styling
 */

// === Toggle UTM tracking for clicks (optional) ===
const ENABLE_UTM = true;
const withUtm = (url, source = "website", medium = "homepage", campaign = "social_links") => {
  try {
    if (!ENABLE_UTM || !url) return url;
    const u = new URL(url);
    u.searchParams.set("utm_source", source);
    u.searchParams.set("utm_medium", medium);
    u.searchParams.set("utm_campaign", campaign);
    return u.toString();
  } catch {
    return url; // if it's not a valid URL yet (placeholder), just return as-is
  }
};

// === Fill these with your real profile links ===
const LINKS = {
  discord: "https://discord.gg/KnXGZVEbJz",
  instagram: "https://instagram.com/echoscriptai",
  linkedin: "https://linkedin.com/in/echoscript-ai-913426385",
  tiktok: "https://tiktok.com/@echoscriptai",
};

const communityLinks = [
  { name: "Discord", key: "discord", icon: FaDiscord, color: "bg-indigo-600" },
  { name: "Instagram", key: "instagram", icon: FaInstagram, color: "bg-pink-500" },
  { name: "LinkedIn", key: "linkedin", icon: FaLinkedin, color: "bg-blue-700" },
  { name: "TikTok", key: "tiktok", icon: FaTiktok, color: "bg-black" },
];

// Simple animation presets
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(56,189,248,0.10),transparent_60%)]" />
        <div className="container mx-auto px-6 pt-24 pb-16 sm:pt-28 sm:pb-24">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-center"
          >
            EchoScript.AI
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-4 text-center text-slate-300 max-w-2xl mx-auto"
          >
            Turn your voice into beautifully clear, accurate, and editable text in seconds.
          </motion.p>

          {/* Social Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
            role="list"
            aria-label="Follow EchoScript.AI on social platforms"
          >
            {communityLinks.map(({ name, key, icon: Icon, color }) => {
              const href = withUtm(LINKS[key]);
              const isPlaceholder = !LINKS[key] || LINKS[key].includes("YOUR_");
              const baseClasses = `flex flex-col items-center justify-center p-4 rounded-xl text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 transition ${color}`;

              return (
                <motion.a
                  key={key}
                  href={href || "#"}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={`Open ${name} in a new tab`}
                  title={`Follow EchoScript.AI on ${name}`}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.98 }}
                  className={
                    baseClasses +
                    (isPlaceholder
                      ? " cursor-not-allowed opacity-60 ring-1 ring-white/10"
                      : " hover:scale-[1.03]")
                  }
                  onClick={(e) => {
                    if (isPlaceholder) {
                      e.preventDefault();
                    }
                    // Optional analytics hook
                    if (typeof window !== "undefined") {
                      window.dataLayer = window.dataLayer || [];
                      window.dataLayer.push({
                        event: "social_click",
                        social_network: name,
                        social_target: href,
                        location: "homepage",
                      });
                    }
                  }}
                  role="listitem"
                  data-analytics="social-click"
                  data-social={name.toLowerCase()}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-sm font-semibold">{name}</span>
                  {isPlaceholder && (
                    <span className="mt-1 text-[10px] uppercase tracking-wide text-white/80">Fill link</span>
                  )}
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Feature teaser (kept minimal to preserve your existing look) */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card title="Fast & Accurate" text="State-of-the-art models tuned for clarity and speed." />
          <Card title="Edit & Export" text="Polish transcripts, then copy, download, or share instantly." />
        </div>
      </section>
    </main>
  );
}

function Card({ title, text }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-slate-300">{text}</p>
    </motion.div>
  );
}

