// Header.jsx
'use client';
import React, { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-bold">Paper Chat</div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            <a href="/" className="hover:text-yellow-400">Home</a>
            <a href="/about" className="hover:text-yellow-400">About</a>
            <a href="/graph" className="hover:text-yellow-400">Graph Viz</a>
            <a href="/contact" className="hover:text-yellow-400">Contact</a>
          </nav>

          

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              {isOpen ? (
                <span className="text-2xl">&times;</span> // Close icon
              ) : (
                <span className="text-2xl">&#9776;</span> // Hamburger icon
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4">
          <nav className="flex flex-col space-y-3">
            <a href="/" className="hover:text-yellow-400">Home</a>
            <a href="/about" className="hover:text-yellow-400">About</a>
            <a href="/graph" className="hover:text-yellow-400">Graph Viz</a>
            <a href="/contact" className="hover:text-yellow-400">Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
