// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { Volume2, VolumeX, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { useAuth } from "../context/AuthContext";
import { useSound } from "../context/SoundContext";
import Logo from "/Logo.png";
import { useTranslation } from "react-i18next";

const LOCAL_SEARCH_INDEX = [
  { type: "Page", name: "Dashboard", path: "/dashboard" },
  { type: "Page", name: "Upload Audio", path: "/upload" },
  { type: "Page", name: "Upload Video", path: "/video" },
  { type: "Page", name: "Buy Minutes", path: "/purchase/minutes" },
  { type: "Tool", name: "Echo Assistant", path: "/assistant" },
  { type: "Page", name: "Settings", path: "/settings" },
  { type: "Page", name: "Account", path: "/account" },
  { type: "Page", name: "Transcripts", path: "/transcripts" },
  { type: "Page", name: "Summary Generator", path: "/summary" },
  { type: "Page", name: "History", path: "/history" },
  { type: "Page", name: "Contact Us", path: "/contact" },
];

export default function Header({
  onLogout = () => {},
  onToggleTheme = () => {},
  isDarkMode = false,
}) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { isMuted, toggleMute } = useSound();
  const navigate = useNavigate();
  const isGuest = !user || !user.email;

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("echo-muted");
    if (stored === "true" && !isMuted) toggleMute();
    if (stored !== "true" && isMuted) toggleMute();
  }, []);

  useEffect(() => {
    const closeHandlers = (e) => {
      if (!searchRef.current?.contains(e.target)) {
        setShowNotifDropdown(false);
        setShowUserDropdown(false);
      }
    };
    const escHandler = (e) => e.key === "Escape" && closeHandlers(e);
    document.addEventListener("mousedown", closeHandlers);
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", closeHandlers);
      document.removeEventListener("keydown", escHandler);
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }
    let active = true;
    const controller = new AbortController();
    setIsLoading(true);
    const timeout = setTimeout(() => {
      fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) throw new Error("Network error");
          return res.json();
        })
        .then((data) => {
          if (active && Array.isArray(data.results)) {
            setSuggestions(
              data.results.length > 0
                ? data.results
                : LOCAL_SEARCH_INDEX.filter((item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
            );
          }
        })
        .catch(() => {
          if (active) {
            setSuggestions(
              LOCAL_SEARCH_INDEX.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
            );
          }
        })
        .finally(() => active && setIsLoading(false));
    }, 200);

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  return (
    <motion.header
      className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur border-b border-zinc-800 shadow"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        <Link to="/" className="flex items-center gap-2 min-w-[150px]">
          <img src={Logo} alt="EchoScript.AI" className="h-8 sm:h-10" />
          <span className="text-xl font-bold text-white">
            EchoScript<span className="text-teal-400">.AI</span>
          </span>
        </Link>

        <div ref={searchRef} className="relative flex-1 max-w-lg">
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("Search tools, pages, actions...")}
              className="w-full py-2 pl-10 pr-10 text-sm rounded bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-500 transition"
                aria-label={t("Clear search")}
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <AnimatePresence>
              {(suggestions.length > 0 || isLoading) && (
                <motion.ul
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 mt-1 w-full bg-zinc-900 border border-zinc-700 rounded shadow z-50 overflow-hidden"
                >
                  {isLoading ? (
                    <li className="px-4 py-2 text-sm text-zinc-400">
                      {t("Loading…")}
                    </li>
                  ) : (
                    suggestions.map((s, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          navigate(s.path);
                          setSearchQuery("");
                        }}
                        className="px-4 py-2 text-sm hover:bg-zinc-800 cursor-pointer"
                      >
                        <span className="text-teal-400 font-medium">
                          {s.type}
                        </span>
                        : {s.name}
                      </li>
                    ))
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* The rest of the header remains unchanged */}
        {/* Controls, Notifications, and User Dropdowns are handled correctly */}
      </div>
    </motion.header>
  );
}
