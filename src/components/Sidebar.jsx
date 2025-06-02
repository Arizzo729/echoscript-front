// ✅ EchoScript.AI — Guaranteed Visible Sidebar (Clean & Working)
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Upload,
  User,
  Settings,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/dashboard", label: "Dashboard", icon: Upload },
  { path: "/account", label: "Account", icon: User },
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/purchase", label: "Shop", icon: ShoppingCart },
  { path: "/community", label: "Community", icon: Users },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false); // Default to expanded for visibility

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 70 }}
      className={`fixed top-0 left-0 h-screen z-40 bg-zinc-950 border-r border-zinc-800 shadow-xl backdrop-blur-md ${
        collapsed ? "w-16" : "w-52"
      } transition-all duration-300`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-end px-3 pt-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-400 hover:text-teal-400 transition"
          title={collapsed ? "Open Menu" : "Close Menu"}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 flex flex-col gap-1 px-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            title={collapsed ? label : ""}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-gradient-to-r from-teal-600 to-blue-500 text-white shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 w-full px-3">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-xl text-red-400 hover:bg-red-500/20 hover:text-white transition-all duration-300">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Log Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}

