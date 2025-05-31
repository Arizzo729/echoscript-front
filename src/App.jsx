import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { ThemeProvider } from "./context/useTheme";
import { GPTProvider } from "./context/GPTContext";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import EchoAssistantUltra from "./components/EchoAssistantUltra";
import OnboardingModal from "./components/OnboardingModal";
import MobileBottomNav from "./components/MobileBottomNav";
import ToastContainer from "./components/ToastContainer";
import AnimatedSplash from "./components/AnimatedSplash";

import "./global.css";

// Pages
import Home from "./pages/HomePage";
import Transcription from "./pages/Transcription";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Purchase from "./pages/Purchase";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import ApifyTest from "./pages/ApifyTest";

const isAuthenticated = () => {
  return localStorage.getItem("auth") === "true";
};

export default function App() {
  const location = useLocation();
  const [splashComplete, setSplashComplete] = useState(
    sessionStorage.getItem("splashShown") === "true"
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!splashComplete) {
      sessionStorage.setItem("splashShown", "true");
    }
  }, [splashComplete]);

  return (
    <ThemeProvider>
      <GPTProvider>
        <AnimatePresence mode="wait">
          {!splashComplete && (
            <AnimatedSplash key="splash" onComplete={() => setSplashComplete(true)} />
          )}
        </AnimatePresence>

        {splashComplete && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 min-h-screen"
          >
            <Header />
            <Sidebar />
            <OnboardingModal />
            <main className="pt-16 pb-20 px-4 md:px-10">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/transcription" element={<Transcription />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/account" element={<Account />} />
                <Route path="/purchase" element={<Purchase />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/apify" element={<ApifyTest />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Outlet />
            </main>
            <MobileBottomNav />
            <ToastContainer />
            <Footer />
            <EchoAssistantUltra />
          </motion.div>
        )}
      </GPTProvider>
    </ThemeProvider>
  );
}

