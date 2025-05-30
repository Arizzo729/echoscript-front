// App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "./context/useTheme";
import { GPTProvider } from "./context/GPTContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import EchoAssistantUltra from "./components/EchoAssistantUltra"; // or EchoAssistantUltraStreaming
import OnboardingModal from "./components/OnboardingModal";
import MobileBottomNav from "./components/MobileBottomNav";
import ToastContainer from "./components/ToastContainer";
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

// Auth logic placeholder
const isAuthenticated = () => localStorage.getItem("auth_token") !== null;

// Layout wrapper
function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col font-sans transition-colors duration-300">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        <Sidebar />
        <main className="flex-grow overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-zinc-700">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Footer />
      <EchoAssistantUltra /> {/* or EchoAssistantUltraStreaming */}
      <OnboardingModal />
      <ToastContainer />
      <MobileBottomNav />
    </div>
  );
}

// Root app wrapper
export default function App() {
  return (
    <ThemeProvider>
      <GPTProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="transcription" element={<Transcription />} />
            <Route path="dashboard" element={<Navigate to="/transcription" replace />} />
            <Route path="settings" element={<Settings />} />
            <Route path="account" element={<Account />} />
            <Route path="purchase" element={<Purchase />} />
            <Route path="devtools/apify" element={<ApifyTest />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GPTProvider>
    </ThemeProvider>
  );
}

