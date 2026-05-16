'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  CheckCircle2, 
  LogOut, 
  User as UserIcon, 
  TrendingUp,
  Link as LinkIcon,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { unsavedChanges, saveChanges, saving } = useDashboard();
  const { showToast } = useToast();

  // Parse path to yield a clean breadcrumb title
  const getPageTitle = () => {
    if (pathname.includes('/projects')) return 'Projects Manager';
    if (pathname.includes('/skills')) return 'Skills & Tech Stack';
    if (pathname.includes('/settings')) return 'Theme Settings';
    return 'Dashboard Overview';
  };

  const handleSave = async () => {
    const success = await saveChanges();
    if (success) {
      showToast('Changes synchronized with MongoDB!', 'success');
    }
  };

  const handleCopyLink = () => {
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/portfolio/${user?.username}`;
    
    navigator.clipboard.writeText(shareableUrl).then(() => {
      showToast('Portfolio link copied!', 'success');
    }).catch(() => {
      showToast('Failed to copy link.', 'error');
    });
  };

  return (
    <header className="h-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
          <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Admin</Link>
          <span>&gt;</span>
          <span className="text-zinc-400">{pathname.split('/').pop() || 'overview'}</span>
        </div>
        <h2 className="text-lg font-extrabold text-white mt-0.5 tracking-tight">{getPageTitle()}</h2>
      </div>

      {/* Control Actions Section */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Quick Share Button */}
        <button
          onClick={handleCopyLink}
          className="p-2.5 bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer hidden sm:flex"
          title="Copy Public Portfolio Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* Dynamic Save Changes Banner */}
        <AnimatePresence mode="wait">
          {unsavedChanges ? (
            <motion.button
              key="save-active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-xs font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:shadow-[0_0_20px_rgba(99,102,241,0.45)] rounded-full transition-all border border-indigo-400/20 cursor-pointer animate-pulse"
            >
              {saving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save Changes
            </motion.button>
          ) : (
            <motion.div
              key="save-saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              All Saved
            </motion.div>
          )}
        </AnimatePresence>

        {/* Separator line */}
        <span className="w-px h-6 bg-zinc-850" />

        {/* User profile dropdown badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/10 border border-zinc-800 flex items-center justify-center text-indigo-400">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-white truncate max-w-[120px]">{user?.username}</div>
            <button 
              onClick={logout}
              className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors cursor-pointer mt-0.5"
            >
              <LogOut className="w-2.5 h-2.5" />
              Sign Out
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
