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

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  user = { name: "Guest" },
  onLogout = () => {},
  onSearch = () => {},
  notifications = [],
  onToggleTheme = () => {},
  isDarkMode = false,
  onSettingsOpen = () => {}, // ✅ triggers animated drawer from Layout
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
    <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-30">
      {/* Sidebar toggle & brand */}
      <div className="flex items-center gap-4">
        <button
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Bars3Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </button>
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
            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 py-2 pl-10 pr-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchSuggestions(true)}
          />
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {showSearchSuggestions && searchQuery.trim() && (
          <ul className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            <li className="cursor-pointer px-4 py-2 hover:bg-indigo-600 hover:text-white">
              Search suggestion 1 for "{searchQuery}"
            </li>
            <li className="cursor-pointer px-4 py-2 hover:bg-indigo-600 hover:text-white">
              Search suggestion 2 for "{searchQuery}"
            </li>
            <li className="cursor-pointer px-4 py-2 hover:bg-indigo-600 hover:text-white">
              Search suggestion 3 for "{searchQuery}"
            </li>
          </ul>
        )}
      </div>

      {/* Actions: Notifications / Theme / User */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            aria-label="Notifications"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
              <div className="p-4 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Notifications
              </div>
              <ul>
                {notifications.length === 0 ? (
                  <li className="p-4 text-gray-500 dark:text-gray-500">
                    No new notifications
                  </li>
                ) : (
                  notifications.map((notif, i) => (
                    <li
                      key={i}
                      className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-600 cursor-pointer"
                      onClick={() => {
                        setShowNotifDropdown(false);
                        notif.onClick && notif.onClick();
                      }}
                    >
                      <p className="text-sm">{notif.message}</p>
                      <p className="text-xs text-gray-400">{notif.time}</p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          aria-label="Toggle theme"
          onClick={onToggleTheme}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isDarkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-gray-600" />
          )}
        </button>

        {/* User Avatar */}
        <div className="relative">
          <button
            aria-label="User menu"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <span className="hidden md:inline text-gray-700 dark:text-gray-300 font-medium">
              {user?.name || "Guest"}
            </span>
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform ${
                showUserDropdown ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              <NavItem icon={UserCircleIcon} label="Profile" href="/account/profile" />
              <NavItem icon={Cog6ToothIcon} label="Settings" href="/settings" />
              <button
                onClick={onSettingsOpen} // ✅ opens animated drawer
                className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-700 dark:text-indigo-400 dark:hover:text-white flex items-center gap-2"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                App Settings
              </button>
              <hr className="border-gray-200 dark:border-gray-700" />
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-700 dark:text-red-400 dark:hover:text-red-200 flex items-center gap-2"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
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
      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 dark:text-gray-300 dark:hover:bg-indigo-600"
    >
      <Icon className="w-5 h-5" />
      {label}
    </a>
  );
}
