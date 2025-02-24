"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand Name */}
        <Link href="/" className="text-white text-2xl font-bold">
          SurveyPay
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="text-blue-900 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/login"
            className="text-blue-900 hover:text-blue-200 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-blue-500 hover:text-blue-200 transition-colors"
          >
            Signup
          </Link>
        </div>

        {/* Mobile Menu Button (Hamburger Icon) */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu (Conditionally Rendered) */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2">
          <Link href="/" className="block text-blue-500 py-2 hover:bg-blue-500">
            Home
          </Link>
          <Link
            href="/login"
            className="block text-blue-500 py-2 hover:bg-blue-500"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="block text-blue-500 py-2 hover:bg-blue-500"
          >
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
}
