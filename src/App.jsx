// ✅ EchoScript.AI — Final App with i18n + AuthContext Support
// src/main.jsx or src/index.jsx
import "./i18n";
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/useTheme";
import { GPTProvider } from "./context/GPTContext";
import { FontSizeProvider } from "./context/useFontSize";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import AnimatedSplash from "./components/AnimatedSplash";
import OnboardingModal from "./components/OnboardingModal";
import "./global.css";

// Layout & Shared UI
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
import UploadAndTranscribe from "./components/UploadandTranscribe"; // ✅ Fixed import
import AIAssistant from "./pages/AIAssistant";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (splashDone && !localStorage.getItem("onboardingComplete")) {
      const timer = setTimeout(() => setShowIntro(true), 300);
      return () => clearTimeout(timer);
    }
  }, [splashDone]);

  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <GPTProvider>
            <FontSizeProvider>
              {!splashDone ? (
                <AnimatedSplash onComplete={() => setSplashDone(true)} />
              ) : (
                <>
                  <Routes>
                    <Route element={<Layout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/upload" element={<UploadAndTranscribe />} /> {/* ✅ FIXED */}
                      <Route path="/assistant" element={<AIAssistant />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/purchase" element={<Purchase />} />
                      <Route path="/apify" element={<ApifyTest />} />
                    </Route>
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  {showIntro && (
                    <OnboardingModal onClose={() => setShowIntro(false)} />
                  )}
                </>
              )}
            </FontSizeProvider>
          </GPTProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

