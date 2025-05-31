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
import Button from "./ui/Button"; // ✅ New shared button

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
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      onSearch("");
      return;
    }
    const handler = setTimeout(() => {
      onSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, onSearch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-0 z-30">
      {/* Sidebar toggle & brand */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </Button>
        <h1 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 select-none">
          AI Transcriber
        </h1>
      </div>

      {/* Search */}
      <div ref={searchRef} className="relative flex-1 max-w-lg mx-6">
        <div className="relative text-gray-500 dark:text-gray-400 focus-within:text-indigo-600 dark:focus-within:text-indigo-400">
          <input
            type="search"
            autoComplete="off"
            placeholder="Search transcripts, tools, users..."
            className="block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 py-2 pl-10 pr-4 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchSuggestions(true)}
          />
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {showSearchSuggestions && searchQuery.trim() && (
          <ul className="absolute z-20 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-auto">
            {[1, 2, 3].map((n) => (
              <li
                key={n}
                className="cursor-pointer px-4 py-2 hover:bg-indigo-600 hover:text-white"
              >
                Search suggestion {n} for "{searchQuery}"
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2"
            aria-label="Notifications"
          >
            <BellIcon className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {notifications.length}
              </span>
            )}
          </Button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
              <div className="p-4 font-semibold text-zinc-700 dark:text-zinc-200 border-b border-zinc-300 dark:border-zinc-700">
                Notifications
              </div>
              <ul>
                {notifications.length === 0 ? (
                  <li className="p-4 text-zinc-500 dark:text-zinc-500">
                    No new notifications
                  </li>
                ) : (
                  notifications.map((notif, i) => (
                    <li
                      key={i}
                      className="px-4 py-3 border-b border-zinc-300 dark:border-zinc-700 hover:bg-indigo-100 dark:hover:bg-indigo-600 cursor-pointer"
                      onClick={() => {
                        setShowNotifDropdown(false);
                        notif.onClick && notif.onClick();
                      }}
                    >
                      <p className="text-sm">{notif.message}</p>
                      <p className="text-xs text-zinc-400">{notif.time}</p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="p-2"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-zinc-600" />
          )}
        </Button>

        {/* User Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 px-2"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            )}
            <span className="hidden md:inline text-zinc-700 dark:text-zinc-300 font-medium">
              {user?.name || "Guest"}
            </span>
            <ChevronDownIcon
              className={`w-5 h-5 text-zinc-700 dark:text-zinc-300 transition-transform ${
                showUserDropdown ? "rotate-180" : "rotate-0"
              }`}
            />
          </Button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-lg z-50">
              <NavItem icon={UserCircleIcon} label="Profile" href="/account/profile" />
              <NavItem icon={Cog6ToothIcon} label="Settings" href="/settings" />
              <Button
                variant="ghost"
                size="sm"
                onClick={onSettingsOpen}
                className="w-full justify-start px-4 py-2 gap-2 text-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-indigo-600"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                App Settings
              </Button>
              <hr className="border-zinc-300 dark:border-zinc-700" />
              <Button
                variant="danger"
                size="sm"
                onClick={onLogout}
                className="w-full justify-start px-4 py-2 gap-2"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ icon: Icon, label, href }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-indigo-100 dark:text-zinc-300 dark:hover:bg-indigo-600"
    >
      <Icon className="w-5 h-5" />
      {label}
    </a>
  );
}

