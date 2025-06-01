// ✅ EchoScript.AI Sidebar — Advanced, Animated, Responsive
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  FileText,
  User,
  Settings2,
  CreditCard,
  ChevronLeft,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { name: "Upload", icon: Upload, to: "/upload" },
  { name: "Transcripts", icon: FileText, to: "/transcription" },
  { name: "Account", icon: User, to: "/account" },
  { name: "Settings", icon: Settings2, to: "/settings" },
  { name: "Purchase", icon: CreditCard, to: "/purchase" },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 200 : 60 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-screen fixed top-0 left-0 z-30 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white border-r border-zinc-800 flex flex-col shadow-2xl"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        {sidebarOpen && (
          <span className="text-lg font-semibold tracking-tight text-teal-400">
            EchoScript<span className="text-white">.AI</span>
          </span>
        )}
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Collapse" : "Expand"}
          whileTap={{ scale: 0.9 }}
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

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navItems.map(({ name, icon: Icon, to }) => (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out relative 
              ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg"
                  : "text-zinc-400 hover:bg-zinc-800"
              }`
            }
            title={!sidebarOpen ? name : undefined}
          >
            <div className="relative">
              <Icon className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-3"
                  >
                    {name}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 text-[10px] text-zinc-500 text-center">
        {sidebarOpen ? `© ${new Date().getFullYear()} EchoScript.AI` : "©"}
      </div>
    </motion.aside>
  );
}

