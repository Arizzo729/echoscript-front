// src/components/Header.jsx

import React, { useState, useRef, useEffect } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { useAuth } from "../context/AuthContext";
import { useSound } from "../context/SoundContext";
import IconOnly from "../assets/icon.png";
import { useTranslation } from "react-i18next";

export default function Header({
  onLogout = () => {},
}) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { isMuted, toggleMute } = useSound();
  const navigate = useNavigate();
  const isGuest = !user?.email;

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const menuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const closeAll = (e) => {
      if (
        !searchRef.current?.contains(e.target) &&
        !notifRef.current?.contains(e.target) &&
        !userRef.current?.contains(e.target) &&
        !menuRef.current?.contains(e.target)
      ) {
        setShowNotifDropdown(false);
        setShowUserDropdown(false);
        setShowMenuDropdown(false);
      }
    };
    document.addEventListener("mousedown", closeAll);
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeAll(e));
    return () => {
      document.removeEventListener("mousedown", closeAll);
      document.removeEventListener("keydown", (e) => e.key === "Escape" && closeAll(e));
    };
  }, []);

  // Notification indicator (example logic; wire up your notification count)
  const hasNewNotifications = false; // <- set to true to test the red dot

  return (
    <motion.header
      className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur border-b border-zinc-800 shadow"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 gap-4">

        {/* Logo and EchoScript.AI (desktop only) */}
        <Link to="/" className="hidden md:flex items-center gap-2 min-w-[120px] select-none">
          <img src={IconOnly} alt="EchoScript.AI" className="h-9 w-9" />
          <span className="text-2xl font-bold text-white tracking-tight select-none">
            EchoScript
            <span className="text-teal-400 ml-0.5">.AI</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div ref={searchRef} className="relative w-full md:flex-1 max-w-lg min-w-[200px]">
          <input
            id="search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Search tools, pages, actions...")}
            className="w-full py-2 pl-10 pr-4 text-sm rounded bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
        </div>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">

          {/* 3-dots menu */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              size="sm"
              aria-label="More menu"
              onClick={() => setShowMenuDropdown((v) => !v)}
              icon={<EllipsisVerticalIcon className="w-5 h-5 text-zinc-300" />}
            />
            <AnimatePresence>
              {showMenuDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 z-50 py-1"
                >
                  <MenuDropdownItem
                    label={t("Settings")}
                    onClick={() => { setShowMenuDropdown(false); navigate("/settings"); }}
                  />
                  <MenuDropdownItem
                    label={t("Help & Support")}
                    onClick={() => { setShowMenuDropdown(false); navigate("/help"); }}
                  />
                  <MenuDropdownItem
                    label={t("Feedback")}
                    onClick={() => { setShowMenuDropdown(false); navigate("/feedback"); }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Volume/Mute */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            aria-label={t("Toggle sound")}
            icon={isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-teal-400" />}
          />

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Notifications"
              onClick={() => setShowNotifDropdown((v) => !v)}
              icon={
                <span className="relative">
                  <BellIcon className="w-5 h-5 text-white" />
                  {hasNewNotifications && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-900" />
                  )}
                </span>
              }
            />
            <AnimatePresence>
              {showNotifDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-64 rounded-lg shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 z-50 py-3"
                >
                  <div className="text-sm text-zinc-800 dark:text-zinc-200 p-4">
                    {t("No notifications yet")}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Account/User */}
          <div className="relative" ref={userRef}>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Account"
              onClick={() => setShowUserDropdown((v) => !v)}
              icon={<UserCircleIcon className="w-5 h-5 text-white" />}
            />
            <AnimatePresence>
              {showUserDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-44 rounded-lg shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 z-50"
                >
                  <div className="p-3 text-zinc-800 dark:text-zinc-200">
                    {isGuest ? (
                      <>
                        <div className="mb-1 font-medium">{t("Guest")}</div>
                        <Button size="sm" variant="outline" className="w-full mt-1" onClick={() => navigate("/signin")}>{t("Sign in")}</Button>
                        <Button size="sm" variant="ghost" className="w-full mt-1" onClick={() => navigate("/signup")}>{t("Sign up")}</Button>
                      </>
                    ) : (
                      <>
                        <div className="mb-1 font-medium">{user.email}</div>
                        <Button size="sm" variant="outline" className="w-full mt-1" onClick={() => navigate("/account")}>{t("Account settings")}</Button>
                        <Button size="sm" variant="ghost" className="w-full mt-1" onClick={onLogout}>{t("Sign out")}</Button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

// --- Helper for dropdown menu items (no blue, always theme matching) ---
function MenuDropdownItem({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-2 rounded transition text-sm text-zinc-800 dark:text-zinc-200 hover:bg-teal-50 dark:hover:bg-zinc-800 focus:bg-teal-50 dark:focus:bg-zinc-800"
      tabIndex={0}
    >
      {label}
    </button>
  );
}


