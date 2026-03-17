// src/components/Header.jsx

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { Volume2, VolumeX, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { useAuth } from "../context/AuthContext";
import { useSound } from "../context/SoundContext";
import IconOnly from "../assets/Icon.png";
import { useTranslation } from "react-i18next";

import { useTheme } from "../context/useTheme";
import Avatar from "./Avatar";

import LanguageToggle from "./LanguageToggle";

export default function Header({ onLogout = () => {}, onSearch = null }) {
  const { user: authUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { isMuted, toggleMute } = useSound();
  const navigate = useNavigate();
  const isGuest = !authUser?.email;

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const menuRef = useRef(null);

  // Handle clicking outside dropdowns to close
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

  const searchablePages = useMemo(() => [
    { label: t('dashboard.title', 'Dashboard'), path: '/' },
    { label: t('transcripts.title', 'Transcripts'), path: '/transcripts' },
    { label: t('upload.audio_upload', 'Upload'), path: '/upload' },
    { label: t('upload.video_upload', 'Video Upload'), path: '/video' },
    { label: t('upload.audio_upload', 'Audio Upload'), path: '/upload' },
    { label: t('dashboard.summarize', 'Summarize'), path: '/summary' },
    { label: t('summary.title_simple', 'Summary'), path: '/summary' },
    { label: t('purchase.usage_summary', 'Usage Summary'), path: '/purchase' },
    { label: t('account.title', 'Account'), path: '/account' },
    { label: t('dashboard.settings', 'Settings'), path: '/settings' },
    { label: t('purchase.title', 'Purchase'), path: '/purchase' },
    { label: t('dashboard.history', 'History'), path: '/history' },
    { label: t('contact.title', 'Contact'), path: '/contact' },
    { label: t('help.title', 'Help'), path: '/help' },
    { label: t('feedback.title', 'Feedback'), path: '/feedback' },
  ], [i18n.language]);

  useEffect(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) {
      setSearchSuggestions([]);
      setShowSearchDropdown(false);
      return;
    }
    const matches = searchablePages.filter(p => (p.label || '').toLowerCase().includes(q)).slice(0, 6);
    setSearchSuggestions(matches);
    setShowSearchDropdown(matches.length > 0);
  }, [searchQuery, searchablePages]);

  // For notification dot
  const hasNewNotifications = false; // Wire this up as needed

  return (
    <motion.header
      className="sticky top-0 z-[var(--z-header)] bg-zinc-900/80 backdrop-blur border-b border-zinc-800 shadow"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="banner"
    >
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 gap-4">
        {/* Logo and EchoScript.AI */}
        <Link to="/" className="hidden md:flex items-center gap-2 min-w-[140px] select-none">
          <img src={IconOnly} alt="EchoScript.AI" className="h-9 w-9" draggable={false} />
          <span className="text-2xl font-bold text-white tracking-tight select-none">
            EchoScript
            <span className="text-teal-400 ml-1">.AI</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div ref={searchRef} className="relative w-full md:flex-1 max-w-lg min-w-[200px]">
          <input
            id="search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const q = (searchQuery || '').trim();
                if (!q) return;
                if (onSearch) onSearch(q);
                else navigate(`/transcripts?search=${encodeURIComponent(q)}`);
                setShowSearchDropdown(false);
              }
            }}
            placeholder={t("Search tools, pages, actions...")}
            className="w-full py-2 pl-10 pr-4 text-sm rounded bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            aria-label={t("header.search_label", "Search")}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />

          {showSearchDropdown && searchSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg z-50">
              {searchSuggestions.map((s) => (
                <button
                  key={s.path}
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                    navigate(s.path);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-teal-50 dark:hover:bg-zinc-800"
                >
                  {s.label}
                </button>
              ))}
              <div className="border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => {
                    const q = (searchQuery || '').trim();
                    if (!q) return;
                    if (onSearch) onSearch(q);
                    else navigate(`/transcripts?search=${encodeURIComponent(q)}`);
                    setShowSearchDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  {t('Search for') || 'Search for'} "{searchQuery}"
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50">
            <span className="text-xs font-medium text-teal-400">{t("480_min", "480 min")}</span>
          </div>

          <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

          {/* --- Three Dots Menu --- */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              size="sm"
              aria-label={t("More menu")}
              onClick={() => setShowMenuDropdown((v) => !v)}
              icon={<EllipsisVerticalIcon className="w-5 h-5 text-zinc-300" />}
            />
            <AnimatePresence>
              {showMenuDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 z-[var(--z-dropdown)] py-1"
                  role="menu"
                >
                  <MenuDropdownItem
                    label={t("Settings")}
                    onClick={() => {
                      setShowMenuDropdown(false);
                      navigate("/settings");
                    }}
                  />
                  <MenuDropdownItem
                    label={t("Help & Support")}
                    onClick={() => {
                      setShowMenuDropdown(false);
                      navigate("/help");
                    }}
                  />
                  <MenuDropdownItem
                    label={t("Feedback")}
                    onClick={() => {
                      setShowMenuDropdown(false);
                      navigate("/feedback");
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- Volume / Mute --- */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={t("Toggle theme")}
            icon={
              theme === "dark"
                ? <Sun className="w-5 h-5 text-yellow-400" />
                : <Moon className="w-5 h-5 text-zinc-400" />
            }
          />

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

          <LanguageToggle className="hidden lg:flex" />

          {/* --- Notifications --- */}
          <div className="relative" ref={notifRef}>
            <Button
              variant="ghost"
              size="sm"
              aria-label={t("Notifications")}
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
                  role="menu"
                >
                  <div className="text-sm text-zinc-800 dark:text-zinc-200 p-4">
                    {t("No notifications yet")}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- User Account --- */}
          <div className="relative" ref={userRef}>
            <Button
              variant="ghost"
              size="sm"
              aria-label={t("Account")}
              onClick={() => setShowUserDropdown((v) => !v)}
              icon={<Avatar user={authUser} size="small" />}
            />
            <AnimatePresence>
              {showUserDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-44 rounded-lg shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 z-50"
                  role="menu"
                >
                  <div className="p-3 text-zinc-800 dark:text-zinc-200">
                    {isGuest ? (
                      <>
                        <div className="mb-1 font-medium">{t("Guest")}</div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-1"
                          onClick={() => navigate("/signin")}
                        >
                          {t("Sign in")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full mt-1"
                          onClick={() => navigate("/signup")}
                        >
                          {t("Sign up")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="mb-1 font-medium">{authUser?.email}</div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-1"
                          onClick={() => navigate("/account")}
                        >
                          {t("Account settings")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full mt-1"
                          onClick={onLogout}
                        >
                          {t("Sign out")}
                        </Button>
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

// Dropdown menu item helper with theme-matching highlight
function MenuDropdownItem({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-2 rounded transition text-sm text-zinc-800 dark:text-zinc-200 hover:bg-teal-50 dark:hover:bg-zinc-800 focus:bg-teal-50 dark:focus:bg-zinc-800"
      tabIndex={0}
      role="menuitem"
    >
      {label}
    </button>
  );
}
