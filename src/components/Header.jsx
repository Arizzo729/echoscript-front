import React, { useState, useEffect, useRef } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Volume2, VolumeX } from "lucide-react";
import Button from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSound } from "../context/SoundContext";
import Logo from "/Logo.png";

export default function Header({
  onLogout = () => {},
  onSearch = () => {},
  notifications = [],
  onToggleTheme = () => {},
  isDarkMode = false,
}) {
  const { user } = useAuth();
  const isGuest = !user || !user.email;
  const { isMuted, toggleMute } = useSound();

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!searchQuery.trim()) return onSearch("");
    const handler = setTimeout(() => onSearch(searchQuery), 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const close = (e) => {
      if (!searchRef.current?.contains(e.target)) {
        setShowNotifDropdown(false);
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-3 bg-zinc-900/70 text-white backdrop-blur-md border-b border-zinc-800 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 pl-1 sm:pl-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="EchoScript.AI" className="h-8 sm:h-10 w-auto object-contain" />
          <span className="text-xl sm:text-2xl font-bold tracking-tight">
            EchoScript<span className="text-teal-400">.AI</span>
          </span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-md sm:mx-6" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            inputMode="search"
            placeholder="Search transcripts, tools, users..."
            className="w-full pl-10 pr-10 py-2 text-sm rounded-md bg-zinc-800/80 border border-teal-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-400 backdrop-blur-md shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search transcripts"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 w-5 h-5 -translate-y-1/2 pointer-events-none text-zinc-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-400 transition p-1 rounded-md bg-transparent"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="hidden sm:flex items-center gap-4 justify-end w-full sm:w-auto">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          icon={isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-300" /> : <MoonIcon className="w-6 h-6 text-zinc-300" />}
        />

        {/* Mute toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          aria-label="Toggle sound"
          icon={isMuted ? <VolumeX className="w-6 h-6 text-red-400" /> : <Volume2 className="w-6 h-6 text-green-300" />}
        />

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            icon={<BellIcon className="w-6 h-6 text-zinc-300 hover:text-white transition" />}
            aria-label="Notifications"
          />
          <AnimatePresence>
            {showNotifDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-zinc-900 text-white border border-zinc-700 rounded-lg shadow-lg z-50"
              >
                <div className="px-4 py-2 text-sm font-semibold border-b border-zinc-700">
                  Notifications
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n, i) => (
                      <li key={i} className="px-4 py-2 text-sm border-b border-zinc-800 hover:bg-zinc-800 transition">
                        <p className="text-zinc-300">{n.message}</p>
                        <p className="text-xs text-zinc-500">{n.time}</p>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-zinc-400 text-sm text-center">No notifications</li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative">
          <motion.div whileHover={{ scale: 1.1, rotate: 3 }} transition={{ type: "spring", stiffness: 300 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2"
              aria-label="User menu"
              icon={
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-teal-400 bg-zinc-800 shadow">
                  <span className="text-xs font-bold text-teal-300">{isGuest ? "GU" : "EU"}</span>
                </div>
              }
            >
              <span className="text-sm text-white font-medium">
                {isGuest ? "Welcome, Guest" : user.email}
              </span>
              <ChevronDownIcon className={`w-5 h-5 transition-transform ${showUserDropdown ? "rotate-180" : ""}`} />
            </Button>
          </motion.div>
          <AnimatePresence>
            {showUserDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-zinc-900 text-white border border-zinc-700 rounded-md shadow-lg z-50"
              >
                {!isGuest && (
                  <>
                    <Link to="/account" className="block px-4 py-2 hover:bg-zinc-800 transition" onClick={() => setShowUserDropdown(false)}>
                      Account
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 hover:bg-zinc-800 transition" onClick={() => setShowUserDropdown(false)}>
                      Settings
                    </Link>
                    <hr className="border-zinc-700" />
                  </>
                )}
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-zinc-800"
                >
                  {isGuest ? "Sign In" : "Logout"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
