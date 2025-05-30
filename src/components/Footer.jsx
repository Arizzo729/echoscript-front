import React from "react";

export default function Footer() {
  return (
    <footer className="w-full px-6 py-4 mt-auto text-sm text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark">
      <div>
        &copy; {new Date().getFullYear()}{" "}
        <span className="text-primary font-semibold">EchoScript.AI</span>. All rights reserved.
      </div>
    </footer>
  );
}
