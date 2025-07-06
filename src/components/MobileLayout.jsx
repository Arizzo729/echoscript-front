import React, { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, BellIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";
import { useSound } from "../context/SoundContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MobileHeader({ onSearch }) {
  const { t } = useTranslation();
  const { isMuted, toggleMute } = useSound();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  const notifRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (
        !notifRef.current?.contains(e.target) &&
        !menuRef.current?.contains(e.target)
      ) {
        setShowNotifDropdown(false);
        setShowMenuDropdown(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", (e) => e.key === "Escape" && close(e));
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", (e) => e.key === "Escape" && close(e));
    };
  }, []);

  // If you ever want to show a real notification badge, set to true
  const hasNewNotifications = false;

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 shadow-md backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800"
      style={{ height: 64 }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      role="banner"
    >
      <div className="flex items-center px-3 py-1 gap-2 h-full w-full">
        {/* Search */}
        <div className="flex-1 relative">
          <input
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            type="search"
            placeholder={t("Search...")}
            className="w-full h-10 pl-10 pr-3 rounded-full bg-zinc-100 dark:bg-zinc-800 shadow-inner border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm transition"
            aria-label={t("Search")}
            autoComplete="off"
            tabIndex={0}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 dark:text-zinc-400 pointer-events-none" />
        </div>
        {/* Mute/unmute */}
        <Button
          variant="ghost"
          size="sm"
          aria-label={isMuted ? t("Unmute") : t("Mute")}
          onClick={toggleMute}
          icon={isMuted
            ? <VolumeX className="w-5 h-5 text-red-500" />
            : <Volume2 className="w-5 h-5 text-teal-400" />}
        />
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <Button
            variant="ghost"
            size="sm"
            aria-label={t("Notifications")}
            onClick={() => setShowNotifDropdown(v => !v)}
            icon={
              <span className="relative">
                <BellIcon className="w-5 h-5 text-zinc-700 dark:text-white" />
                {hasNewNotifications && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
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
                <div className="text-sm text-zinc-800 dark:text-zinc-200 p-4">{t("No notifications yet")}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Three dot menu */}
        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="sm"
            aria-label={t("More")}
            onClick={() => setShowMenuDropdown(v => !v)}
            icon={<EllipsisVerticalIcon className="w-5 h-5 text-zinc-600 dark:text-zinc-200" />}
          />
          <AnimatePresence>
            {showMenuDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-52 rounded-lg shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 z-50 py-1"
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
      </div>
    </motion.header>
  );
}

// Clean dropdown item (no highlight on active, proper theme)
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

