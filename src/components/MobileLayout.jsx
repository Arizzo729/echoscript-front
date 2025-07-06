import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import IconButton from './IconButton';
import MobileBottomNav from './MobileBottomNav';
import Logo from '../assets/EchoScriptAI_Transparent_Dark.png';
import {
  MagnifyingGlassIcon,
  BellIcon,
  CogIcon,
  UserCircleIcon,
  SpeakerWaveIcon
} from './HeaderIcons';

/**
 * SafeAreaWrapper handles device notch/home indicator insets
 */
function SafeAreaWrapper({ children }) {
  return (
    <div
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
      className="bg-white dark:bg-zinc-900 min-h-screen w-full"
    >
      {children}
    </div>
  );
}

/**
 * Header that animates down on mount
 */
function AnimatedHeader({ children }) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-20"
    >
      {children}
    </motion.header>
  );
}

/**
 * Search input with press animation
 */
function AnimatedSearchInput({ placeholder }) {
  return (
    <div className="flex-1 relative">
      <motion.input
        type="search"
        placeholder={placeholder}
        whileFocus={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="w-full h-10 pl-4 pr-4 text-sm rounded-2xl bg-zinc-100 dark:bg-zinc-800 shadow-md border-0 focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
    </div>
  );
}

/**
 * Logo with hover effect and action icons with tap scale
 */
function LogoAndActions({ t }) {
  const icons = [
    { icon: <SpeakerWaveIcon className="w-5 h-5" />, label: t('Toggle sound') },
    { icon: <CogIcon className="w-5 h-5" />, label: t('Settings') },
    { icon: <BellIcon className="w-5 h-5" />, label: t('Notifications') },
    { icon: <UserCircleIcon className="w-5 h-5" />, label: t('Sign in') }
  ];
  return (
    <div className="px-4 py-1 flex items-center justify-between">
      <motion.img
        src={Logo}
        alt="EchoScript.AI"
        className="h-6"
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      />
      <div className="flex items-center space-x-2">
        {icons.map(({ icon, label }, idx) => (
          <motion.div key={idx} whileTap={{ scale: 0.9 }}>
            <IconButton icon={icon} label={label} size="sm" variant="ghost" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * Bottom nav slides up on mount
 */
function AnimatedBottomNav() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-20"
      >
        <MobileBottomNav />
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * MobileLayout: wraps pages with safe area, animated header, content padding, and bottom nav
 */
export default function MobileLayout({ children }) {
  const { t } = useTranslation();

  return (
    <SafeAreaWrapper>
      <div className="flex flex-col h-full w-full">
        <AnimatedHeader>
          {/* Row 1: Search bar */}
          <div className="px-4 py-2">
            <AnimatedSearchInput placeholder={t('search.placeholder')} />
          </div>
          {/* Row 2: Logo & Actions */}
          <LogoAndActions t={t} />
        </AnimatedHeader>

        {/* Main content with top & bottom padding for header/nav */}
        <main className="flex-1 overflow-auto pt-[calc(env(safe-area-inset-top)+5rem)] pb-[calc(env(safe-area-inset-bottom)+4rem)] px-4">
          {children}
        </main>

        {/* Animated bottom navigation */}
        <AnimatedBottomNav />
      </div>
    </SafeAreaWrapper>
  );
}
