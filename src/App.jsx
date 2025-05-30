// src/App.jsx

import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/useTheme";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import EchoAssistantUltra from "./components/EchoAssistantUltra";

// Pages
import Home from "./pages/Home";
import Transcription from "./pages/Transcription";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Purchase from "./pages/Purchase";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

function Layout() {
  return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col font-sans transition-all duration-300 ease-in-out">
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
          <Outlet />
        </main>
      </div>
      <Footer />
      <EchoAssistantUltra />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/transcription" element={<Transcription />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<Account />} />
          <Route path="/purchase" element={<Purchase />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}


