// src/components/MobileLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import MobileHeader from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";
import MobileOverlay from "./MobileOverlay"; // <-- fixed import name
import { motion, AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";

/* ... keep all your existing code exactly the same until the render ... */

        {/* Audio Overlay Modal (always last so nothing covers it) */}
        <AudioModal open={audioOpen} onClose={() => setAudioOpen(false)}>
          <MobileOverlay onClose={() => setAudioOpen(false)} /> {/* <-- fixed usage */}
        </AudioModal>

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
/* ... rest unchanged ... */

