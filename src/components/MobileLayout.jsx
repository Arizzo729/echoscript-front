// src/components/MobileLayout.jsx

import React, { useState, useEffect, useRef } from "react";
import MobileHeader from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";
import AudioOverlay from "./AudioOverlay";
import { motion, AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";

/**
 * Safe area wrapper for iOS/Android notch/homebar devices.
 * Applies proper padding so nothing is clipped.
 */
function SafeAreaWrapper({ children }) {
  return (
    <div
      className="min-h-screen w-full bg-white dark:bg-zinc-900"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        minHeight: "100dvh",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Overlay disables background scroll and handles backdrop click
 */
function ModalOverlay({ open, onClose, children, z = 50 }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-[${z}] flex items-end justify-center`}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
          tabIndex={-1}
          aria-label="Close overlay"
        />
        <div className="relative w-full max-w-md mx-auto pointer-events-auto">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Focus trap for accessibility: traps tab key inside modal
 */
function useFocusTrap(ref, open) {
  useEffect(() => {
    if (!open) return;
    const node = ref.current;
    if (!node) return;
    const focusable = node.querySelectorAll(
      "a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex='-1'])"
    );
    if (focusable.length) focusable[0].focus();
    function handleTab(e) {
      if (e.key !== "Tab") return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    node.addEventListener("keydown", handleTab);
    return () => node.removeEventListener("keydown", handleTab);
  }, [open, ref]);
}

/**
 * Main MobileLayout
 */
export default function MobileLayout({
  children,
  onSearch,
  showAudioFAB = true,
  initialTheme = null,
}) {
  // Theme setup
  const [theme, setTheme] = useState(() =>
    initialTheme ||
    (localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"))
  );
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // Audio overlay
  const [audioOpen, setAudioOpen] = useState(false);
  const audioRef = useRef(null);

  // Keyboard-aware padding (for safe UX on mobile)
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    // Detect mobile keyboard open (not 100% but helps on iOS)
    function onFocus() {
      setKeyboard(true);
    }
    function onBlur() {
      setKeyboard(false);
    }
    window.addEventListener("focusin", onFocus);
    window.addEventListener("focusout", onBlur);
    return () => {
      window.removeEventListener("focusin", onFocus);
      window.removeEventListener("focusout", onBlur);
    };
  }, []);

  // Animated header height (change this if you use a taller header)
  const HEADER_HEIGHT = 64;
  const BOTTOM_NAV_HEIGHT = 64;

  // Trap focus when modal open
  useFocusTrap(audioRef, audioOpen);

  // Responsive main style
  const mainStyle = {
    paddingTop: HEADER_HEIGHT,
    paddingBottom: BOTTOM_NAV_HEIGHT + (keyboard ? 20 : 0),
    minHeight: "100dvh",
    width: "100%",
    transition: "padding-bottom 0.2s cubic-bezier(.4,0,.2,1)",
    background: "inherit",
  };

  return (
    <SafeAreaWrapper>
      <div className="flex flex-col min-h-screen w-full bg-white dark:bg-zinc-900 relative">
        {/* --- Animated Mobile Header --- */}
        <MobileHeader
          onSearch={onSearch}
          theme={theme}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        />

        {/* --- Main content, auto-scroll, always below header --- */}
        <main
          className="flex-1 overflow-y-auto px-2 pb-2"
          style={mainStyle}
          id="main-content"
          tabIndex={0}
          aria-label="Main Content"
        >
          {children}
        </main>

        {/* --- Floating Audio FAB --- */}
        {showAudioFAB && !audioOpen && (
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
            style={{
              boxShadow: "0 4px 28px 0 rgba(0,0,0,0.13)",
              transition: "box-shadow 0.2s cubic-bezier(.4,0,.2,1)",
            }}
          >
            <Music className="w-7 h-7 text-teal-400" />
          </motion.button>
        )}

        {/* --- Audio Overlay Modal --- */}
        <ModalOverlay open={audioOpen} onClose={() => setAudioOpen(false)} z={60}>
          <div ref={audioRef}>
            <AudioOverlay onClose={() => setAudioOpen(false)} />
          </div>
        </ModalOverlay>

        {/* --- Mobile Bottom Navigation (FAB always above it) --- */}
        <AnimatePresence>
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-40 pointer-events-auto"
            style={{
              height: BOTTOM_NAV_HEIGHT,
              background: "transparent",
            }}
          >
            <MobileBottomNav />
          </motion.div>
        </AnimatePresence>
      </div>
    </SafeAreaWrapper>
  );
}

