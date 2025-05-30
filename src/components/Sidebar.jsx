import React, { useState } from "react"
import { useTheme } from "../context/useTheme.jsx";
import { NavLink } from "react-router-dom";
import {
  Menu,
  ChevronLeft,
  LayoutDashboard,
  Upload,
  FileText,
  Settings2,
  User,
  CreditCard,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Navigation items config — name, icon component, and route path.
 */
const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { name: "Upload", icon: Upload, to: "/upload" },
  { name: "Transcripts", icon: FileText, to: "/transcripts" },
  { name: "Account", icon: User, to: "/account" },
  { name: "Settings", icon: Settings2, to: "/settings" },
  { name: "Purchase", icon: CreditCard, to: "/purchase" },
  { name: "AI Assistant", icon: Bot, to: "/assistant" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      aria-label="Primary Navigation"
      animate={{ width: collapsed ? 70 : 240 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="h-screen fixed top-0 left-0 z-30 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-700 shadow-lg flex flex-col"
      role="navigation"
    >
      {/* Sidebar Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b dark:border-zinc-700 select-none">
        {!collapsed && (
          <h1 className="text-xl font-extrabold text-primary dark:text-primary-light">
            EchoScript
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
          type="button"
        >
          {collapsed ? <Menu size={20} aria-hidden="true" /> : <ChevronLeft size={20} aria-hidden="true" />}
        </button>
      </header>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1" aria-label="Main menu">
        {navItems.map(({ name, icon: Icon, to }) => (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                isActive
                  ? "bg-primary text-white dark:bg-primary-light dark:text-zinc-900"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`
            }
            title={collapsed ? name : undefined}
          >
            <Icon className="w-5 h-5 shrink-0" aria-hidden="true" focusable="false" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="whitespace-nowrap"
                >
                  {name}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <footer className="p-3 text-xs text-gray-400 dark:text-gray-500 text-center border-t dark:border-zinc-700 select-none">
        {collapsed ? "©" : `© ${new Date().getFullYear()} EchoScript.AI`}
      </footer>
    </motion.aside>
  );
}

