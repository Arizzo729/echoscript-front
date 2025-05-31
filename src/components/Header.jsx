import React, { useState, useEffect, useRef } from "react";
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "/Logo.png";

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  user = { name: "Guest" },
  onLogout = () => {},
  onSearch = () => {},
  notifications = [],
  onToggleTheme = () => {},
  isDarkMode = false,
  onSettingsOpen = () => {},
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
      className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 bg-zinc-900 text-white backdrop-blur border-b border-zinc-800 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          <Bars3Icon className="w-6 h-6 text-teal-400" />
        </Button>
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
        <Button variant="ghost" size="sm" onClick={onToggleTheme} className="p-2">
          {isDarkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-300" />
          ) : (
            <MoonIcon className="w-6 h-6 text-zinc-300" />
          )}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="sm" onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="p-2">
            <BellIcon className="w-6 h-6 text-zinc-300" />
            {!!notifications.length && (
              <span className="absolute top-0 right-0 px-1.5 py-0.5 text-xs bg-red-600 text-white rounded-full -translate-y-1/2 translate-x-1/2">
                {notifications.length}
              </span>
            )}
          </Button>
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-zinc-900 text-white border border-zinc-700 rounded-md shadow-xl z-50">
              <div className="p-3 font-medium border-b border-zinc-700">Notifications</div>
              <ul>
                {notifications.map((n, i) => (
                  <li key={i} className="px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800">
                    <p>{n.message}</p>
                    <p className="text-xs text-zinc-500">{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <Button variant="ghost" size="sm" onClick={() => setShowUserDropdown(!showUserDropdown)} className="flex items-center gap-2">
            <UserCircleIcon className="w-8 h-8 text-teal-400" />
            <ChevronDownIcon className={`w-5 h-5 transition-transform ${showUserDropdown ? "rotate-180" : ""}`} />
          </Button>
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 text-white border border-zinc-700 rounded-md shadow-lg z-50">
              <a href="/account" className="block px-4 py-2 hover:bg-zinc-800">Profile</a>
              <a href="/settings" className="block px-4 py-2 hover:bg-zinc-800">Settings</a>
              <hr className="border-zinc-700" />
              <button onClick={onLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-zinc-800">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}

