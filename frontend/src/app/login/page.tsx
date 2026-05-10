'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Terminal, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const { login, error, loading, clearError, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
    clearError();
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Frontend validation
    if (!email.trim() || !password) {
      setValidationError('Please fill in all fields');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    const success = await login({ email, password });
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-white selection:bg-indigo-500 selection:text-white">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-10 w-[30vw] h-[30vw] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      {/* Floating Home Link */}
      <div className="absolute top-8 left-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-zinc-300 hover:text-white text-sm transition-all font-semibold"
        >
          <Terminal className="w-4 h-4 text-indigo-400" />
          Back to DevPorto
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="w-full max-w-md z-10"
      >
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-4 shadow-[0_0_15px_rgba(99,102,241,0.15)] animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
          <p className="text-zinc-400 text-sm mt-2">Sign in to publish & manage your portfolios</p>
        </div>

        {/* Card Panel */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
          {/* Action validation or Auth context errors */}
          {(validationError || error) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold leading-relaxed"
            >
              {validationError || error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValidationError(null);
                    clearError();
                  }}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-sm font-medium outline-none transition-all placeholder:text-zinc-650"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setValidationError(null);
                    clearError();
                  }}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-sm font-medium outline-none transition-all placeholder:text-zinc-650"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.2)] rounded-xl transition-all cursor-pointer border border-indigo-400/10 disabled:opacity-55 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Helper Switch Account Type Link */}
          <div className="mt-8 text-center text-sm text-zinc-450 border-t border-zinc-800/60 pt-6">
            Don't have an account yet?{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
