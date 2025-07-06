// src/components/MobileBottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import HomeIcon from '../assets/icons/home.svg';
import DashboardIcon from '../assets/icons/dashboard.svg';
import UploadIcon from '../assets/icons/upload.svg';
import ShopIcon from '../assets/icons/shop.svg';
import { User } from 'lucide-react';
import '../styles/mobile.css';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

export default function MobileBottomNav() {
  const { playPop } = useSound();
  const links = [
    { to: '/', Icon: HomeIcon, label: 'Home' },
    { to: '/dashboard', Icon: DashboardIcon, label: 'Dashboard' },
    { to: '/upload', Icon: UploadIcon, label: 'Upload' },
    { to: '/purchase', Icon: ShopIcon, label: 'Shop' },
    { to: '/account', Icon: User, label: 'Account' }, // NEW: Account tab (fifth, far right)
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 flex justify-around items-center bg-zinc-900/80 backdrop-blur-sm border-t border-teal-600/40 safe-area-inset md:hidden">
      {links.map(({ to, Icon, label }) => (
        <NavLink key={to} to={to} className="flex-1 flex justify-center items-center" aria-label={label}>
          {({ isActive }) => (
            <motion.div
              onTap={playPop}
              whileTap={{ scale: 0.75 }}
              className={`w-full h-full flex items-center justify-center ${
                isActive ? 'bg-teal-600/20' : 'hover:bg-zinc-700/50'
              }`}
            >
              {/* SVG or Lucide */}
              {typeof Icon === 'string'
                ? <img src={Icon} alt={label} className={`w-6 h-6 ${isActive ? 'text-teal-400' : 'text-zinc-400'}`} />
                : <Icon className={`w-6 h-6 ${isActive ? 'text-teal-400' : 'text-zinc-400'}`} aria-hidden="true" />}
            </motion.div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
