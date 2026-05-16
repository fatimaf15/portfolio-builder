'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { portfolioApi } from '../utils/api';
import { Portfolio } from '../types';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PortfolioList from '../components/PortfolioList';
import PortfolioCreator from '../components/PortfolioCreator';
import { 
  Terminal, 
  Cpu, 
  Workflow, 
  Layers, 
  CheckCircle,
  Database,
  ArrowRight,
  Server
} from 'lucide-react';

export default function Home() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleOpenCreator = () => {
    if (user) {
      setShowCreator(true);
    } else {
      router.push('/login');
    }
  };

  // Fetch portfolios on component mount
  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const res = await portfolioApi.getPortfolios();
      if (res.success) {
        setPortfolios(res.data);
        setDbConnected(true);
      }
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      // Fallback: If backend is not running, let's keep list empty but log error status
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  // Handle deleting portfolio
  const handleDeletePortfolio = async (id: string) => {
    const confirmed = window.confirm('Permanently delete this document from your MongoDB cloud?');
    if (!confirmed) return;

    try {
      const res = await portfolioApi.deletePortfolio(id);
      if (res.success) {
        showToast('Document deleted from cloud successfully', 'success');
        fetchPortfolios();
      }
    } catch (err: any) {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  // Handle seeding database with template portfolios
  const handleSeedDatabase = async () => {
    setLoading(true);
    try {
      const res = await portfolioApi.seedData();
      if (res.success) {
        showToast('Database populated with seed profiles!', 'success');
        setPortfolios(res.data);
        setDbConnected(true);
      }
    } catch (err: any) {
      showToast(`Connection Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a portfolio
  const handleCreatePortfolio = async (newPortfolio: Omit<Portfolio, '_id'>) => {
    try {
      const res = await portfolioApi.createPortfolio(newPortfolio);
      if (res.success) {
        showToast('Nice! Portfolio document inserted successfully!', 'success');
        fetchPortfolios();
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(`Failed to save: ${err.message}`, 'error');
      return false;
    }
  };

  // Smooth scroll handler
  const handleScrollToExplore = () => {
    const section = document.getElementById('explore-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500 selection:text-white">
      
      {/* Header and Navbar */}
      <Navbar 
        onOpenCreator={handleOpenCreator} 
        onScrollToExplore={handleScrollToExplore} 
      />

      {/* Main Hero Section */}
      <Hero 
        onOpenCreator={handleOpenCreator} 
        onScrollToExplore={handleScrollToExplore} 
      />

      {/* Database connection status notice banner */}
      <div className="bg-zinc-950 flex justify-center py-4 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold ${
            dbConnected === true ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
            dbConnected === false ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
            'bg-zinc-900 border border-zinc-800 text-zinc-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              dbConnected === true ? 'bg-emerald-400 animate-ping' :
              dbConnected === false ? 'bg-amber-400' :
              'bg-zinc-500 animate-pulse'
            }`} />
            {dbConnected === true ? 'MongoDB Active: Live sync running' :
             dbConnected === false ? 'Local API Offline: Showing template mode (Please start your backend express server)' :
             'Checking Backend Connection...'}
          </div>
        </div>
      </div>

      {/* Dynamic Portfolios Showcase Grid */}
      <PortfolioList 
        portfolios={portfolios}
        loading={loading}
        onDelete={handleDeletePortfolio}
        onSeed={handleSeedDatabase}
      />

      {/* Modern explanation & educational design layout (Features Section) */}
      <section id="features" className="py-24 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[35vw] h-[35vw] rounded-full bg-indigo-900/5 blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase">Architecture breakdown</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
              How the Full-Stack Sync Works
            </h2>
            <p className="mt-4 text-zinc-400">
              DevPorto operates as a classic modern MERN architecture, splitting tasks elegantly between client-side interactions and server-side processing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 card */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">1. Frontend Client (Next.js)</h3>
              <p className="text-sm text-zinc-450 leading-relaxed mb-4">
                Built with the Next.js App Router, Tailwind CSS for visual systems, and Framer Motion for premium-feel animations. State variables manage interactive local entries.
              </p>
              <div className="text-xs font-mono text-zinc-500 bg-zinc-950 p-3 rounded-lg border border-zinc-900/60">
                // Axios calls with credentials<br />
                axios.post('/portfolios', data)
              </div>
            </div>

            {/* Step 2 card */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">2. REST API Server (Express)</h3>
              <p className="text-sm text-zinc-450 leading-relaxed mb-4">
                Node and Express form the API routing layer. Environment variables load securely, CORS settings whitelist frontend requests, and customized middleware captures errors gracefully.
              </p>
              <div className="text-xs font-mono text-zinc-500 bg-zinc-950 p-3 rounded-lg border border-zinc-900/60">
                // Express controller handler<br />
                app.use('/api/portfolios', routes)
              </div>
            </div>

            {/* Step 3 card */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-6">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">3. NoSQL Database (MongoDB)</h3>
              <p className="text-sm text-zinc-450 leading-relaxed mb-4">
                Mongoose models declare developer profile schemas in strict JavaScript structures. BSON documents are stored in the cloud or local MongoDB, enabling fast retrieval and scaling.
              </p>
              <div className="text-xs font-mono text-zinc-500 bg-zinc-950 p-3 rounded-lg border border-zinc-900/60">
                // Mongoose Schema operations<br />
                await Portfolio.create(req.body)
              </div>
            </div>

          </div>

          {/* Core connection diagram */}
          <div className="mt-16 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h4 className="text-base font-bold text-white">Ready to build your developer identity?</h4>
              <p className="text-xs text-zinc-400 max-w-md">
                Launch the interactive builder to create your custom portfolio, or explore the live database grid to see how other developer profiles look in production.
              </p>
            </div>
            <div className="flex gap-4 shrink-0">
              <button 
                onClick={handleScrollToExplore}
                className="px-6 py-3 rounded-full bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                Go to Database Grid
              </button>
              <button 
                onClick={() => setShowCreator(true)}
                className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.25)] cursor-pointer"
              >
                Launch Builder
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Footer Branding */}
      <footer className="bg-zinc-950 py-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500 space-y-4">
          <div className="font-bold text-zinc-400 text-sm">DevPorto Builder — MERN Stack Showcase</div>
          <p>© 2026 DevPorto. Built with passion for coding pioneers.</p>
        </div>
      </footer>

      {/* Interactive Creator Overlay (Wizard Modal) */}
      <AnimatePresence>
        {showCreator && (
          <PortfolioCreator 
            onClose={() => setShowCreator(false)} 
            onSubmit={handleCreatePortfolio}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
