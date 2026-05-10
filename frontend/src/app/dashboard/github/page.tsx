'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import { portfolioApi } from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, 
  Search, 
  Star, 
  Users, 
  Folder, 
  Code, 
  Loader2, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface GitHubStats {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguages: Array<{ name: string; count: number }>;
  spotlightRepos: Array<{
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
  }>;
}

export default function GitHubPage() {
  const { portfolio, loading: profileLoading } = useDashboard();
  
  const [usernameInput, setUsernameInput] = useState('');
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-fill username on profile load
  useEffect(() => {
    if (portfolio?.contact?.github) {
      // Extract username from Github URL e.g. https://github.com/john_doe -> john_doe
      const url = portfolio.contact.github;
      const parsed = url.replace(/\/$/, '').split('/').pop();
      if (parsed && parsed !== 'github.com') {
        setUsernameInput(parsed);
      }
    }
  }, [portfolio]);

  const handleSyncGitHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await portfolioApi.getGithubStats(usernameInput.trim());
      if (res.success) {
        setStats(res.data);
        setSuccessMsg(`Successfully retrieved profile for @${res.data.username}!`);
      } else {
        setError('Failed to extract GitHub details. Check your handle name.');
      }
    } catch (err: any) {
      // Capture 403 API exhaustion rate limits
      const msg = err.response?.data?.message || err.message || '';
      if (msg.includes('403') || msg.includes('rate limit')) {
        setError(
          'GitHub API Rate Limit exceeded for your local IP! Please wait an hour, or configure GITHUB_TOKEN inside your server .env file to enable 5,000 requests per hour.'
        );
      } else {
        setError(msg || 'GitHub user not found or connection timed out.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto min-h-[85vh]">
      
      {/* Header section */}
      <div className="border-b border-zinc-900 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-400" />
            GitHub API Core Integrator
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Synchronize external GitHub metrics directly inside your portfolio profile. Fetch real-time total star counts, repository summaries, and programming profiles.
          </p>
        </div>
      </div>

      {/* Sync form layout card */}
      <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.02] rounded-full blur-3xl pointer-events-none" />
        
        <form onSubmit={handleSyncGitHub} className="space-y-4 max-w-xl">
          <label className="text-xs font-bold text-zinc-550 uppercase tracking-wider block">GitHub Developer Profile Account</label>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="e.g. torvalds, gaearon, yyx990803"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-indigo-500 rounded-xl text-sm outline-none transition-all text-white font-semibold"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !usernameInput.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-900 disabled:text-zinc-650 text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] rounded-xl flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Repository...
                </>
              ) : (
                'Synchronize Analytics'
              )}
            </button>
          </div>
        </form>

        {/* API Notifications messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-rose-950/80 border border-rose-500/25 text-rose-400 rounded-xl flex items-start gap-3 text-xs leading-relaxed max-w-2xl"
            >
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <div>
                <p className="font-bold">Sync Failed</p>
                <p className="text-zinc-400 mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-emerald-950/80 border border-emerald-500/25 text-emerald-400 rounded-xl flex items-start gap-3 text-xs leading-relaxed max-w-xl"
            >
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
              <div>
                <p className="font-bold">Fetch Complete</p>
                <p className="text-zinc-350 mt-0.5">{successMsg}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Shimmering Skeletons loader during fetch transaction */}
      {loading && (
        <div className="space-y-8 animate-pulse">
          {/* Stats skeleton boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="h-24 bg-zinc-900/30 border border-zinc-900 rounded-xl p-5" />
            ))}
          </div>
          
          {/* Languages & Repos structure skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 h-64 bg-zinc-900/30 border border-zinc-900 rounded-2xl" />
            <div className="lg:col-span-7 h-64 bg-zinc-900/30 border border-zinc-900 rounded-2xl" />
          </div>
        </div>
      )}

      {/* Results panel container */}
      {!loading && stats && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* User profile row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left bg-zinc-900/10 border border-zinc-900 rounded-2xl p-6">
            <img 
              src={stats.avatarUrl} 
              alt={stats.name} 
              className="w-16 h-16 rounded-full border border-zinc-800 object-cover shrink-0" 
            />
            <div className="space-y-1.5 flex-1">
              <h4 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                {stats.name}
                <span className="text-xs text-zinc-500 font-mono">@{stats.username}</span>
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">{stats.bio}</p>
            </div>
          </div>

          {/* Aggregated Counters row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Stars counter */}
            <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Starred Count</div>
                <div className="text-2xl font-black text-white">{stats.totalStars} Stars</div>
              </div>
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
                <Star className="w-5 h-5 fill-indigo-400/20" />
              </div>
            </div>

            {/* Public repos counter */}
            <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Public Repos</div>
                <div className="text-2xl font-black text-white">{stats.publicRepos} Repos</div>
              </div>
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg shrink-0">
                <Folder className="w-5 h-5" />
              </div>
            </div>

            {/* Followers counter */}
            <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Followers Profile</div>
                <div className="text-2xl font-black text-white">{stats.followers} Followers</div>
              </div>
              <div className="p-3 bg-pink-500/10 text-pink-400 rounded-lg shrink-0">
                <Users className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Breakdown Section Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Top Languages Column */}
            <div className="lg:col-span-5 bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-850 pb-3 mb-5">
                <Code className="w-4 h-4 text-indigo-400" />
                Technology Stack Profile
              </h4>

              {stats.topLanguages.length > 0 ? (
                <div className="space-y-4">
                  {stats.topLanguages.map((lang, idx) => {
                    const totalCounts = stats.topLanguages.reduce((sum, l) => sum + l.count, 0);
                    const percentage = Math.round((lang.count / totalCounts) * 100);

                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                          <span className="text-zinc-300">{lang.name}</span>
                          <span className="text-zinc-500">{percentage}% ({lang.count} repos)</span>
                        </div>
                        {/* Shimmering percent progress bar */}
                        <div className="h-2 bg-zinc-950 border border-zinc-850 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="h-full bg-indigo-500 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 text-center py-6">No top programming languages analyzed on this username.</p>
              )}
            </div>

            {/* Top Repos Spotlight Column */}
            <div className="lg:col-span-7 bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-850 pb-3 mb-5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Spotlight Repositories
              </h4>

              <div className="space-y-4">
                {stats.spotlightRepos.length > 0 ? (
                  stats.spotlightRepos.map((repo, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 bg-zinc-950/40 border border-zinc-850/80 hover:border-zinc-800 rounded-xl flex flex-col justify-between group transition-colors relative"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white font-mono group-hover:text-indigo-400 transition-colors">{repo.name}</h5>
                          <a 
                            href={repo.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-lg transition-all border border-zinc-800 cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <p className="text-[11px] text-zinc-450 leading-relaxed font-sans line-clamp-2">{repo.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-bold font-mono border-t border-zinc-900 pt-3 mt-3">
                        {repo.language && (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            <span>{repo.language}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{repo.stars} Stars</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 text-center py-6">No repositories located for spotlight catalog.</p>
                )}
              </div>
            </div>

          </div>

        </motion.div>
      )}

      {/* Dynamic API Guide alert */}
      <div className="p-4 bg-zinc-900/10 border border-zinc-900 rounded-xl flex gap-3 text-xs text-zinc-500 leading-relaxed max-w-3xl">
        <Clock className="w-5 h-5 shrink-0 mt-0.5 text-indigo-400" />
        <div>
          <p className="font-bold text-zinc-400">Understanding Rates & Limits</p>
          <p className="mt-0.5">
            By default, unauthenticated client inquiries to GitHub APIs are capped at 60 lookups per hour. To raise your boundaries to 5,000 queries, inject a personal access token inside your server environment settings under <code className="text-indigo-400 bg-zinc-950 border border-zinc-900 px-1 rounded">GITHUB_TOKEN=ghp_...</code>.
          </p>
        </div>
      </div>

    </div>
  );
}
