'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Database, Code, ShieldCheck, Heart } from 'lucide-react';

interface HeroProps {
  onOpenCreator: () => void;
  onScrollToExplore: () => void;
}

export default function Hero({ onOpenCreator, onScrollToExplore }: HeroProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-950 pt-28 pb-16">
      
      {/* Visual background enhancements: floating glowing radial blobs */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] max-w-[450px] max-h-[450px] rounded-full bg-violet-600/15 blur-[150px] pointer-events-none animate-pulse duration-[8000ms]" />
      
      {/* Background grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(9,9,11,0.95)_100%)] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 text-left space-y-8"
          >
            {/* Tag / Badge */}
            <motion.div variants={itemVariants} className="inline-flex">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                <Sparkles className="w-3.5 h-3.5 animate-spin duration-1000" />
                No-code Portfolio Builder for Engineers
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              Build Your Dream <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Developer Portfolio
              </span> <br />
              in Real-Time.
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-lg text-zinc-400 max-w-xl leading-relaxed"
            >
              Create, customize, and manage a professional full-stack portfolio with zero frontend boilerplate. Crafted in Next.js, fueled by Node, and backed safely in MongoDB.
            </motion.p>

            {/* Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenCreator}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-base font-bold text-white shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all cursor-pointer border border-indigo-400/20"
              >
                Create Portfolio Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                whileTap={{ scale: 0.98 }}
                onClick={onScrollToExplore}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-transparent border border-zinc-700 text-base font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                Explore Examples
              </motion.button>
            </motion.div>

            {/* Features list bullet points */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80 max-w-lg"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-zinc-400">MongoDB Persistence</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-zinc-400">Next.js App Router</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-zinc-400">Ready to Deploy</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Right Code Editor Visual Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Glow backing */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-25" />
            
            {/* Editor interface window */}
            <div className="relative bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60 bg-zinc-950/80">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="text-xs font-mono text-zinc-500">PortfolioModel.js — Saved</div>
                <div className="w-8" /> {/* Spacer */}
              </div>

              {/* Code display inside mockup */}
              <div className="p-5 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto text-zinc-400">
                <div>
                  <span className="text-indigo-400">import</span> Mongoose, {'{ Schema }'} <span className="text-indigo-400">from</span> <span className="text-emerald-300">'mongoose'</span>;
                </div>
                <div className="text-zinc-600">// Define portfolio structural schemas</div>
                <div className="mt-2">
                  <span className="text-pink-400">const</span> DeveloperPortfolio = <span className="text-indigo-400">new</span> <span className="text-amber-300">Schema</span>({'{'}
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">fullName</span>: {'{ type: String, required: '} <span className="text-emerald-400">true</span> {'}'},
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">title</span>: {'{ type: String, required: '} <span className="text-emerald-400">true</span> {'}'},
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">bio</span>: {'{ type: String }'},
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">skills</span>: [String],
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">experience</span>: [ExperienceSchema],
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">projects</span>: [ProjectSchema],
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">template</span>: {'{ type: String, default: '} <span className="text-emerald-300">'dark'</span> {'}'}
                </div>
                <div>{'}'});</div>

                {/* Simulated Floating badge inside code frame */}
                <motion.div 
                  initial={{ y: 5 }}
                  animate={{ y: -5 }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 3, ease: 'easeInOut' }}
                  className="absolute bottom-6 right-6 bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-xl flex items-center gap-3.5 max-w-[240px]"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                    <Database className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Interactive MongoDB</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                      Live Connection Est.
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
