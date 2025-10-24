import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Minimal, default-exported Navbar component with dark/light toggle.
// Tailwind classes, rounded corners, and accessible toggle button.

export default function Navbar() {
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggle = () => setIsDark((v) => !v);

  return (
    <header className="w-full bg-transparent">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold">
            SMARTDEV
          </Link>
          <div className="hidden md:flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <Link to="/services" className="hover:text-blue-500">Services</Link>
            <Link to="/wallet" className="hover:text-blue-500">Wallet</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline-block text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 hover:shadow"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="hidden sm:inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2 shadow-md"
          >
            Get Started
          </Link>

          <Link
            to="/settings"
            aria-label="Settings"
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-105 transition"
          >
            <span className="text-gray-700 dark:text-gray-200 text-lg">⚙️</span>
          </Link>

          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-105 transition"
          >
            {isDark ? <span className="text-yellow-400 text-lg">🌞</span> : <span className="text-gray-700 dark:text-gray-200 text-lg">🌙</span>}
          </button>
        </div>
      </nav>
    </header>
  );
}