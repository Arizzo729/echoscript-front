// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { Volume2, VolumeX, Cog } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { useAuth } from "../context/AuthContext";
import { useSound } from "../context/SoundContext";
import Logo from "/Logo.png";
import { useTranslation } from "react-i18next";

const LOCAL_SEARCH_INDEX = [
  { type: "Page", name: "Dashboard", path: "/dashboard" },
  /* ...other searchable items... */
];

export default function Header({
  onLogout = () => {},
  isDarkMode = false,
  onToggleTheme = () => {},
}) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { isMuted, toggleMute } = useSound();
  const navigate = useNavigate();
  const isGuest = !user?.email;

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
    if ((stored === "true") !== isMuted) toggleMute();
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
    document.addEventListener("mousedown", closeAll);
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeAll(e));
    return () => {
      document.removeEventListener("mousedown", closeAll);
      document.removeEventListener("keydown", (e) => e.key === "Escape" && closeAll(e));
    };
  }, []);

  // (Search logic and dropdown rendering would go here...)

  return (
    <motion.header
      className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur border-b border-zinc-800 shadow"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 min-w-[120px]">
          <img src={Logo} alt="EchoScript.AI" className="h-8 sm:h-10" />
          <span className="hidden sm:inline text-xl font-bold text-white">
            EchoScript<span className="text-teal-400">.AI</span>
          </span>
        </Link>

        {/* Search Input */}
        <div ref={searchRef} className="relative w-full md:flex-1 max-w-lg min-w-[200px]">
          <input
            id="search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Search tools, pages, actions...")}
            className="w-full py-2 pl-10 pr-4 text-sm rounded bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <AnimatePresence>
            {/* suggestions dropdown */}
          </AnimatePresence>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => document.getElementById("search-input").focus()}
            aria-label="Search"
            icon={<MagnifyingGlassIcon className="w-5 h-5 text-zinc-400" />}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            aria-label={t("Toggle sound")}
            icon={isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-teal-400" />}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/settings")}
            aria-label={t("Go to Settings")}
            icon={<Cog className="w-5 h-5 text-white" />}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifDropdown((v) => !v)}
            aria-label="Notifications"
            icon={<BellIcon className="w-5 h-5 text-white" />}
          />
          <button
            onClick={() => setShowUserDropdown((v) => !v)}
            className="flex items-center"
            aria-label="User menu"
          >
            <UserCircleIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            aria-label={t("Toggle sound")}
            icon={isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-teal-400" />}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            aria-label={t("Toggle theme")}
            icon={isDarkMode ? <SunIcon className="w-5 h-5 text-yellow-300" /> : <MoonIcon className="w-5 h-5 text-blue-300" />}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (document.getElementById("audio-overlay").dataset.minimized = "true")}
            aria-label="Toggle Audio Overlay"
            icon={<span className="text-lg text-teal-400">🎵</span>}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/settings")}
            aria-label={t("Go to Settings")}
            icon={<Cog className="w-5 h-5 text-white" />}
          />
          <div className="relative" ref={notifRef}>
            {/* Notification dropdown */}
          </div>
          <div className="relative" ref={userRef}>
            {/* User dropdown */}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

