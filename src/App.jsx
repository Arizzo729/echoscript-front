// src/App.jsx
import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/useTheme";
import { GPTProvider } from "./context/GPTContext";
import { FontSizeProvider } from "./context/useFontSize"; // Keep for potential use in Home/Upload
import { SoundProvider, useSound } from "./context/SoundContext"; // Keep for potential use in Home/Upload

import AnimatedSplash from "./components/AnimatedSplash";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import useIsMobile from "./hooks/useIsMobile.jsx";

import Home from "./pages/HomePage";
import UploadPage from "./pages/Upload";
import NotFound from "./pages/NotFound";

// If you want the real component, you can swap these:
// import LiveCaptions from "./components/LiveCaptions.tsx";

/** Handles first-run splash, then IntroVideo, then Onboarding (once per browser) */
function OverlayManager() {
  const { pathname } = useLocation();
  // Since we only have / and /upload, no overlays are skipped.
  // This logic can be simplified or removed if overlays are not needed for these pages.

  const onboarded =
    typeof window !== "undefined" &&
    localStorage.getItem("onboardingComplete") === "true";
  const introSeen =
    typeof window !== "undefined" &&
    localStorage.getItem("intro_seen_v1") === "true";

  const [splashDone, setSplashDone] = useState(onboarded);

  // Avoid flashing overlays during first paint
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  if (!mounted) return null;

  return (
    <>
      {!splashDone && <AnimatedSplash onComplete={() => setSplashDone(true)} />}
    </>
  );
}

/** Resets ErrorBoundary on route change for a smoother UX */
function BoundaryResetter({ children }) {
  const { pathname } = useLocation();
  return <div key={pathname}>{children}</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <GPTProvider>
          <FontSizeProvider>
            <SoundProvider>
              <ErrorBoundary>
                <BoundaryResetter>
                  <Suspense
                    fallback={
                      <div className="container-prose py-10 text-center text-zinc-300">
                        Loading…
                      </div>
                    }
                  >
                    <Routes>
                      <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/upload" element={<UploadPage />} />
                        {/* All other routes redirect to home */}
                        <Route path="*" element={<Home />} />
                      </Route>
                    </Routes>
                  </Suspense>

                  {/* Global “intro/onboarding” overlays */}
                  <OverlayManager />
                </BoundaryResetter>
              </ErrorBoundary>
            </SoundProvider>
          </FontSizeProvider>
        </GPTProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
