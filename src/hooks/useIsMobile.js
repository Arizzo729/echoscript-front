<<<<<<< Updated upstream
// src/hooks/useIsMobile.js
import { useEffect, useState } from "react";

/**
 * Robust, SSR-safe mobile check using matchMedia.
 * - No user-agent sniffing
 * - Updates on resize with a tiny debounce
 * - Default = false so desktop renders immediately
 */
export default function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      setIsMobile(false);
      return;
    }

    const mq = window.matchMedia(`(max-width: ${breakpointPx}px)`);
    let raf = null;

    const set = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIsMobile(mq.matches));
    };

    set(); // initial
    mq.addEventListener?.("change", set);
    // Safari fallback
    mq.addListener?.(set);

    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener?.("change", set);
      mq.removeListener?.(set);
    };
  }, [breakpointPx]);
=======
// ✅ EchoScript.AI — useIsMobile Responsive Hook (Final Polished Version)
import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint = 768) {
  const getMatch = () =>
    typeof window !== "undefined" && window.innerWidth < breakpoint;

  const [isMobile, setIsMobile] = useState(getMatch);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange(); // initial check
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [breakpoint]);
>>>>>>> Stashed changes

  return isMobile;
}
