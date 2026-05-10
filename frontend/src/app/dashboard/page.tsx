'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
import { portfolioApi } from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Layers, 
  Cpu, 
  Edit2, 
  Check, 
  FolderKanban, 
  Sparkles, 
  User, 
  FileText,
  ArrowUpRight,
  UploadCloud,
  Loader2,
  FileCheck,
  ExternalLink,
  Eye,
  TrendingUp,
  MousePointer,
  Download
} from 'lucide-react';
import Link from 'next/link';

// Import Recharts components for statistical visual charts
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function DashboardHome() {
  const { portfolio, updatePortfolioState, loading, saving } = useDashboard();
  const { user } = useAuth();

  // Internal component states for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Resume Upload State variables
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Analytics API loading states
  const [analyticsData, setAnalyticsData] = useState<{
    totals: { views: number; clicks: number; downloads: number };
    dailyStats: Array<{ date: string; views: number; clicks: number; downloads: number }>;
  } | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Hydration boundary tracker to support clean Next.js charting
  const [mounted, setMounted] = useState(false);

  // Dynamic Toast Alerts
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' }[]>([]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Hydrate inputs and fetch stats on mount
  useEffect(() => {
    setMounted(true);
    if (portfolio) {
      setFullName(portfolio.fullName || '');
      setTitle(portfolio.title || '');
      setBio(portfolio.bio || '');
      setAvatarUrl(portfolio.avatarUrl || '');
    }
  }, [portfolio]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoadingAnalytics(true);
      try {
        const res = await portfolioApi.getMyAnalytics();
        if (res.success) {
          setAnalyticsData(res.data);
        }
      } catch (err: any) {
        console.error('Failed to load user analytics', err);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider font-mono">Syncing Dashboard Shell...</span>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="p-8 text-center bg-zinc-900/30 border border-zinc-900 rounded-2xl m-8">
        <p className="text-zinc-400 text-sm">No portfolio found. Please refresh or check database status.</p>
      </div>
    );
  }

  // Calculate completion percentage dynamically (incorporating Resume weight!)
  const calculateCompletion = () => {
    let score = 0;
    if (portfolio.fullName && portfolio.fullName !== 'Your Name') score += 15;
    if (portfolio.title && portfolio.title !== 'Full Stack Engineer') score += 15;
    if (portfolio.bio && portfolio.bio.length > 30) score += 20;
    if (portfolio.skills && portfolio.skills.length > 0) score += 15;
    if (portfolio.projects && portfolio.projects.length > 0) score += 15;
    if (portfolio.experience && portfolio.experience.length > 0) score += 10;
    if (portfolio.resumeUrl) score += 10; // Extra 10% for uploading a PDF resume!
    return score;
  };

  const completionPercent = calculateCompletion();

  const handleSaveProfile = () => {
    updatePortfolioState({
      fullName,
      title,
      bio,
      avatarUrl
    });
    setIsEditing(false);
    showToast('Core credentials updated local state!', 'success');
  };

  // Binary PDF Resume Upload handler
  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Type filtering guard
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF documents are allowed.');
      showToast('Invalid file format. Please upload a PDF.', 'error');
      return;
    }

    setUploadError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await portfolioApi.uploadResume(formData);
      if (res.success) {
        showToast('PDF resume uploaded and synced!', 'success');
        
        // Sync local context state dynamically
        updatePortfolioState({
          resumeUrl: res.resumeUrl
        });
      }
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed.');
      showToast(err.message || 'File upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Format date strings into cleaner horizontal axis labels (e.g. May 10)
  const formatAxisLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length < 3) return dateStr;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return `${monthNames[monthIdx]} ${day}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto relative min-h-[85vh]">
      
      {/* Absolute Toast alerts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 25, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className={`px-5 py-3.5 rounded-xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 min-w-[240px] backdrop-blur-md ${
                toast.type === 'success' 
                  ? 'bg-emerald-950/80 border-emerald-500/20 text-emerald-400' 
                  : 'bg-rose-950/80 border-rose-500/20 text-rose-400'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current inline-block shrink-0 animate-pulse" />
              <div className="flex-1">{toast.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Page Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-5 gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2 font-mono">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            CONSOLE_DASHBOARD
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-0.5">
            Monitor real-time visitor interactions, customize biography settings, check file uploads, and spotlight project catalogs.
          </p>
        </div>
        
        {portfolio.fullName && (
          <a
            href={`/portfolio/${user?.username}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <span>Preview Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
          </a>
        )}
      </div>

      {/* A. Integrated Analytics Metrics Cards (Total counters!) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden backdrop-blur-md">
          <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-xl">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest font-mono">Profile Views</div>
            <div className="text-2xl font-black mt-1 text-white">
              {loadingAnalytics ? '...' : analyticsData?.totals?.views || 0}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/[0.02] rounded-full blur-2xl" />
        </div>

        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden backdrop-blur-md">
          <div className="p-3.5 bg-violet-500/10 text-violet-400 rounded-xl">
            <MousePointer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest font-mono">Project Clicks</div>
            <div className="text-2xl font-black mt-1 text-white">
              {loadingAnalytics ? '...' : analyticsData?.totals?.clicks || 0}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-violet-500/[0.02] rounded-full blur-2xl" />
        </div>

        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden backdrop-blur-md">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest font-mono">CV Downloads</div>
            <div className="text-2xl font-black mt-1 text-white">
              {loadingAnalytics ? '...' : analyticsData?.totals?.downloads || 0}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/[0.02] rounded-full blur-2xl" />
        </div>

      </div>

      {/* Main Layout grid: Profile Cards, Completions, PDF Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Interactive Profile Card */}
        <div className="lg:col-span-8 bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
          
          <div>
            <div className="flex items-center justify-between border-b border-zinc-850/60 pb-5 mb-6 select-none">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                Core Developer Profile
              </h3>
              
              <button
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 hover:border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white rounded-xl transition-all cursor-pointer"
              >
                {isEditing ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Save Updates
                  </>
                ) : (
                  <>
                    <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                    Edit Settings
                  </>
                )}
              </button>
            </div>

            {!isEditing ? (
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="relative shrink-0 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity" />
                  <img
                    src={portfolio.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200'}
                    alt={portfolio.fullName}
                    className="w-20 h-20 rounded-full border border-zinc-800 relative z-10 object-cover"
                  />
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <h4 className="text-xl font-extrabold text-white tracking-tight">{portfolio.fullName}</h4>
                    <p className="text-xs font-semibold text-indigo-400 mt-1">{portfolio.title}</p>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed font-sans">{portfolio.bio}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-indigo-500 rounded-xl text-sm outline-none transition-all text-white font-sans"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Professional Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-indigo-500 rounded-xl text-sm outline-none transition-all text-white font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Avatar Image URL</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-indigo-500 rounded-xl text-sm outline-none transition-all text-white font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Professional Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-indigo-500 rounded-xl text-sm outline-none transition-all text-white resize-none font-sans"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-6 mt-6 border-t border-zinc-850/40 text-xs text-zinc-500 font-mono select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Email: <span className="text-zinc-300 font-semibold">{portfolio.contact?.email}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Theme: <span className="text-zinc-300 font-semibold uppercase">{portfolio.template}</span></span>
            </div>
          </div>
        </div>

        {/* Right Columns: Stats widgets & PDF Resume Uploader */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          
          {/* 1. Profile Strength Widget */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md text-center">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-6 select-none">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Profile Strength
            </h3>

            {/* Radial progress circle */}
            <div className="relative flex items-center justify-center mb-5 select-none">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-zinc-850"
                  strokeWidth="7"
                  fill="transparent"
                />
                <motion.circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-indigo-500"
                  strokeWidth="7"
                  fill="transparent"
                  strokeDasharray={289}
                  initial={{ strokeDashoffset: 289 }}
                  animate={{ strokeDashoffset: 289 - (289 * completionPercent) / 100 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-black tracking-tight text-white">{completionPercent}%</span>
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider mt-0.5">Strength</span>
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 leading-relaxed max-w-[220px]">
              {completionPercent === 100 
                ? 'Your profile is completely hydrated and optimized!' 
                : 'Upload a PDF resume, complete your bio, or add active skills to unlock full potential!'}
            </p>
          </div>

          {/* 2. PDF Resume upload & preview card */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-zinc-850/60 pb-3.5 mb-4 select-none">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Resume Document
              </h3>
              {portfolio.resumeUrl && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-md uppercase">
                  <FileCheck className="w-3 h-3" /> Active
                </span>
              )}
            </div>

            {/* Upload container slot */}
            {portfolio.resumeUrl ? (
              <div className="space-y-4">
                <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center gap-3 select-none">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-white truncate">curriculum_vitae.pdf</h5>
                    <p className="text-[10px] text-zinc-500 font-medium font-sans mt-0.5">Linked securely in MongoDB</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a 
                    href={portfolio.resumeUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 hover:border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-450" />
                    View PDF
                  </a>
                  
                  <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.25)] rounded-xl cursor-pointer">
                    <UploadCloud className="w-3.5 h-3.5" />
                    Replace
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleResumeChange} 
                      className="hidden" 
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="border border-dashed border-zinc-850 hover:border-indigo-500/40 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer group transition-all bg-zinc-950/40 hover:bg-indigo-500/[0.01]">
                  <UploadCloud className="w-8 h-8 text-zinc-650 group-hover:text-indigo-400 transition-colors mb-3" />
                  <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">Upload PDF Resume</span>
                  <span className="text-[10px] text-zinc-500 mt-1 max-w-[180px] leading-relaxed">Select your official resume file (Max 5MB)</span>
                  
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleResumeChange} 
                    className="hidden" 
                    disabled={uploading}
                  />
                </label>
              </div>
            )}

            {/* Loader / Error statuses */}
            {uploading && (
              <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Syncing File...</span>
              </div>
            )}

            {uploadError && (
              <p className="text-[10px] text-rose-400 font-semibold mt-2.5 text-center">{uploadError}</p>
            )}

          </div>

        </div>

      </div>

      {/* B. Temporal Engagement Stream Recharts Chart! */}
      <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-850/60 pb-5 mb-6 gap-3 select-none">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Visitor Engagement Stream
            </h3>
            <p className="text-[10px] text-zinc-500 font-sans mt-1">
              Historical view and click aggregates monitored over the past 7 daily intervals.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-1 bg-blue-500 rounded-full" />
              <span>Views</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-1 bg-indigo-500 rounded-full" />
              <span>Clicks</span>
            </div>
          </div>
        </div>

        {/* Real-time Recharts Area Graph */}
        <div className="h-64 sm:h-72 w-full pt-1">
          {mounted && analyticsData?.dailyStats && analyticsData.dailyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analyticsData.dailyStats}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  {/* Linear gradient swatches */}
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="rgba(255,255,255,0.03)" 
                />

                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatAxisLabel}
                  tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 600, fontFamily: 'monospace' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.04)' }}
                  tickLine={false}
                />

                <YAxis 
                  tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 600, fontFamily: 'monospace' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.04)' }}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#1f2937',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    color: '#ffffff',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ fontSize: '10px', fontWeight: 600 }}
                  labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                />

                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                  name="Page Views"
                />

                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorClicks)"
                  name="Project Clicks"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono">Formulating charts matrix...</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Quick-Links Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 select-none">
        
        <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-bold uppercase">Spotlight Projects</div>
              <div className="text-xl font-bold mt-0.5 text-white">{portfolio.projects?.length || 0} Showcase</div>
            </div>
          </div>
          <Link href="/dashboard/projects">
            <div className="p-1.5 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-bold uppercase">Active Skills</div>
              <div className="text-xl font-bold mt-0.5 text-white">{portfolio.skills?.length || 0} Tagged</div>
            </div>
          </div>
          <Link href="/dashboard/skills">
            <div className="p-1.5 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/10 text-pink-400 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-bold uppercase">Milestones</div>
              <div className="text-xl font-bold mt-0.5 text-white">{portfolio.experience?.length || 0} Experience</div>
            </div>
          </div>
          <div className="p-1.5 bg-zinc-950 border border-zinc-850/40 text-zinc-650 rounded-lg">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* Recent Projects Showcase Panel */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 select-none">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Recent Spotlight Projects
          </h3>
          <Link href="/dashboard/projects" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            Manage Spotlight
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.projects && portfolio.projects.length > 0 ? (
            portfolio.projects.slice(0, 3).map((proj, idx) => (
              <div key={idx} className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-5 relative overflow-hidden group">
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{proj.title}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed mt-2 line-clamp-2">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-4 select-none">
                  {proj.techStack?.slice(0, 3).map((tech, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 bg-zinc-950 border border-zinc-850 text-[9px] font-semibold text-zinc-400 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center bg-zinc-900/10 border border-zinc-900 border-dashed rounded-xl select-none">
              <p className="text-xs text-zinc-500">No spotlight projects recorded inside stack yet.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
