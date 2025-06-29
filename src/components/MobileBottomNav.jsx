// ✅ EchoScript.AI — Final Pro Mobile Bottom Navigation (No Mute Button)
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  User,
  Settings2,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { name: "Upload", icon: Upload, to: "/upload" },
  { name: "Shop", icon: CreditCard, to: "/purchase" },
  { name: "Account", icon: User, to: "/account" },
  { name: "Settings", icon: Settings2, to: "/settings" },
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-300 dark:border-zinc-700 sm:hidden shadow-md">
      {tabs.map(({ name, icon: Icon, to }) => (
        <NavLink
          key={name}
          to={to}
          aria-label={name}
          className={({ isActive }) =>
            `group relative flex flex-col items-center justify-center px-3 py-1 text-xs font-medium ${
              isActive
                ? "text-teal-500"
                : "text-zinc-500 hover:text-teal-400 dark:text-zinc-400 dark:hover:text-teal-300"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <motion.div
                whileTap={{ scale: 0.92 }}
                className="flex flex-col items-center justify-center gap-0.5"
              >
                <Icon className="w-5 h-5" />
                <span>{name}</span>
              </motion.div>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute bottom-1 h-1 w-1 rounded-full bg-teal-500"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </AnimatePresence>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

