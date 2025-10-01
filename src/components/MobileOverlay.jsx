// src/components/MobileLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";

import MobileHeader from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";
import MobileOverlay from "./MobileOverlay";

/**
 * Minimal inline modal to avoid external dependencies.
 * If you already have an AudioModal component, you can remove this and use yours.
 * Props: open:boolean, onClose:fn
 */
function AudioModal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative z-[61] w-[95vw] max-w-xl rounded-2xl border border-zinc-700 bg-zinc-900 p-4 shadow-2xl"
      >
        {children}
      </motion.div>
    </div>
  );
}

const BOTTOM_NAV_HEIGHT = 72;

function MobileLayout({ children }) {
  const [audioOpen, setAudioOpen] = useState(false);
  const [showHeaderShadow, setShowHeaderShadow] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setShowHeaderShadow(el.scrollTop > 2);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative flex h-dvh w-full flex-col bg-zinc-950 text-white">
      {/* Top: Header */}
      <div
        className={`sticky top-0 z-40 transition-shadow ${
          showHeaderShadow ? "shadow-lg shadow-black/20" : ""
        }`}
      >
        <MobileHeader
          onOpenAudio={() => setAudioOpen(true)}
          className="backdrop-blur bg-zinc-950/70 border-b border-zinc-800"
        />
      </div>

      {/* Scrollable content area (keeps bottom nav visible) */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: BOTTOM_NAV_HEIGHT + 16 }}
      >
        {children}
      </main>

      {/* Floating Audio button (optional) */}
      <button
        onClick={() => setAudioOpen(true)}
        aria-label="Open audio overlay"
        className="fixed right-4 bottom-[calc(72px+1rem)] z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/90 backdrop-blur hover:bg-zinc-800 transition-colors"
      >
        <Music className="h-5 w-5 text-teal-300" />
      </button>

      {/* Audio Overlay Modal (always last so nothing covers it) */}
      <AnimatePresence>
        <AudioModal open={audioOpen} onClose={() => setAudioOpen(false)}>
          <MobileOverlay onClose={() => setAudioOpen(false)} />
        </AudioModal>
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto"
          style={{ height: BOTTOM_NAV_HEIGHT, background: "transparent" }}
        >
          <MobileBottomNav />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default MobileLayout;
