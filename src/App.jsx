// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/useTheme";
import { GPTProvider } from "./context/GPTContext";
import { FontSizeProvider } from "./context/useFontSize";
import { LanguageProvider } from "./context/LanguageContext";
import { SoundProvider, useSound } from "./context/SoundContext";

// Layout & Shared UI
import AnimatedSplash from "./components/AnimatedSplash";
import OnboardingModal from "./components/OnboardingModal";
import Layout from "./components/Layout";
import AudioOverlay from "./components/AudioOverlay";
import ErrorBoundary from "./components/ErrorBoundary";
import TranscriptAudioPlayer from "./components/TranscriptAudioPlayer";

// Mobile Helpers
import useIsMobile from "./hooks/useIsMobile";
import MobileOverlay from "./components/MobileOverlay";
import MobileBottomNav from "./components/MobileBottomNav";
import FloatingHome from "./components/FloatingHome";

// Pages...
import Home from "./pages/HomePage";
// (other page imports omitted for brevity)

function AppInner() {
  const [splashDone, setSplashDone] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(
    () => !!window.__introPlayed
  );
  const { enableSound } = useSound();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    if (splashDone && !localStorage.getItem("onboardingComplete")) {
      const t = setTimeout(() => setShowIntro(true), 300);
      return () => clearTimeout(t);
    }
  }, [splashDone]);

  const handleIntroDone = () => {
    setShowIntro(false);
    setIntroComplete(true);
    window.__introPlayed = true;
  };

  return (
    <>
      {!splashDone ? (
        <AnimatedSplash onComplete={() => setSplashDone(true)} />
      ) : (
        <>
          {/* AudioOverlay in a mobile sheet vs. desktop */}
          {isMobile ? (
            <MobileOverlay>
              <AudioOverlay />
            </MobileOverlay>
          ) : (
            <AudioOverlay />
          )}

          <Routes>
            {/* Public pages */}
            <Route path="/signin" element={<SignIn />} />
            {/* …other auth routes… */}

            {/* App pages */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              {/* …other routes… */}
            </Route>
          </Routes>

          {showIntro && (
            <OnboardingModal
              onClose={handleIntroDone}
              onEnableAudio={enableSound}
            />
          )}

          {introComplete && (
            <>
              <div className="fixed bottom-24 left-4 right-4 z-50 max-w-3xl mx-auto">
                <TranscriptAudioPlayer audioUrl="/audio/sample-audio.mp3" />
              </div>
              {isMobile && <MobileBottomNav />}
              {isMobile && <FloatingHome />}
            </>
          )}
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <GPTProvider>
            <FontSizeProvider>
              <SoundProvider>
                <ErrorBoundary>
                  <AppInner />
                </ErrorBoundary>
              </SoundProvider>
            </FontSizeProvider>
          </GPTProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
