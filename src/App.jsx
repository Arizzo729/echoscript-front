// src/App.jsx
import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext.jsx";
import { ThemeProvider } from "@/context/useTheme.jsx";
import { GPTProvider } from "@/context/GPTContext.jsx";
import { FontSizeProvider } from "@/context/useFontSize.jsx";
import { LanguageProvider } from "@/context/LanguageContext.jsx";
import { SoundProvider, useSound } from "@/context/SoundContext.jsx";
import { API_BASE } from "@/lib/apiBase";

import SearchResults from "@/pages/SearchResults.jsx";
import TranscribeUploader from "@/components/TranscribeUploader.jsx";

import AnimatedSplash from "@/components/AnimatedSplash.jsx";
import OnboardingModal from "@/components/OnboardingModal.jsx";
import IntroVideo from "@/components/IntroVideo.jsx";
import Layout from "@/components/Layout.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import useIsMobile from "@/hooks/useIsMobile.js";
import MobileBottomNav from "@/components/MobileBottomNav.jsx";
import FloatingHome from "@/components/FloatingHome.jsx";
import AudioOverlay from "@/components/AudioOverlay.jsx";

import Home from "@/pages/HomePage.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import UploadPage from "@/pages/Upload.jsx";
import AIAssistant from "@/pages/AIAssistant.jsx";
import Settings from "@/pages/Settings.jsx";
import Account from "@/pages/Account.jsx";
import Purchase from "@/pages/Purchase.jsx";
import BuyExtraMinutes from "@/pages/BuyExtraMinutes.jsx";
import ApifyTest from "@/pages/ApifyTest.jsx";
import Contact from "@/pages/Contact.jsx";
import VideoUpload from "@/pages/VideoUpload.jsx";
import TranscriptsPage from "@/pages/Transcripts.jsx";
import SummaryPage from "@/pages/Summary.jsx";
import HistoryPage from "@/pages/History.jsx";
import SignIn from "@/pages/SignIn.jsx";
import SignUp from "@/pages/SignUp.jsx";
import VerifyEmail from "@/pages/VerifyEmail.jsx";
import ResetPassword from "@/pages/ResetPassword.jsx";
import Unsubscribe from "@/pages/Unsubscribe.jsx";
import Unsubscribed from "@/pages/Unsubscribed.jsx";
import NotFound from "@/pages/NotFound.jsx";
import PrivacyPolicy from "@/pages/PrivacyPolicy.jsx";
import TermsOfService from "@/pages/TermsOfService.jsx";
import Status from "@/pages/Status.jsx";
import Checkout from "@/pages/Checkout.jsx";
import CodeReviewChecklist from "@/components/CodeReviewChecklist.jsx";

// If you want the real component, you can swap these:
// import LiveCaptions from "./components/LiveCaptions.tsx";
const LiveCaptions = () => <NotFound />;
const Studio = () => <NotFound />;

/** Handles first-run splash, then IntroVideo, then Onboarding (once per browser) */
function OverlayManager() {
  const { pathname } = useLocation();
  const skipOverlays = ["/terms", "/privacy", "/status", "/checkout"];
  if (skipOverlays.some((p) => pathname.startsWith(p))) return null;

  const onboarded =
    typeof window !== "undefined" &&
    localStorage.getItem("onboardingComplete") === "true";
  const introSeen =
    typeof window !== "undefined" &&
    localStorage.getItem("intro_seen_v1") === "true";

  const [splashDone, setSplashDone] = useState(onboarded);
  const [showIntro, setShowIntro] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [introComplete, setIntroComplete] = useState(onboarded || introSeen);

  const { enableSound } = useSound();
  const isMobile = useIsMobile();

  // After splash, if not onboarded and intro not seen yet, play intro once
  useEffect(() => {
    if (!onboarded && !introSeen && splashDone) {
      const t = setTimeout(() => setShowIntro(true), 300);
      return () => clearTimeout(t);
    }
    // If intro already complete (or user onboarded), allow UI overlays
    if (onboarded || introSeen) {
      setIntroComplete(true);
    }
  }, [splashDone, onboarded, introSeen]);

  const handleIntroDone = () => {
    setShowIntro(false);
    setIntroComplete(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("intro_seen_v1", "true");
    }
    // If user hasn't onboarded, open the tour modal next
    if (!onboarded) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("onboardingComplete", "true");
    }
  };

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

      {/* Intro video plays once per browser; Onboarding follows if not completed */}
      {showIntro && <IntroVideo onFinish={handleIntroDone} />}

      {showOnboarding && (
        <OnboardingModal onClose={handleOnboardingClose} onEnableAudio={enableSound} />
      )}

      {/* After intro or when already onboarded, show mobile UI helpers */}
      {introComplete && (
        <>
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
  const isMobile = useIsMobile();
  return (
    <AuthProvider>
      <LanguageProvider>
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
                          <Route path="/login" element={<SignIn />} />
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
                          <Route path="/checkout" element={<Checkout />} />
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
                          <Route path="/transcribe" element={<TranscribeUploader />} />
			  <Route path="/review-checklist" element={<CodeReviewChecklist />} />
                          <Route path="*" element={<NotFound />} />
                        </Route>
                      </Routes>
                    </Suspense>

                    {/* Desktop-only global audio overlay (single mount) */}
                    {!isMobile && <AudioOverlay />}

                    {/* Global “intro/onboarding” overlays */}
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
