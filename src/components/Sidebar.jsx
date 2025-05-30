import React, { useState } from "react";
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
      animate={{ width: collapsed ? 70 : 240 }}
      className="h-screen fixed top-0 left-0 z-30 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-md flex flex-col transition-all duration-300 ease-in-out"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b dark:border-gray-800">
        {!collapsed && (
          <span className="text-xl font-bold text-primary dark:text-primary-light">
            EchoScript
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 dark:text-gray-400 hover:text-primary transition"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map(({ name, icon: Icon, to }) => (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white dark:bg-primary-light dark:text-black"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
            title={collapsed ? name : undefined}
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
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 text-xs text-gray-400 dark:text-gray-600 text-center border-t dark:border-gray-800">
        {collapsed ? "©" : `© ${new Date().getFullYear()} EchoScript.AI`}
      </div>
    </motion.aside>
  );
}

