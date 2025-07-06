// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { Volume2, VolumeX, Cog } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { useAuth } from "../context/AuthContext";
import { useSound } from "../context/SoundContext";
import IconOnly from "../assets/icons/Icon.png"; // Correct relative path!
import { useTranslation } from "react-i18next";

export default function Header({ onLogout = () => {} }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { isMuted, toggleMute } = useSound();
  const navigate = useNavigate();
  const isGuest = !user?.email;

  // --- UI State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  // --- Example: notification dot state (replace with your logic) ---
  const [hasNotification, setHasNotification] = useState(true);

  // --- Refs ---
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const moreRef = useRef(null);

  // --- Click outside to close dropdowns ---
  useEffect(() => {
    function closeAll(e) {
      if (
        !searchRef.current?.contains(e.target) &&
        !notifRef.current?.contains(e.target) &&
        !userRef.current?.contains(e.target) &&
        !moreRef.current?.contains(e.target)
      ) {
        setShowNotifDropdown(false);
        setShowUserDropdown(false);
        setShowMoreDropdown(false);
      }
    }
    document.addEventListener("mousedown", closeAll);
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeAll(e));
    return () => {
      document.removeEventListener("mousedown", closeAll);
      document.removeEventListener("keydown", (e) => e.key === "Escape" && closeAll(e));
    };
  }, []);

  // --- SEARCH HANDLER (for future expansion) ---
  function handleSearch(e) {
    setSearchQuery(e.target.value);
    // You can add search suggestions here if needed
  }

  // --- COMPONENT RENDER ---
  return (
    <motion.header
      className="sticky top-0 z-50 bg-zinc-900/90 backdrop-blur border-b border-zinc-800 shadow"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-2 gap-2 relative">
        {/* --------- LOGO + NAME (DESKTOP ONLY) --------- */}
        <Link to="/" className="hidden md:flex items-center gap-2 min-w-[120px]">
          <img
            src={IconOnly}
            alt="EchoScript.AI"
            className="h-8 w-8"
            draggable={false}
            style={{ objectFit: "contain" }}
          />
          <span className="text-xl font-bold text-white tracking-tight select-none">
            EchoScript<span className="text-teal-400">.ai</span>
          </span>
        </Link>

        {/* --------- SEARCH BAR (all screens) --------- */}
        <div className="flex-1 max-w-xl mx-2 relative" ref={searchRef}>
          <input
            id="search-input"
            type="search"
            value={searchQuery}
            onChange={handleSearch}
            placeholder={t("Search…")}
            className="w-full py-2 pl-11 pr-4 text-base rounded-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-inner transition"
            autoComplete="off"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
        </div>

        {/* --------- ACTION BUTTONS (DESKTOP) --------- */}
        <div className="hidden md:flex items-center gap-1">
          {/* Mute Button */}
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

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifDropdown((v) => !v)}
              aria-label="Notifications"
              icon={
                <span className="relative">
                  <BellIcon className="w-5 h-5 text-white" />
                  {hasNotification && (
                    <span className="absolute top-0 right-0 inline-block w-2.5 h-2.5 bg-teal-400 rounded-full border-2 border-zinc-900"></span>
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

          {/* Account/User */}
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
                        <div className="mb-1 font-medium">{user.email}</div>
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

        {/* --------- MOBILE ACTION BUTTONS (NO LOGO, NO ACCOUNT) --------- */}
        <div className="flex md:hidden items-center gap-1">
          {/* Mute */}
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
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifDropdown((v) => !v)}
              aria-label="Notifications"
              icon={
                <span className="relative">
                  <BellIcon className="w-5 h-5 text-white" />
                  {hasNotification && (
                    <span className="absolute top-0 right-0 inline-block w-2.5 h-2.5 bg-teal-400 rounded-full border-2 border-zinc-900"></span>
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
                  className="absolute right-0 top-full mt-2 w-60 rounded-lg shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 z-50 py-3"
                >
                  <div className="text-sm text-zinc-800 dark:text-zinc-200 p-4">
                    No notifications yet
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Three Dots More */}
          <div className="relative" ref={moreRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreDropdown((v) => !v)}
              aria-label={t("More")}
              icon={<EllipsisVerticalIcon className="w-5 h-5 text-white" />}
            />
            <AnimatePresence>
              {showMoreDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 z-50"
                >
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200"
                    onClick={() => {
                      setShowMoreDropdown(false);
                      navigate("/settings");
                    }}
                  >
                    {t("Settings")}
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200"
                    onClick={() => {
                      setShowMoreDropdown(false);
                      navigate("/help");
                    }}
                  >
                    {t("Help & Support")}
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200"
                    onClick={() => {
                      setShowMoreDropdown(false);
                      navigate("/feedback");
                    }}
                  >
                    {t("Feedback")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
