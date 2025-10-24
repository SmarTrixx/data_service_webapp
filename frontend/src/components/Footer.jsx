import React from "react";

// Minimal default-exported Footer component matching SmartDev design
export default function Footer() {
  return (
    <footer className="w-full bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-6 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 rounded-t-2xl">
        <p>© {new Date().getFullYear()} SmartDev. All rights reserved.</p>
      </div>
    </footer>
  );
}