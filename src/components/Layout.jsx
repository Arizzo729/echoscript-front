// src/components/Layout.jsx
import React, {
  useState,
  useEffect,
  createContext,
  useMemo,
  Suspense,
  lazy,
  useTransition
} from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ErrorBoundary from './ErrorBoundary';
import { ToastProvider } from './toast/ToastProvider';
import ToastContainer from './ToastContainer';
import useIsMobile from '../hooks/useIsMobile';
import MobileLayout from './MobileLayout';
import AudioOverlay from './AudioOverlay'; // <-- mount desktop overlay

// Desktop-only components (lazy to keep bundle light)
const Header = lazy(() => import('./Header'));
const Sidebar = lazy(() => import('./Sidebar'));

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export default function Layout() {
  const isMobile = useIsMobile();
  const [theme, setTheme] = useState(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('theme');
    if (stored) return stored;
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    );
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isPending] = useTransition();

  // render immediately
  useEffect(() => {
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    NProgress.configure({ showSpinner: false, easing: 'ease', speed: 400 });
    return () => NProgress.done();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  if (isMobile) {
    return (
      <ToastProvider>
        <ThemeContext.Provider value={themeValue}>
          <MobileLayout>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </MobileLayout>
          <ToastContainer position="top-right" />
        </ThemeContext.Provider>
      </ToastProvider>
    );
  }

  // Desktop layout (now includes AudioOverlay)
  return (
    <ToastProvider>
      <ThemeContext.Provider value={themeValue}>
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-gradient-to-br from-[#0a0f1f] via-[#040711] to-[#050a15] text-white">
          <Suspense fallback={<div className="h-16 w-full bg-zinc-900" />}>
            <Header
              collapseSidebar={() => setSidebarCollapsed(v => !v)}
              sidebarCollapsed={sidebarCollapsed}
            />
          </Suspense>

          <div className="flex flex-1 overflow-hidden">
            <Suspense fallback={<div className="w-20 bg-zinc-900" />}>
              <Sidebar
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
              />
            </Suspense>

            <main
              id="main-content"
              className={`flex-1 overflow-y-auto relative px-6 py-4 transition-all duration-300 ${
                sidebarCollapsed ? 'pl-20' : 'pl-56'
              }`}
              tabIndex={0}
              role="main"
              aria-label="Main content"
            >
              {isPending && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full"
                    aria-label="Loading"
                    role="status"
                  />
                </div>
              )}
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </main>
          </div>

          {/* floating, draggable, collapsible audio overlay */}
          <AudioOverlay />

          <ToastContainer position="top-right" />
        </div>
      </ThemeContext.Provider>
    </ToastProvider>
  );
}
