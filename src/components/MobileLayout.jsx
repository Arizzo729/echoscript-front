// src/components/MobileLayout.jsx

import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

import IconButton from './IconButton';
import Logo from '../assets/EchoScriptAI_Transparent_Dark.png';
import MobileBottomNav from './MobileBottomNav';
import AudioOverlay from './AudioOverlay'; // <-- Import this!
import { Music } from 'lucide-react';

import {
  Bell,
  Home as HomeIcon,
  Moon,
  Search as MagnifyingGlassIcon,
  Settings as CogIcon,
  Sun,
  User,
  Volume2 as SpeakerWaveIcon,
} from 'lucide-react';

/** Safe area wrapper for notch/home indicator devices */
function SafeAreaWrapper({ children }) {
  return (
    <div
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
      className="bg-white dark:bg-zinc-900 min-h-screen w-full"
    >
      {children}
    </div>
  );
}

/** Header with spring animation */
function AnimatedHeader({ children }) {
  return (
    <motion.header
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 shadow-md backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800"
      style={{ height: 'var(--header-height, 104px)' }}
    >
      {children}
    </motion.header>
  );
}

/** Debounced, accessible search input */
function AnimatedSearchInput({ placeholder, onSearch }) {
  const [value, setValue] = useState('');
  const timeout = useRef(null);

  function handleInput(e) {
    setValue(e.target.value);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      onSearch && onSearch(e.target.value);
    }, 300);
  }

  return (
    <div className="flex-1 relative group">
      <motion.input
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={handleInput}
        whileFocus={{ scale: 1.03, boxShadow: '0 0 0 3px #2dd4bf50' }}
        transition={{ type: 'spring', stiffness: 320 }}
        className="w-full h-11 pl-10 pr-4 text-[1rem] rounded-full bg-zinc-100 dark:bg-zinc-800 shadow-inner border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
        role="searchbox"
        tabIndex={0}
        autoComplete="off"
      />
      <MagnifyingGlassIcon
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 dark:text-zinc-400 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

/** Theme (sun/moon) toggle */
function ThemeToggle({ theme, onToggle }) {
  return (
    <IconButton
      icon={theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      variant="ghost"
      size="sm"
      onClick={onToggle}
      aria-pressed={theme === 'dark'}
      tabIndex={0}
    />
  );
}

/** Logo, home, and action icons row */
function LogoAndActions({ t, onHome, theme, onThemeToggle, actions }) {
  return (
    <div className="px-4 py-1 flex items-center justify-between gap-2">
      <motion.button
        type="button"
        aria-label={t('Home')}
        onClick={onHome}
        whileHover={{ scale: 1.07 }}
        transition={{ type: 'spring', stiffness: 180 }}
        className="focus:outline-none flex items-center gap-2"
        tabIndex={0}
        style={{ minWidth: 36 }}
      >
        <HomeIcon className="w-5 h-5 text-teal-400" />
        <img src={Logo} alt="EchoScript.AI logo" className="h-7 select-none" draggable={false} />
      </motion.button>
      <div className="flex items-center space-x-2">
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        {actions.map(({ icon, label, onClick }, idx) => (
          <motion.div key={idx} whileTap={{ scale: 0.93 }}>
            <IconButton
              icon={icon}
              label={label}
              size="sm"
              variant="ghost"
              onClick={onClick}
              tabIndex={0}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Animated bottom nav */
function AnimatedBottomNav() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 110 }}
        animate={{ y: 0 }}
        exit={{ y: 110 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        className="fixed bottom-0 left-0 right-0 z-40 pointer-events-auto"
        style={{ height: 'var(--bottom-nav-height, 64px)' }}
      >
        <MobileBottomNav />
      </motion.div>
    </AnimatePresence>
  );
}

// ---- FAB and Overlay logic below ----

export default function MobileLayout({ children, onSearch }) {
  const { t } = useTranslation();
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  const [audioOpen, setAudioOpen] = useState(false);

  // Theme toggler
  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', nextTheme);
  };

  // Actions (handlers as needed)
  const actions = [
    {
      icon: <SpeakerWaveIcon className="w-5 h-5" />,
      label: t('Ambient Audio'),
      onClick: () => setAudioOpen(true),
    },
    {
      icon: <CogIcon className="w-5 h-5" />,
      label: t('Settings'),
      onClick: () => {},
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: t('Notifications'),
      onClick: () => {},
    },
    {
      icon: <User className="w-5 h-5" />,
      label: t('Sign in'),
      onClick: () => {},
    },
  ];

  const handleHome = () => {
    window.location.href = '/';
  };

  const mainStyle = {
    paddingTop: 'calc(var(--header-height, 104px) + 0.5rem)',
    paddingBottom: 'calc(var(--bottom-nav-height, 64px) + 0.5rem)',
    minHeight: '100dvh',
  };

  return (
    <SafeAreaWrapper>
      <div className="flex flex-col min-h-screen w-full bg-white dark:bg-zinc-900 relative">
        {/* Animated header */}
        <AnimatedHeader>
          <div className="px-4 pt-2">
            <AnimatedSearchInput
              placeholder={t('search.placeholder')}
              onSearch={onSearch}
            />
          </div>
          <LogoAndActions
            t={t}
            onHome={handleHome}
            theme={theme}
            onThemeToggle={handleThemeToggle}
            actions={actions}
          />
        </AnimatedHeader>

        {/* Main content */}
        <main
          className="flex-1 overflow-auto px-4 transition-colors"
          style={mainStyle}
          id="main-content"
          role="main"
          tabIndex={0}
          aria-label={t('Main Content')}
        >
          {children}
        </main>

        {/* Bottom nav */}
        <AnimatedBottomNav />

        {/* FAB for audio overlay */}
        {!audioOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setAudioOpen(true)}
            className="fixed bottom-[84px] right-5 z-50 bg-zinc-900/90 border border-teal-400/60 shadow-lg rounded-full w-14 h-14 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-300"
            aria-label="Ambient Audio"
            tabIndex={0}
            style={{ boxShadow: '0 4px 28px 0 rgba(0,0,0,0.11)' }}
          >
            <Music className="w-7 h-7 text-teal-400" />
          </motion.button>
        )}

        {/* Overlay modal */}
        <AnimatePresence>
          {audioOpen && (
            <motion.div
              key="audio-overlay"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className="fixed inset-0 z-50 pointer-events-auto flex items-end justify-center"
              aria-modal="true"
              role="dialog"
            >
              <div className="absolute inset-0 bg-black/20" onClick={() => setAudioOpen(false)} />
              <div className="relative w-full max-w-md mx-auto">
                <AudioOverlay onClose={() => setAudioOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SafeAreaWrapper>
  );
}

