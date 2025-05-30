// src/components/MobileBottomNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Upload, User, Settings2 } from "lucide-react";

const tabs = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { name: "Upload", icon: Upload, to: "/upload" },
  { name: "Account", icon: User, to: "/account" },
  { name: "Settings", icon: Settings2, to: "/settings" },
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 flex justify-around items-center h-14 sm:hidden z-40">
      {tabs.map(({ name, icon: Icon, to }) => (
        <NavLink
          key={name}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center text-xs gap-1 px-3 py-1 transition-colors ${
              isActive
                ? "text-primary dark:text-primary-light"
                : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
            }`
          }
          aria-label={name}
        >
          <Icon className="w-6 h-6" />
          {name}
        </NavLink>
      ))}
    </nav>
  );
}
