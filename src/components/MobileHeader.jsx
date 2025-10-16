// src/components/MobileHeader.jsx
import { Bell, MoreVertical, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MobileHeader({ onSearch, hasNewNotifications = false }) {
  const { t } = useTranslation();

  const [showMenu, setShowMenu] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const close = (e) => {
      if (!menuRef.current?.contains(e.target) && !notifRef.current?.contains(e.target)) {
        setShowMenu(false);
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", (e) => e.key === "Escape" && close(e));
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", (e) => e.key === "Escape" && close(e));
    };
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-900/95 border-b border-zinc-200 dark:border-zinc-800 shadow backdrop-blur-md"
      style={{ height: 64 }}
      role="banner"
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2" style={{ minHeight: 56 }}>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            placeholder={t("Search tools, pages, actions.")}
            className="w-full h-11 pl-10 pr-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[1rem] text-zinc-900 dark:text-white placeholder-zinc-400 shadow-inner border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            aria-label={t("Search")}
            autoCorrect="off"
            spellCheck="false"
            autoComplete="off"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" aria-hidden="true" />
        </div>

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            aria-label={t("Notifications")}
            onClick={() => setShowNotifDropdown((v) => !v)}
          >
            <span className="relative">
              <Bell className="w-5 h-5 text-zinc-900 dark:text-white" />
              {hasNewNotifications && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-400 rounded-full border-2 border-white dark:border-zinc-900" />}
            </span>
          </button>
          {showNotifDropdown && (
            <div
              className="absolute right-0 top-full mt-2 w-64 rounded-xl shadow-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 z-50 py-3"
              role="menu"
            >
              <div className="text-sm text-zinc-800 dark:text-zinc-200 p-4">{t("No notifications yet")}</div>
            </div>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label={t("More")}
            onClick={() => setShowMenu(v => !v)}
          >
            <MoreVertical className="w-6 h-6 text-zinc-900 dark:text-white" />
          </button>
          {showMenu && (
            <div
              className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 z-50 py-2"
              role="menu"
            >
              <MenuItem label={t("Settings")} onClick={() => { setShowMenu(false); window.location.href = "/settings"; }} />
              <MenuItem label={t("Help & Support")} onClick={() => { setShowMenu(false); window.location.href = "/help"; }} />
              <MenuItem label={t("Feedback")} onClick={() => { setShowMenu(false); window.location.href = "/feedback"; }} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-[1rem] text-zinc-800 dark:text-zinc-100 hover:bg-teal-50 dark:hover:bg-zinc-800 focus:bg-teal-50 dark:focus:bg-zinc-800 transition rounded-md"
      tabIndex={0}
      role="menuitem"
    >
      {label}
    </button>
  );
}
