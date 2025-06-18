import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/useTheme";
import { GPTProvider } from "./context/GPTContext";
import { FontSizeProvider } from "./context/useFontSize";
import { LanguageProvider } from "./context/LanguageContext";
import { SoundProvider } from "./context/SoundContext";

// Layout & Shared UI
import AnimatedSplash from "./components/AnimatedSplash";
import OnboardingModal from "./components/OnboardingModal";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/HomePage";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Purchase from "./pages/Purchase";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import ApifyTest from "./pages/ApifyTest";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/Upload"; // ✅ Proper page wrapper for upload
import AIAssistant from "./pages/AIAssistant";
import Contact from "./pages/Contact";
import VideoUpload from "./pages/VideoUpload";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (splashDone && !localStorage.getItem("onboardingComplete")) {
      const timer = setTimeout(() => setShowIntro(true), 300);
      return () => clearTimeout(timer);
    }
  }, [splashDone]);

  const AppRoutes = (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} /> {/* ✅ Now properly routed */}
          <Route path="/assistant" element={<AIAssistant />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<Account />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/apify" element={<ApifyTest />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/video-upload" element={<VideoUpload />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showIntro && <OnboardingModal onClose={() => setShowIntro(false)} />}
    </>
  );

  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <GPTProvider>
            <FontSizeProvider>
              <SoundProvider>
                {!splashDone ? (
                  <AnimatedSplash onComplete={() => setSplashDone(true)} />
                ) : (
                  AppRoutes
                )}
              </SoundProvider>
            </FontSizeProvider>
          </GPTProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

