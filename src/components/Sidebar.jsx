// ✅ EchoScript.AI Sidebar — Final Version (Polished, Cleaned, Community Added)
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  User,
  Settings2,
  CreditCard,
  MessageCircle,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { name: "Upload", icon: Upload, to: "/upload" },
  { name: "Account", icon: User, to: "/account" },
  { name: "Settings", icon: Settings2, to: "/settings" },
  { name: "Purchase", icon: CreditCard, to: "/purchase" },
  { name: "Community", icon: MessageCircle, to: "/community" },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 220 : 64 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="h-screen fixed top-0 left-0 z-40 backdrop-blur-xl bg-zinc-900/80 text-white border-r border-zinc-800 shadow-xl flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        {sidebarOpen && (
          <span className="text-lg font-semibold tracking-tight text-teal-400 whitespace-nowrap">
            EchoScript<span className="text-white">.AI</span>
          </span>
        )}
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Collapse" : "Expand"}
          whileTap={{ scale: 0.92 }}
          className="p-1.5 text-zinc-400 hover:text-teal-400 transition"
        >
          <motion.div
            key={sidebarOpen ? "open" : "closed"}
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </motion.div>
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navItems.map(({ name, icon: Icon, to }) => (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out relative overflow-hidden
              ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-[0_0_10px_rgba(13,148,136,0.5)]"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`
            }
            title={!sidebarOpen ? name : undefined}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="ml-2 truncate"
                >
                  {name}
                </motion.span>
              )}
            </AnimatePresence>

            {!sidebarOpen && (
              <span className="absolute left-14 z-50 top-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-zinc-800 text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">
                {name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 text-[10px] text-zinc-500 text-center border-t border-zinc-800">
        {sidebarOpen ? `© ${new Date().getFullYear()} EchoScript.AI` : "©"}
      </div>
    </motion.aside>
  );
}
