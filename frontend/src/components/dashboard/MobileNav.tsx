'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Cpu, 
  Palette, 
  GitBranch 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { name: 'Skills', href: '/dashboard/skills', icon: Cpu },
    { name: 'GitHub', href: '/dashboard/github', icon: GitBranch },
    { name: 'Theme', href: '/dashboard/settings', icon: Palette },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 pb-safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all">
              <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <Icon className="w-5 h-5" />
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full"
                  />
                )}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
