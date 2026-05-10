'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Code, Plus, LogIn, LayoutDashboard, LogOut } from 'lucide-react';

interface NavbarProps {
  onOpenCreator: () => void;
  onScrollToExplore: () => void;
}

export default function Navbar({ onOpenCreator, onScrollToExplore }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleBuildYoursClick = () => {
    if (user) {
      onOpenCreator();
    } else {
      router.push('/login');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', onClick: onScrollToExplore },
    { name: 'Features', href: '#features' },
    ...(user ? [{ name: 'Dashboard', onClick: () => router.push('/dashboard') }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-zinc-950/75 backdrop-blur-md border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group cursor-pointer">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
              <Code className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-zinc-200 to-indigo-400 bg-clip-text text-transparent tracking-tight">
              Dev<span className="text-indigo-400 font-extrabold">Porto</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              link.onClick ? (
                <button
                  key={idx}
                  onClick={link.onClick}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-250 cursor-pointer"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={idx}
                  href={link.href || '#'}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-250"
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-5">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-bold text-zinc-450 hover:text-white transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              </>
            )}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBuildYoursClick}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_25px_rgba(99,102,241,0.45)] border border-indigo-400/25 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Build Yours
            </motion.button>
          </div>

          {/* Hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white p-2 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-zinc-900 bg-zinc-950/95"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link, idx) => (
                link.onClick ? (
                  <button
                    key={idx}
                    onClick={() => {
                      link.onClick!();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={idx}
                    href={link.href || '#'}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <div className="pt-4 border-t border-zinc-900 space-y-3">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        router.push('/dashboard');
                        setIsOpen(false);
                      }}
                      className="block w-full text-center px-3 py-2.5 rounded-lg text-base font-medium text-indigo-400 hover:text-indigo-300 hover:bg-zinc-900"
                    >
                      Dashboard Control Center
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-center px-3 py-2.5 rounded-lg text-base font-medium text-rose-400 hover:bg-zinc-900"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      router.push('/login');
                      setIsOpen(false);
                    }}
                    className="block w-full text-center px-3 py-2.5 rounded-lg text-base font-medium text-zinc-400 hover:text-white hover:bg-zinc-900"
                  >
                    Sign In
                  </button>
                )}
                <button
                  onClick={() => {
                    handleBuildYoursClick();
                    setIsOpen(false);
                  }}
                  className="block w-full text-center px-3 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-base font-semibold text-white cursor-pointer"
                >
                  Build Yours Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
