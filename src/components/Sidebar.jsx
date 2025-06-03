import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Upload, User, Settings, ShoppingCart, Users, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/dashboard", label: "Dashboard", icon: Upload },
  { path: "/account", label: "Account", icon: User },
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/purchase", label: "Shop", icon: ShoppingCart },
  { path: "/community", label: "Community", icon: Users },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 70 }}
      className={`fixed top-0 left-0 h-screen z-40 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 border-r border-zinc-800 shadow-2xl backdrop-blur-lg transition-all duration-300 hidden md:block ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <div className="flex items-center justify-end px-3 pt-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full bg-zinc-800 hover:bg-teal-600 text-white shadow transition-all"
          title={collapsed ? "Open Menu" : "Close Menu"}
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      <nav className="mt-6 flex flex-col gap-1 px-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            title={collapsed ? label : ""}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <AnimatePresence>
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

      <div className="absolute bottom-6 w-full px-3">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-xl text-red-400 hover:bg-red-500/20 hover:text-white transition-all duration-300">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Log Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}

