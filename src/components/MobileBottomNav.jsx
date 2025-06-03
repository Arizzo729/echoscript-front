import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Upload, User, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { name: "Upload", icon: Upload, to: "/upload" },
  { name: "Account", icon: User, to: "/account" },
  { name: "Settings", icon: Settings2, to: "/settings" },
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-700 flex justify-around items-center h-14 sm:hidden z-50">
      {tabs.map(({ name, icon: Icon, to }) => (
        <NavLink
          key={name}
          to={to}
          aria-label={name}
          aria-current={({ isActive }) => (isActive ? "page" : undefined)}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors duration-200 px-3 py-1.5 ${
              isActive
                ? "text-teal-500"
                : "text-zinc-500 hover:text-teal-400 dark:text-zinc-400 dark:hover:text-teal-300"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="w-5 h-5" />
              <span>{name}</span>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 h-1 w-1 rounded-full bg-teal-400"
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
