// Sidebar.jsx — EchoScript.AI Sidebar Navigation (Polished + Future-Proof)

import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Upload,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Video,
  MessageCircle,
  LayoutDashboard,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";
import Avatar from "./Avatar";
import { useTranslation } from "react-i18next";

const navItems = (t) => [
  { path: "/", label: t("sidebar.home", "Home"), icon: Home },
  { path: "/dashboard", label: t("Dashboard", "Dashboard"), icon: LayoutDashboard },
  { path: "/upload", label: t("Upload", "Upload"), icon: Upload },
  { path: "/video", label: t("Video Upload", "Video Upload"), icon: Video },
  { path: "/purchase", label: t("sidebar.shop", "Shop"), icon: ShoppingCart },
  { path: "/contact", label: t("Contact", "Contact Us"), icon: MessageCircle },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user: authUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const items = navItems(t);

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
      className={`fixed top-0 left-0 h-screen z-40 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 border-r border-zinc-800 shadow-2xl backdrop-blur-lg transition-all duration-300 hidden md:block ${
        collapsed ? "w-16" : "w-56"
      }`}
      aria-label="Sidebar Navigation"
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-between px-3 pt-4">
        {!collapsed && (
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white shadow transition-all"
            title={theme === "dark" ? t("Light Mode") : t("Dark Mode")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full bg-zinc-800 hover:bg-teal-600 text-white shadow transition-all"
          title={collapsed ? t("Open Menu") : t("Close Menu")}
          aria-label={collapsed ? t("Open sidebar") : t("Close sidebar")}
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 flex flex-col gap-1 px-2">
        {items.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`
            }
            aria-current={({ isActive }) => (isActive ? "page" : undefined)}
            title={collapsed ? label : undefined}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="truncate"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 w-full px-3 flex flex-col gap-4">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-800/50 border border-zinc-700/50 ${collapsed ? "justify-center" : ""}`}>
           <Avatar user={authUser} size="small" />
           {!collapsed && (
             <div className="flex flex-col overflow-hidden">
               <span className="text-xs font-medium text-white truncate">{authUser?.name || authUser?.username || t("User")}</span>
               <span className="text-[10px] text-zinc-500 truncate">{authUser?.email}</span>
             </div>
           )}
        </div>
        <button
          onClick={authUser ? logout : undefined}
          className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-md"
          aria-label={t("Log Out")}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm">{t("Log Out")}</span>}
        </button>
      </div>
    </motion.aside>
  );
}

