import React, { useState, useEffect, useRef } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { Volume2, VolumeX, X, Cog } from "lucide-react"; // Added Cog icon
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
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("echo-muted");
    if (stored === "true" && !isMuted) toggleMute();
    if (stored !== "true" && isMuted) toggleMute();
  }, []);

  useEffect(() => {
    const closeAll = (e) => {
      if (
        !searchRef.current?.contains(e.target) &&
        !notifRef.current?.contains(e.target) &&
        !userRef.current?.contains(e.target)
      ) {
        setShowNotifDropdown(false);
        setShowUserDropdown(false);
      }
    };
    const esc = (e) => e.key === "Escape" && closeAll(e);
    document.addEventListener("mousedown", closeAll);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", closeAll);
      document.removeEventListener("keydown", esc);
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
        .then((res) => res.json())
        .then((data) => {
          if (active && Array.isArray(data.results)) {
            setSuggestions(
              data.results.length
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
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 flex-wrap">
        <Link to="/" className="flex items-center gap-2 min-w-[150px]">
          <img src={Logo} alt="EchoScript.AI" className="h-8 sm:h-10" />
          <span className="text-xl font-bold text-white">
            EchoScript<span className="text-teal-400">.AI</span>
          </span>
        </Link>

        <div ref={searchRef} className="relative flex-1 max-w-lg min-w-[200px]">
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("Search tools, pages, actions...")}
              className="w-full py-2 pl-10 pr-4 text-sm rounded bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />

            <AnimatePresence>
              {(suggestions.length > 0 || isLoading) && (
                <motion.ul
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 mt-1 w-full bg-zinc-900 border border-zinc-700 rounded shadow z-50 overflow-hidden"
                >
                  {isLoading ? (
                    <li className="px-4 py-2 text-sm text-zinc-400">{t("Loading…")}</li>
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
                        <span className="text-teal-400 font-medium">{s.type}</span>: {s.name}
                      </li>
                    ))
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            aria-label={t("Toggle theme")}
            icon={
              isDarkMode ? (
                <SunIcon className="w-5 h-5 text-yellow-300" />
              ) : (
                <MoonIcon className="w-5 h-5 text-blue-300" />
              )
            }
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            aria-label={t("Toggle sound")}
            icon={
              isMuted ? (
                <VolumeX className="w-5 h-5 text-red-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-teal-400" />
              )
            }
          />

          <div ref={notifRef} className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowNotifDropdown((prev) => !prev);
                setShowUserDropdown(false);
              }}
              icon={<BellIcon className="w-5 h-5 text-zinc-300" />}
            />
            <AnimatePresence>
              {showNotifDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded shadow z-50"
                >
                  <div className="px-4 py-2 text-sm font-semibold border-b border-zinc-700">
                    {t("Updates")}
                  </div>
                  <div className="p-4 text-sm text-zinc-400">
                    🚧 {t("In development — check back soon!")}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings cog button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
            aria-label={t("Settings")}
            icon={<Cog className="w-5 h-5 text-zinc-300" />} 
          />

          <div ref={userRef} className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowUserDropdown((prev) => !prev);
                setShowNotifDropdown(false);
              }}
              className="flex items-center gap-2"
              icon={<div className="w-8 h-8 rounded-full border border-teal-400 bg-zinc-800 flex items-center justify-center text-xs font-bold text-teal-300">{isGuest ? "GU" : "EU"}</div>}
            >
              <span className="text-sm text-white">
                {isGuest ? t("Welcome, Guest") : user.email}
              </span>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${showUserDropdown ? "rotate-180" : ""}`}
              />
            </Button>
            <AnimatePresence>
              {showUserDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded shadow z-50"
                >
                  {!isGuest ? (
                    <>
                      <Link to="/profile" className="block px-4 py-2 text-white hover:bg-zinc-800">
                        {t("Profile")}
                      </Link>
                      <Link to="/privacy" className="block px-4 py-2 text-white hover:bg-zinc-800">
                        {t("Privacy Settings")}
                      </Link>
                      <hr className="border-zinc-700" />
                      <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-zinc-800"
                      >
                        {t("Log Out")}
                      </button>
                    </>
                  ) : (
                    <div className="p-3 space-y-2">
                      <Link
                        to="/signin"
                        className="block w-full text-center px-4 py-2 text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white rounded"
                      >
                        {t("Sign In")}
                      </Link>
                      <Link
                        to="/signup"
                        className="block w-full text-center px-4 py-2 text-sm font-medium bg-zinc-700 hover:bg-zinc-600 text-white rounded"
                      >
                        {t("Sign Up")}
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}


