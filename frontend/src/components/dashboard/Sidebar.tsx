'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Cpu, 
  Palette, 
  ChevronLeft, 
  ChevronRight, 
  Code,
  Sparkles,
  GitBranch
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects Manager', href: '/dashboard/projects', icon: FolderKanban },
    { name: 'Skills & Tech', href: '/dashboard/skills', icon: Cpu },
    { name: 'GitHub Integration', href: '/dashboard/github', icon: GitBranch },
    { name: 'Theme Settings', href: '/dashboard/settings', icon: Palette },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 25 }}
      className="hidden md:flex flex-col h-screen sticky top-0 bg-zinc-950 border-r border-zinc-900 z-50 select-none shrink-0 overflow-x-hidden"
    >
      {/* Brand Header */}
      <div className="h-20 px-6 border-b border-zinc-900/80 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="p-2 bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 rounded-lg group-hover:bg-indigo-500/25 transition-all">
            <Code className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold bg-gradient-to-r from-white via-zinc-200 to-indigo-400 bg-clip-text text-transparent tracking-tight font-sans"
            >
              Dev<span className="text-indigo-400 font-extrabold">Porto</span>
            </motion.span>
          )}
        </Link>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <div className="relative group">
                <div
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'text-white' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}

                  {/* Glowing Active Background Highlight */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 bg-zinc-900/60 border border-zinc-800 rounded-xl -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Active Sidebar Vertical Glow Bar */}
                  {isActive && !isCollapsed && (
                    <motion.div 
                      layoutId="sidebar-active-bar"
                      className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-full"
                    />
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Action Button */}
      <div className="p-4 border-t border-zinc-900 mt-auto">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2.5 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 text-zinc-500 hover:text-white rounded-xl transition-all cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : (
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-sans">
              <ChevronLeft className="w-4 h-4" />
              Collapse Sidebar
            </span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
