// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand / About */}
          <div>
            <h2 className="text-2xl font-bold text-white">MyApp</h2>
            <p className="mt-3 text-sm">
              Building awesome experiences with React + Tailwind.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Links</h3>
            <ul className="mt-3 space-y-2">
              <li><a href="/" className="hover:text-yellow-400">Home</a></li>
              <li><a href="/about" className="hover:text-yellow-400">About</a></li>
              <li><a href="/services" className="hover:text-yellow-400">Services</a></li>
              <li><a href="/contact" className="hover:text-yellow-400">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="mt-3 space-y-2">
              <li><a href="/blog" className="hover:text-yellow-400">Blog</a></li>
              <li><a href="/faq" className="hover:text-yellow-400">FAQ</a></li>
              <li><a href="/support" className="hover:text-yellow-400">Support</a></li>
              <li><a href="/privacy" className="hover:text-yellow-400">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <div className="mt-3 flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                Twitter
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;