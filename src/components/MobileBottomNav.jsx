// src/components/MobileBottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../assets/icons/home.svg?component';
import { ReactComponent as DashboardIcon } from '../assets/icons/dashboard.svg?component';
import { ReactComponent as UploadIcon } from '../assets/icons/upload.svg?component';
import { ReactComponent as ShopIcon } from '../assets/icons/shop.svg?component';
import '../styles/mobile.css';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

export default function MobileBottomNav() {
  const links = [
    { to: '/', Icon: HomeIcon },
    { to: '/dashboard', Icon: DashboardIcon },
    { to: '/upload', Icon: UploadIcon },
    { to: '/shop', Icon: ShopIcon },
  ];

  const { playPop } = useSound();

  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 flex justify-around items-center bg-zinc-900/80 backdrop-blur-sm border-t border-teal-600/40 safe-area-inset md:hidden">
      {links.map(({ to, Icon }) => (
        <NavLink key={to} to={to} className="flex-1 flex justify-center items-center">
          {({ isActive }) => (
            <motion.div
              onTap={playPop}
              whileTap={{ scale: 0.75 }}
              className={
                `w-full h-full flex items-center justify-center 
                 ${isActive ? 'bg-teal-600/20' : 'hover:bg-zinc-700/50'}`
              }
            >
              <Icon
                className={`w-6 h-6 ${isActive ? 'text-teal-400' : 'text-zinc-400'}`}
                aria-hidden="true"
              />
            </motion.div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}



