// ✅ EchoScript.AI: Unified & Enhanced Header — Themed, Animated, Polished
import React, { useState, useEffect, useRef } from "react";
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "/Logo.png";

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  user = { name: "Guest", avatar: null },
  onLogout = () => {},
  onSearch = () => {},
  notifications = [],
  onToggleTheme = () => {},
  isDarkMode = false,
}) {
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
      if (!searchRef.current?.contains(e.target)) setShowNotifDropdown(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 text-white backdrop-blur border-b border-zinc-800 shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        {!sidebarOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-teal-400"
            icon={<Bars3Icon className="w-6 h-6" />}
          />
        )}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="EchoScript.AI" className="h-8 w-auto" />
          <span className="text-xl font-bold tracking-tight">
            EchoScript<span className="text-teal-400">.AI</span>
          </span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-lg mx-6" ref={searchRef}>
        <div className="relative text-white focus-within:text-teal-300">
          <input
            type="search"
            placeholder="Search transcripts, tools, users..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-md bg-zinc-800 border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 w-5 h-5 -translate-y-1/2 pointer-events-none text-zinc-400" />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          icon={isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-300" /> : <MoonIcon className="w-6 h-6 text-zinc-300" />}
        />

        {/* Notifications */}
        {!sidebarOpen && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              icon={<BellIcon className="w-6 h-6 text-zinc-300" />}
            >
              {!!notifications.length && (
                <span className="absolute top-0 right-0 px-1.5 py-0.5 text-xs bg-red-600 text-white rounded-full -translate-y-1/2 translate-x-1/2">
                  {notifications.length}
                </span>
              )}
            </Button>
            <AnimatePresence>
              {showNotifDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-72 bg-zinc-900 text-white border border-zinc-700 rounded-md shadow-xl z-50"
                >
                  <div className="p-3 font-medium border-b border-zinc-700">Notifications</div>
                  <ul>
                    {notifications.map((n, i) => (
                      <li key={i} className="px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800">
                        <p>{n.message}</p>
                        <p className="text-xs text-zinc-500">{n.time}</p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* User Profile */}
        {!sidebarOpen && (
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2"
                icon={user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-teal-400 shadow"
                  />
                ) : (
                  <UserCircleIcon className="w-8 h-8 text-teal-400" />
                )}
              >
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
                  <a href="/account" className="block px-4 py-2 hover:bg-zinc-800">Profile</a>
                  <a href="/settings" className="block px-4 py-2 hover:bg-zinc-800">Settings</a>
                  <hr className="border-zinc-700" />
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-zinc-800">
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.header>
  );
}
