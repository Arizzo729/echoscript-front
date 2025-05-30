import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LogoLoader from "../components/LogoLoader";
import OnboardingModal from "../components/OnboardingModal";

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const onboarded = localStorage.getItem("echoscript-onboarded");
    if (onboarded) setShowOnboarding(false);
    else setShowOnboarding(true);
  }, []);

  const handleLoaderComplete = () => setShowLoader(false);
  const handleOnboardingClose = () => {
    localStorage.setItem("echoscript-onboarded", "true");
    setShowOnboarding(false);
  };

  if (showLoader) {
    return <LogoLoader duration={2000} onComplete={handleLoaderComplete} />;
  }

  return (
    <>
      {showOnboarding && <OnboardingModal onClose={handleOnboardingClose} />}

      <motion.section
        className="w-full min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src="/Logo.png"
          alt="EchoScript.AI Logo"
          className="w-36 sm:w-44 md:w-52 mb-6 dark:hidden"
        />
        <img
          src="/EchoScriptAI_Transparent_Dark.png"
          alt="EchoScript.AI Logo Dark"
          className="w-36 sm:w-44 md:w-52 mb-6 hidden dark:block"
        />

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
          EchoScript.AI
        </h1>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-zinc-200">
          The Best Listener
        </h2>
        <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-zinc-400">
          Understanding everyone
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-light transition"
          >
            Get Started
          </Link>
          <Link
            to="/upload"
            className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition"
          >
            Try Uploading
          </Link>
        </div>
      </motion.section>
    </>
  );
}
