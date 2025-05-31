import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "./context/useTheme";
import { GPTProvider } from "./context/GPTContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import EchoAssistantUltra from "./components/EchoAssistantUltra";
import OnboardingModal from "./components/OnboardingModal";
import MobileBottomNav from "./components/MobileBottomNav";
import ToastContainer from "./components/ToastContainer";
import { AnimatePresence } from "framer-motion";
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
import Dashboard from "./pages/Dashboard";


function Layout() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen flex flex-col font-sans transition-all duration-300 ease-in-out">
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
          <Outlet />
        </main>
      </div>
      <Footer />
      <MobileBottomNav />
      <EchoAssistantUltra />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (splashDone && !localStorage.getItem("onboardingComplete")) {
      setTimeout(() => setShowIntro(true), 300); // short delay after splash
    }
  }, [splashDone]);

  return (
    <ThemeProvider>
      <GPTProvider>
        <AnimatePresence mode="wait">
          {!splashDone && <AnimatedSplash onComplete={() => setSplashDone(true)} />}
        </AnimatePresence>

        {splashDone && (
          <>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/transcription" element={<Transcription />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/account" element={<Account />} />
                <Route path="/purchase" element={<Purchase />} />
                <Route path="/apify" element={<ApifyTest />} />
		  <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ Add this */}
              </Route>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>

            {showIntro && <OnboardingModal onClose={() => setShowIntro(false)} />}
          </>
        )}
      </GPTProvider>
    </ThemeProvider>
  );
}

