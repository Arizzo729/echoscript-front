// src/App.jsx
import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/useTheme";
import { GPTProvider } from "./context/GPTContext";
import { FontSizeProvider } from "./context/useFontSize";
import { LanguageProvider } from "./context/LanguageContext";
import { SoundProvider, useSound } from "./context/SoundContext";

import SearchResults from "./pages/SearchResults.jsx";
import TranscribeUploader from "./components/TranscribeUploader";

import AnimatedSplash from "./components/AnimatedSplash";
import OnboardingModal from "./components/OnboardingModal";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import TranscriptAudioPlayer from "./components/TranscriptAudioPlayer";
import useIsMobile from "./hooks/useIsMobile";
import MobileBottomNav from "./components/MobileBottomNav";
import FloatingHome from "./components/FloatingHome";

import Home from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/Upload";
import AIAssistant from "./pages/AIAssistant";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Purchase from "./pages/Purchase";
import BuyExtraMinutes from "./pages/BuyExtraMinutes";
import ApifyTest from "./pages/ApifyTest";
import Contact from "./pages/Contact";
import VideoUpload from "./pages/VideoUpload";
import TranscriptsPage from "./pages/Transcripts";
import SummaryPage from "./pages/Summary";
import HistoryPage from "./pages/History";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import Unsubscribe from "./pages/Unsubscribe";
import Unsubscribed from "./pages/Unsubscribed";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Status from "./pages/Status";

const Studio = () => <NotFound />;
const LiveCaptions = () => <NotFound />;

/** Handles first-run splash + onboarding once per browser */
function OverlayManager() {
  const onboarded =
    typeof window !== "undefined" &&
    localStorage.getItem("onboardingComplete") === "true";

  const [splashDone, setSplashDone] = useState(onboarded);
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(
    () => onboarded || (typeof window !== "undefined" && !!window.__introPlayed)
  );

  const { enableSound } = useSound();
  const isMobile = useIsMobile();

  // Start intro after splash, only once
  useEffect(() => {
    if (splashDone && !onboarded) {
      const t = setTimeout(() => setShowIntro(true), 300);
      return () => clearTimeout(t);
    }
  }, [splashDone, onboarded]);

  const handleIntroDone = () => {
    setShowIntro(false);
    setIntroComplete(true);
    if (typeof window !== "undefined") {
      window.__introPlayed = true;
      localStorage.setItem("onboardingComplete", "true");
    }
  };

  // Mount overlays a tick after route content, avoids mobile layout flashing
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {!splashDone && <AnimatedSplash onComplete={() => setSplashDone(true)} />}
      {showIntro && (
        <OnboardingModal onClose={handleIntroDone} onEnableAudio={enableSound} />
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
      <LanguageProvider>
        <ThemeProvider>
          <GPTProvider>
            <FontSizeProvider>
              <SoundProvider>
                <ErrorBoundary>
                  <BoundaryResetter>
                    <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
                      <Routes>
                        <Route element={<Layout />}>
                          <Route path="/signin" element={<SignIn />} />
                          <Route path="/signup" element={<SignUp />} />
                          <Route path="/verify" element={<VerifyEmail />} />
                          <Route path="/reset" element={<ResetPassword />} />
                          <Route path="/unsubscribe" element={<Unsubscribe />} />
                          <Route path="/unsubscribed" element={<Unsubscribed />} />
                          <Route path="/terms" element={<TermsOfService />} />
                          <Route path="/privacy" element={<PrivacyPolicy />} />
                          <Route path="/status" element={<Status />} />
                          <Route path="/" element={<Home />} />
                          <Route path="/purchase" element={<Purchase />} />
                          <Route path="/purchase/minutes" element={<BuyExtraMinutes />} />
                          <Route path="/apify" element={<ApifyTest />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/video" element={<VideoUpload />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/upload" element={<UploadPage />} />
                          <Route path="/assistant" element={<AIAssistant />} />
                          <Route path="/account" element={<Account />} />
                          <Route path="/transcripts" element={<TranscriptsPage />} />
                          <Route path="/summary" element={<SummaryPage />} />
                          <Route path="/history" element={<HistoryPage />} />
                          <Route path="/studio" element={<Studio />} />
                          <Route path="/live" element={<LiveCaptions />} />
                          <Route path="/search" element={<SearchResults />} />
                          {/* Backend test route */}
                          <Route path="/transcribe" element={<TranscribeUploader />} />
                          <Route path="*" element={<NotFound />} />
                        </Route>
                      </Routes>
                    </Suspense>

                    {/* Mount overlays after routes so they sit above any page */}
                    <OverlayManager />
                  </BoundaryResetter>
                </ErrorBoundary>
              </SoundProvider>
            </FontSizeProvider>
          </GPTProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

