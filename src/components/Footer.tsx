import React from "react";
import { Youtube, Twitter, Facebook, Instagram, HelpCircle, FileText, Lock, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-neutral-500 border-t border-neutral-900/80 pt-16 pb-8 px-4 md:px-12 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Social Media Links */}
        <div className="flex gap-6 mb-8 text-neutral-400">
          <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
            <Facebook size={20} />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
            <Instagram size={20} />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
            <Twitter size={20} />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
            <Youtube size={20} />
          </a>
        </div>

        {/* Informational Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs mb-10 leading-6">
          <div className="flex flex-col gap-2">
            <a href="#" className="hover:underline hover:text-neutral-300">Audio Description</a>
            <a href="#" className="hover:underline hover:text-neutral-300">Investor Relations</a>
            <a href="#" className="hover:underline hover:text-neutral-300">Legal Notices</a>
            <a href="#" className="hover:underline hover:text-neutral-300">Ad Choices</a>
          </div>
          <div className="flex flex-col gap-2">
            <a href="#" className="hover:underline hover:text-neutral-300">Help Center</a>
            <a href="#" className="hover:underline hover:text-neutral-300">Jobs</a>
            <a href="#" className="hover:underline hover:text-neutral-300">Privacy Policy</a>
            <a href="#" className="hover:underline hover:text-neutral-300">Terms of Use</a>
          </div>
          <div className="flex flex-col gap-2">
            <a href="#" className="hover:underline hover:text-neutral-300">Gift Cards</a>
            <a href="#" className="hover:underline hover:text-neutral-300">Terms of Use</a>
            <a href="#" className="hover:underline hover:text-neutral-300">Corporate Information</a>
            <a href="#" className="hover:underline hover:text-neutral-300">Contact Us</a>
          </div>
          <div className="flex flex-col gap-2">
            <a href="#" className="hover:underline hover:text-neutral-300">Media Center</a>
            <a href="#" className="hover:underline hover:text-neutral-300">Redeem Gift Cards</a>
            <a href="#" className="hover:underline hover:text-neutral-300">Manage Cookies</a>
            <a href="#" className="hover:underline hover:text-neutral-300">Privacy Statement</a>
          </div>
        </div>

        {/* Language Selector & Trademark Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-neutral-900/60 pt-6">
          <div className="flex items-center gap-2 border border-neutral-800 px-3 py-1.5 rounded bg-neutral-950 text-xs text-neutral-400">
            <Globe size={14} />
            <span>English (US)</span>
          </div>

          <div className="text-[11px] text-neutral-600">
            <p className="mb-1">&copy; {currentYear} MovieFlix, Inc. All rights reserved.</p>
            <p>Made with premium dark aesthetics for video straming enthusiasts.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
