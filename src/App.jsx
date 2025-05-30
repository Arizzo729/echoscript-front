import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "./context/useTheme";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import EchoAssistantUltra from "./components/EchoAssistantUltra";
import OnboardingModal from "./components/OnboardingModal";
import MobileBottomNav from "./components/MobileBottomNav";

import "./global.css";

// Pages
import Home from "./pages/Home";
import Transcription from "./pages/Transcription";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Purchase from "./pages/Purchase";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import ApifyTest from "./pages/ApifyTest";

function Layout() {
  return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col font-sans">
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow px-4 py-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
      <EchoAssistantUltra />
      <OnboardingModal onClose={() => {}} />
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="transcription" element={<Transcription />} />
          <Route path="settings" element={<Settings />} />
          <Route path="account" element={<Account />} />
          <Route path="purchase" element={<Purchase />} />
          <Route path="devtools/apify" element={<ApifyTest />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

