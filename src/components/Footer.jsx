import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full px-6 py-6 mt-auto text-sm text-center text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-700 bg-background-light dark:bg-background-dark">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 max-w-screen-xl mx-auto">
        {/* Branding & Copyright */}
        <div>
          &copy; {year} <span className="text-primary font-semibold">EchoScript.AI</span>. All rights reserved.
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap items-center gap-4 justify-center text-xs">
          <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            Terms of Service
          </Link>
          <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            Contact
          </Link>
          <Link to="/faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            FAQ
          </Link>
        </div>
      </div>
    </footer>
  );
}
