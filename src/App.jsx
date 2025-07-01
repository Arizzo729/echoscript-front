// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

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

// Pages
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

function AppInner() {
  const [splashDone, setSplashDone] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(() =>
    typeof window !== "undefined" ? !!window.__introPlayed : false
  );
  const { enableSound } = useSound();

  useEffect(() => {
    if (splashDone && !localStorage.getItem("onboardingComplete")) {
      const timer = setTimeout(() => setShowIntro(true), 300);
      return () => clearTimeout(timer);
    }
  }, [splashDone]);

  const handleIntroDone = () => {
    setShowIntro(false);
    setIntroComplete(true);
    if (typeof window !== "undefined") {
      window.__introPlayed = true;
    }
  };

  return (
    <>
      {!splashDone ? (
        <AnimatedSplash onComplete={() => setSplashDone(true)} />
      ) : (
        <>
          <Routes>
            {/* Public Auth Pages */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/unsubscribed" element={<Unsubscribed />} />

            {/* Layout-Wrapped Pages */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/purchase" element={<Purchase />} />
              <Route path="/purchase/minutes" element={<BuyExtraMinutes />} />
              <Route path="/apify" element={<ApifyTest />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/video" element={<VideoUpload />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/account" element={<Account />} />
              <Route path="/transcripts" element={<TranscriptsPage />} />
              <Route path="/summary" element={<SummaryPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>

          {showIntro && (
            <OnboardingModal
              onClose={handleIntroDone}
              onEnableAudio={enableSound}
            />
          )}

          {/* ✅ Final condition — AudioOverlay rendered after intro */}
          {introComplete && <AudioOverlay />}
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
                <AppInner />
              </SoundProvider>
            </FontSizeProvider>
          </GPTProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}


 