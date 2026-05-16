'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portfolio } from '../types';
import { 
  Briefcase, 
  ExternalLink, 
  Mail, 
  Trash2, 
  Terminal, 
  Layers, 
  Database,
  Sparkles,
  RefreshCw,
  Eye,
  X
} from 'lucide-react';

// Inline brand SVGs since modern lucide-react removed brand icons (v0.400+)
const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);


interface PortfolioListProps {
  portfolios: Portfolio[];
  loading: boolean;
  onDelete: (id: string) => void;
  onSeed: () => void;
}

export default function PortfolioList({ portfolios, loading, onDelete, onSeed }: PortfolioListProps) {
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  const demoPortfolio: Portfolio = {
    _id: 'demo-preview-only',
    fullName: "Alex Developer (Demo Preview)",
    title: "Senior Full Stack Engineer",
    bio: "This is a demo template preview showing how your portfolio will look in the public Explore section. Create your own by clicking 'Launch Builder'!",
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200",
    skills: ["React", "Node.js", "MongoDB", "TypeScript", "Tailwind"],
    experience: [
      {
        company: "Tech Innovations Inc.",
        role: "Frontend Engineer",
        duration: "Jan 2022 - Present",
        description: "Built highly performant and accessible user interfaces."
      }
    ],
    projects: [
      {
        title: "E-Commerce Admin Dashboard",
        description: "Real-time analytics and inventory management system.",
        techStack: ["Next.js", "Tailwind CSS"],
        githubUrl: "https://github.com",
        liveUrl: "https://example.com"
      }
    ],
    contact: {
      email: "demo@example.com",
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    },
    template: "dark"
  };

  const displayPortfolios = portfolios.length > 0 ? portfolios : [demoPortfolio];

  return (
    <div id="explore-section" className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-wider uppercase mb-3">
              <Layers className="w-4 h-4" />
              Live Showcases
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Developer Portfolios
            </h2>
            <p className="mt-3 text-zinc-400 max-w-2xl">
              These developer portfolios are stored directly in MongoDB. Build yours, select a customized theme, and watch it render live instantly.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={onSeed}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
              title="Populate MongoDB with default profiles"
            >
              <Database className="w-4 h-4 text-indigo-400" />
              Seed Database Data
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            <span className="text-zinc-400 text-sm font-medium">Retrieving portfolios from MongoDB...</span>
          </div>
        )}

        {/* Empty State Instructions (only when showing demo) */}
        {!loading && portfolios.length === 0 && (
          <div className="mb-10 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Database Empty — Showing Demo Template
            </div>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto">
              There are no public portfolios in the database yet. Here is a preview of what a portfolio card looks like. Click "Seed Database Data" above to add mock data, or build your own!
            </p>
          </div>
        )}

        {/* Portfolios Grid */}
        {!loading && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${portfolios.length === 0 ? 'justify-items-center' : ''}`}
          >
            {displayPortfolios.map((portfolio) => (
              <motion.div
                key={portfolio._id}
                variants={cardVariants}
                whileHover={{ y: -6, borderColor: 'rgba(99,102,241,0.4)' }}
                className="group relative flex flex-col bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm shadow-xl"
              >
                {/* Theme indicator */}
                <span className={`absolute top-4 right-4 px-2 py-0.5 text-[10px] font-bold rounded-md uppercase border ${
                  portfolio._id === 'demo-preview-only' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                  portfolio.template === 'dark' ? 'bg-zinc-950 text-indigo-400 border-indigo-500/20' :
                  portfolio.template === 'futuristic' ? 'bg-purple-950 text-purple-400 border-purple-500/20' :
                  portfolio.template === 'minimal' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' :
                  'bg-white text-zinc-900 border-zinc-200'
                }`}>
                  {portfolio._id === 'demo-preview-only' ? 'Demo Template' : `${portfolio.template} theme`}
                </span>

                {/* Avatar & Header */}
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={portfolio.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100'}
                    alt={portfolio.fullName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/20 shadow-inner shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {portfolio.fullName}
                    </h3>
                    <p className="text-xs text-zinc-400 font-semibold">{portfolio.title}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-zinc-400 line-clamp-3 mb-6 leading-relaxed flex-grow">
                  {portfolio.bio}
                </p>

                {/* Skills tags preview */}
                <div className="mb-6">
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Primary Tech Stack</div>
                  <div className="flex flex-wrap gap-1.5">
                    {portfolio.skills.slice(0, 5).map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 rounded bg-zinc-950/80 border border-zinc-800 text-[10px] font-semibold text-zinc-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {portfolio.skills.length > 5 && (
                      <span className="px-2 py-1 rounded bg-indigo-950/20 text-[10px] font-bold text-indigo-400 border border-indigo-500/10">
                        +{portfolio.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Projects count & Experience count stats */}
                <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-zinc-800/60 mb-6 bg-zinc-950/30 rounded-lg px-4">
                  <div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase">Projects</div>
                    <div className="text-sm font-bold text-white">{portfolio.projects?.length || 0} Showcases</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase">Jobs</div>
                    <div className="text-sm font-bold text-white">{portfolio.experience?.length || 0} Roles</div>
                  </div>
                </div>

                {/* Actions & Links */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex items-center gap-2">
                    {portfolio.contact?.email && (
                      <a href={`mailto:${portfolio.contact.email}`} className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all">
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {portfolio.contact?.github && (
                      <a href={portfolio.contact.github} target="_blank" rel="noreferrer" className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {portfolio.contact?.linkedin && (
                      <a href={portfolio.contact.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPortfolio(portfolio)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 text-xs font-bold rounded-lg transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect
                    </button>
                    {portfolio._id !== 'demo-preview-only' && (
                      <button
                        onClick={() => portfolio._id && onDelete(portfolio._id)}
                        className="p-2 bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 rounded-lg transition-all cursor-pointer"
                        title="Delete profile from database"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

              </motion.div>
            ))}
          </motion.div>
        )}

      </div>

      {/* High-fidelity Full Screen Interactive Portfolio Inspect Modal */}
      <AnimatePresence>
        {selectedPortfolio && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`relative w-full max-w-5xl rounded-2xl overflow-hidden border shadow-2xl ${
                selectedPortfolio.template === 'futuristic' ? 'bg-zinc-900 border-purple-500/30 shadow-purple-500/10' :
                selectedPortfolio.template === 'minimal' ? 'bg-zinc-900 border-zinc-700 shadow-none' :
                'bg-zinc-900 border-zinc-800'
              }`}
            >
              {/* Theme highlight bar */}
              <div className={`h-2.5 w-full ${
                selectedPortfolio.template === 'futuristic' ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500' :
                selectedPortfolio.template === 'minimal' ? 'bg-zinc-600' :
                'bg-gradient-to-r from-indigo-500 to-indigo-700'
              }`} />

              {/* Modal close */}
              <button 
                onClick={() => setSelectedPortfolio(null)}
                className="absolute top-6 right-6 p-2 bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[85vh] overflow-y-auto p-8 sm:p-10 space-y-12">
                {/* Intro Section */}
                <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
                  <img
                    src={selectedPortfolio.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200'}
                    alt={selectedPortfolio.fullName}
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 ${
                      selectedPortfolio.template === 'futuristic' ? 'border-purple-500/40' : 'border-indigo-500/40'
                    }`}
                  />
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-3xl sm:text-4xl font-extrabold text-white">{selectedPortfolio.fullName}</h3>
                      <p className="text-indigo-400 font-bold mt-1 text-lg">{selectedPortfolio.title}</p>
                    </div>
                    <p className="text-zinc-300 text-base max-w-2xl leading-relaxed">{selectedPortfolio.bio}</p>
                    
                    {/* Contacts inside header */}
                    <div className="flex flex-wrap gap-4 pt-2 justify-center sm:justify-start">
                      <a href={`mailto:${selectedPortfolio.contact.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-zinc-300 hover:text-white text-sm transition-all">
                        <Mail className="w-4 h-4" />
                        {selectedPortfolio.contact.email}
                      </a>
                      {selectedPortfolio.contact.github && (
                        <a href={selectedPortfolio.contact.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-zinc-300 hover:text-white text-sm transition-all">
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      {selectedPortfolio.contact.linkedin && (
                        <a href={selectedPortfolio.contact.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-zinc-300 hover:text-white text-sm transition-all">
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tech Stack Skills */}
                <div className="space-y-4 pt-6 border-t border-zinc-800/80">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Technical Toolkit</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPortfolio.skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                          selectedPortfolio.template === 'futuristic' ? 'bg-purple-950/20 text-purple-300 border-purple-500/20' :
                          'bg-indigo-950/20 text-indigo-300 border-indigo-500/20'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Core Columns (Grid: Experience and Projects) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-zinc-800/80">
                  {/* Experience Column */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-400" />
                      Professional History
                    </h4>
                    {selectedPortfolio.experience?.length === 0 ? (
                      <p className="text-sm text-zinc-500 italic">No job history loaded.</p>
                    ) : (
                      <div className="space-y-6">
                        {selectedPortfolio.experience.map((exp, idx) => (
                          <div key={idx} className="relative pl-6 border-l border-zinc-800 last:border-0 pb-2">
                            {/* Dot indicator */}
                            <span className="absolute left-[-5px] top-[5px] w-2.5 h-2.5 rounded-full bg-indigo-500" />
                            <div className="text-sm font-bold text-white">{exp.role}</div>
                            <div className="text-xs font-semibold text-indigo-400 mt-0.5">{exp.company} — <span className="text-zinc-500 font-normal">{exp.duration}</span></div>
                            <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Projects Column */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-indigo-400" />
                      Featured Projects
                    </h4>
                    {selectedPortfolio.projects?.length === 0 ? (
                      <p className="text-sm text-zinc-500 italic">No project spotlights loaded.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-5">
                        {selectedPortfolio.projects.map((proj, idx) => (
                          <div key={idx} className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700 transition-all">
                            {proj.imageUrl && (
                              <img
                                src={proj.imageUrl}
                                alt={proj.title}
                                className="w-full h-36 object-cover rounded-lg mb-4"
                              />
                            )}
                            <h5 className="text-sm font-bold text-white">{proj.title}</h5>
                            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{proj.description}</p>
                            
                            {/* Project tags */}
                            <div className="flex flex-wrap gap-1 mt-3.5">
                              {proj.techStack?.map((t, i) => (
                                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                                  {t}
                                </span>
                              ))}
                            </div>

                            {/* Project links */}
                            <div className="flex gap-3 mt-4">
                              {proj.githubUrl && (
                                <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300">
                                  <Github className="w-3.5 h-3.5" />
                                  Source Code
                                </a>
                              )}
                              {proj.liveUrl && (
                                <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300">
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  Live Preview
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer close option */}
                <div className="pt-8 border-t border-zinc-800/60 flex justify-end">
                  <button 
                    onClick={() => setSelectedPortfolio(null)}
                    className="px-6 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-sm font-bold text-white transition-all cursor-pointer"
                  >
                    Done Inspecting
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
