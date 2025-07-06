// src/components/Header.jsx

import React, { useState, useRef, useEffect } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { MoreVertical, Cog } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { useAuth } from "../context/AuthContext";
import { useSound } from "../context/SoundContext";
import IconOnly from "/icon-only.png"; // Just your icon, not whole logo
import { useTranslation } from "react-i18next";

export default function Header({ hasNotifications = false, onLogout = () => {} }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { isMuted, toggleMute } = useSound();
  const navigate = useNavigate();
  const isGuest = !user?.email;

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);
  const moreRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const closeAll = (e) => {
      if (
        !notifRef.current?.contains(e.target) &&
        !userRef.current?.contains(e.target) &&
        !moreRef.current?.contains(e.target)
      ) {
        setShowNotifDropdown(false);
        setShowUserDropdown(false);
        setShowMoreDropdown(false);
      }
    };
    document.addEventListener("mousedown", closeAll);
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeAll(e));
    return () => {
      document.removeEventListener("mousedown", closeAll);
      document.removeEventListener("keydown", (e) => e.key === "Escape" && closeAll(e));
    };
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur border-b border-zinc-800 shadow"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 gap-4">

        {/* Logo + EchoScript.ai */}
        <Link to="/" className="hidden md:flex items-center gap-2 min-w-[120px]">
          <img src={IconOnly} alt="EchoScript.AI" className="h-8 sm:h-10" />
          <span className="text-xl font-bold text-white">
            EchoScript<span className="text-teal-400">.ai</span>
          </span>
        </Link>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[160px] max-w-lg">
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

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          {/* Mute */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            aria-label={t("Toggle sound")}
            icon={
              isMuted
                ? <VolumeX className="w-5 h-5 text-red-500" />
                : <Volume2 className="w-5 h-5 text-teal-400" />
            }
          />

          {/* Settings/More menu */}
          <div className="relative" ref={moreRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreDropdown((v) => !v)}
              aria-label={t("More")}
              icon={<MoreVertical className="w-5 h-5 text-white" />}
            />
            <AnimatePresence>
              {showMoreDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-52 rounded-lg shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 z-50 py-2"
                >
                  <button
                    className="w-full text-left px-4 py-2 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => { setShowMoreDropdown(false); navigate("/settings"); }}
                  >
                    {t("Settings")}
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => { setShowMoreDropdown(false); navigate("/help"); }}
                  >
                    {t("Help & Support")}
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => { setShowMoreDropdown(false); navigate("/feedback"); }}
                  >
                    {t("Feedback")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifDropdown((v) => !v)}
              aria-label="Notifications"
              icon={
                <span className="relative">
                  <BellIcon className="w-5 h-5 text-white" />
                  {hasNotifications && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-zinc-900" />
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
                    No notifications yet
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Account */}
          <div className="relative" ref={userRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserDropdown((v) => !v)}
              aria-label="Account"
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

