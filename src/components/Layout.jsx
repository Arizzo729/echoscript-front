// src/components/Layout.jsx
import React, {
  useState,
  useEffect,
  createContext,
  useMemo,
  Suspense,
  lazy,
  useTransition,
} from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ErrorBoundary from './ErrorBoundary';
import IntroVideo from './IntroVideo';
import AudioOverlay from './AudioOverlay';
import ToastContainer from './ToastContainer';       // <-- this import now matches
import MobileBottomNav from './MobileBottomNav';

const Header = lazy(() => import('./Header'));
const Sidebar = lazy(() => import('./Sidebar'));

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export default function Layout() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(true);
  const [theme, setTheme] = useState(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('theme');
    if (stored) return stored;
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    NProgress.configure({ showSpinner: false, easing: 'ease', speed: 400 });
    NProgress.start();
    startTransition(() => {});
    return () => NProgress.done();
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.style.overflow = showIntro ? 'hidden' : '';
  }, [showIntro]);

  const handleIntroFinish = () => setShowIntro(false);
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const toggleDrawer = () => setDrawerOpen(prev => !prev);
  const collapseSidebar = () => setSidebarCollapsed(prev => !prev);

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed top-2 left-2 p-2 bg-teal-500 text-white rounded"
      >
        Skip to content
      </a>

      <AnimatePresence>
        {showIntro && <IntroVideo key="intro" src="/videos/intro.mp4" onFinish={handleIntroFinish} />}
      </AnimatePresence>

      {!showIntro && (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-gradient-to-br from-[#0a0f1f] via-[#040711] to-[#050a15] text-white">
          <Suspense fallback={<div className="h-16 w-full bg-zinc-900" />}>
            <Header
              onToggleDrawer={toggleDrawer}
              drawerOpen={drawerOpen}
              collapseSidebar={collapseSidebar}
              sidebarCollapsed={sidebarCollapsed}
            />
          </Suspense>

          <div className="flex flex-1 overflow-hidden">
            <Suspense fallback={<div className="w-20 bg-zinc-900" />}>
              <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
            </Suspense>

            <main
              id="main-content"
              className={`flex-1 overflow-y-auto relative px-6 py-4 transition-all duration-300 ${
                sidebarCollapsed ? 'pl-20' : 'pl-56'
              }`}
            >
              {isPending && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ loop: Infinity, duration: 1 }}
                    className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full"
                  />
                </div>
              )}

              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </main>
          </div>

          <AudioOverlay />
          <ToastContainer position="top-right" />
          <MobileBottomNav className="md:hidden" />
        </div>
      )}
    </ThemeContext.Provider>
  );
}


