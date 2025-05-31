// components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Upload,
  FileText,
  Settings2,
  User,
  CreditCard,
  Bot,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { name: "Upload", icon: Upload, to: "/upload" },
  { name: "Transcripts", icon: FileText, to: "/transcripts" },
  { name: "Account", icon: User, to: "/account" },
  { name: "Settings", icon: Settings2, to: "/settings" },
  { name: "Purchase", icon: CreditCard, to: "/purchase" },
  { name: "AI Assistant", icon: Bot, to: "/assistant" },
];

export default function Sidebar({ collapsedDefault = true }) {
  const [collapsed, setCollapsed] = useState(collapsedDefault);
  const location = useLocation();

  return (
    <motion.aside
      aria-label="Sidebar"
      animate={{ width: collapsed ? 64 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen fixed top-0 left-0 z-40 bg-gradient-to-br from-zinc-900 to-zinc-950 border-r border-zinc-800 shadow-xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
        {!collapsed && (
          <h1 className="text-lg font-extrabold text-white tracking-tight whitespace-nowrap">
            EchoScript<span className="text-teal-400">.AI</span>
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-500 hover:text-teal-400 transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map(({ name, icon: Icon, to }) => {
          const isActive = location.pathname.startsWith(to);
          return (
            <NavLink
              key={name}
              to={to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive || isActive
                    ? "bg-teal-600 text-white shadow-md dark:bg-teal-500"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="whitespace-nowrap"
                  >
                    {name}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-14 top-2 z-50 hidden group-hover:flex px-2 py-1 rounded bg-zinc-800 text-white text-xs shadow-lg pointer-events-none">
                  {name}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="text-xs text-center text-zinc-500 py-3 border-t border-zinc-800">
        {collapsed ? "©" : `© ${new Date().getFullYear()} EchoScript.AI`}
      </div>
    </motion.aside>
  );
}
