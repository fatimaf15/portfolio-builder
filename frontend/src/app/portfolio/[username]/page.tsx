'use client';

import React, { useState, useEffect, use } from 'react';
import { portfolioApi } from '../../../utils/api';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  Sparkles, 
  Code, 
  Mail, 
  Briefcase,
  Layers,
  Cpu,
  Tv
} from 'lucide-react';
import Link from 'next/link';

interface PublicPortfolioType {
  username: string;
  email: string;
  fullName: string;
  title: string;
  bio: string;
  avatarUrl: string;
  resumeUrl?: string;
  template: 'dark' | 'light' | 'minimal' | 'futuristic';
  themeSettings?: {
    mode: 'dark' | 'light';
    accentColor: string;
    font: 'sans' | 'serif' | 'mono' | 'display';
    cardStyle: 'glass' | 'flat' | 'bordered' | 'neon';
  };
  sectionOrder?: string[];
  projects: Array<{
    title: string;
    description: string;
    techStack: string[];
    githubUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
  }>;
  skills: string[];
  experience?: Array<{
    role: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }>;
  socials: Array<{
    platform: string;
    url: string;
  }>;
}

export default function PublicPortfolioPage({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}) {
  // Gracefully resolve params Promise (Next.js 15 App Router compatibility)
  const resolvedParams = use(params);
  const { username } = resolvedParams;

  const [data, setData] = useState<PublicPortfolioType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await portfolioApi.getPublicByUsername(username);
        if (res.success) {
          setData(res.data);
        } else {
          setError('Failed to load portfolio details.');
        }
      } catch (err: any) {
        setError(err.message || 'Profile not found in database.');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  // Record public interaction event view
  useEffect(() => {
    if (username) {
      portfolioApi.recordEvent(username, 'view').catch(() => {});
    }
  }, [username]);

  const handleTrackInteraction = (event: 'click' | 'download') => {
    if (username) {
      portfolioApi.recordEvent(username, event).catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-zinc-500 text-xs font-semibold tracking-widest uppercase font-mono animate-pulse">Syncing Profile Blueprint...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl max-w-md">
          <h4 className="text-sm font-extrabold uppercase tracking-wider mb-2">Portfolio Unresolved</h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">{error || 'The requested developer portfolio could not be located.'}</p>
        </div>
        <Link href="/">
          <span className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-bold rounded-xl transition-all cursor-pointer">
            Return to Landings
          </span>
        </Link>
      </div>
    );
  }

  const getSocialIcon = (platform: string) => {
    const cleaned = platform.toLowerCase();
    if (cleaned.includes('github')) {
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      );
    }
    if (cleaned.includes('linkedin')) {
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      );
    }
    return <ExternalLink className="w-4 h-4" />;
  };

  // Base Theme configurations
  const getBaseThemeConfig = () => {
    switch (data.template) {
      case 'light':
        return {
          wrapper: 'bg-slate-50 text-slate-900 font-sans min-h-screen',
          accentGlow: 'hidden',
          heroCard: 'bg-white border border-slate-200 shadow-sm rounded-3xl p-8 sm:p-10 relative overflow-hidden',
          accentText: 'text-indigo-600',
          skillChip: 'bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold',
          projectCard: 'bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all',
          titleColor: 'text-slate-900',
          textColor: 'text-slate-600',
          borderLine: 'border-slate-200'
        };
      case 'minimal':
        return {
          wrapper: 'bg-zinc-900 text-zinc-100 font-mono min-h-screen',
          accentGlow: 'hidden',
          heroCard: 'bg-zinc-950 border border-zinc-850 rounded-none p-8 relative',
          accentText: 'text-zinc-400 font-bold',
          skillChip: 'bg-zinc-900 border border-zinc-850 text-zinc-300 text-xs font-semibold rounded-none',
          projectCard: 'bg-zinc-950 border border-zinc-850 rounded-none overflow-hidden group',
          titleColor: 'text-white',
          textColor: 'text-zinc-400',
          borderLine: 'border-zinc-850'
        };
      case 'futuristic':
        return {
          wrapper: 'bg-black text-cyan-400 font-mono min-h-screen relative overflow-hidden',
          accentGlow: 'absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_40%)] pointer-events-none',
          heroCard: 'bg-zinc-950/60 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)] rounded-2xl p-8 relative',
          accentText: 'text-cyan-400 tracking-widest uppercase font-bold',
          skillChip: 'bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold rounded-lg',
          projectCard: 'bg-zinc-950/40 border border-cyan-500/20 hover:border-cyan-400 rounded-2xl overflow-hidden group shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all',
          titleColor: 'text-white',
          textColor: 'text-zinc-400',
          borderLine: 'border-cyan-500/15'
        };
      case 'dark':
      default:
        return {
          wrapper: 'bg-zinc-950 text-zinc-100 font-sans min-h-screen relative overflow-hidden',
          accentGlow: 'absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.06),transparent_50%)] pointer-events-none',
          heroCard: 'bg-zinc-900/40 border border-zinc-850 rounded-3xl p-8 sm:p-10 relative overflow-hidden backdrop-blur-md',
          accentText: 'text-indigo-400 font-bold',
          skillChip: 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full',
          projectCard: 'bg-zinc-900/30 border border-zinc-850 rounded-2xl overflow-hidden group backdrop-blur-md hover:border-zinc-800 transition-all',
          titleColor: 'text-white',
          textColor: 'text-zinc-400',
          borderLine: 'border-zinc-850'
        };
    }
  };

  // Compile layout rules with custom overrides
  const getThemeConfig = () => {
    const config = getBaseThemeConfig();
    if (!data.themeSettings) return config;

    const { mode, font, cardStyle } = data.themeSettings;
    const isLight = mode === 'light';

    // A. Apply dynamic mode and typography
    const fontClass = font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans';
    config.wrapper = isLight 
      ? `bg-slate-50 text-slate-900 min-h-screen ${fontClass}`
      : `bg-zinc-950 text-zinc-100 min-h-screen relative overflow-hidden ${fontClass}`;
    
    config.titleColor = isLight ? 'text-slate-950' : 'text-white';
    config.textColor = isLight ? 'text-slate-600' : 'text-zinc-400';
    config.borderLine = isLight ? 'border-slate-200' : 'border-zinc-850';

    // B. Apply custom card textures
    const cardClass = () => {
      switch (cardStyle) {
        case 'flat':
          return isLight 
            ? 'bg-slate-100 border border-slate-200 shadow-none rounded-xl' 
            : 'bg-zinc-900 border border-zinc-850 shadow-none rounded-xl';
        case 'bordered':
          return isLight 
            ? 'bg-white border-2 border-slate-900 shadow-[4px_4px_0_rgba(15,23,42,1)] rounded-none' 
            : 'bg-zinc-950 border-2 border-white shadow-[4px_4px_0_white] rounded-none';
        case 'neon':
          return isLight 
            ? 'bg-white border rounded-2xl' 
            : 'bg-zinc-950 border rounded-2xl';
        case 'glass':
        default:
          return isLight 
            ? 'bg-white/75 border border-slate-200/50 backdrop-blur-md rounded-2xl' 
            : 'bg-zinc-900/40 border border-zinc-850/60 backdrop-blur-md rounded-3xl';
      }
    };

    config.heroCard = `${cardClass()} p-8 sm:p-10 relative overflow-hidden`;
    config.projectCard = `${cardClass()} overflow-hidden group transition-all`;

    return config;
  };

  const theme = getThemeConfig();
  const themeSettings = data.themeSettings;

  // Custom visual section renderer based on index placement
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'skills':
        return (
          <motion.div
            key="skills"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className={`border-b pb-3 ${theme.borderLine}`}>
              <h3 className="text-sm font-extrabold uppercase tracking-widest flex items-center gap-2 text-zinc-455">
                <Cpu className="w-4.5 h-4.5" />
                Engineering Specializations
              </h3>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {data.skills.map((skill) => (
                <span 
                  key={skill} 
                  className={`px-4 py-1.5 ${theme.skillChip}`}
                  style={themeSettings ? {
                    backgroundColor: `${themeSettings.accentColor}10`,
                    border: `1px solid ${themeSettings.accentColor}25`,
                    color: themeSettings.accentColor
                  } : undefined}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        );

      case 'projects':
        return (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className={`border-b pb-3 ${theme.borderLine}`}>
              <h3 className="text-sm font-extrabold uppercase tracking-widest flex items-center gap-2 text-zinc-455">
                <Layers className="w-4.5 h-4.5" />
                Coding Solutions Spotlight
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects.length > 0 ? (
                data.projects.map((proj, idx) => (
                  <div 
                    key={idx} 
                    className={theme.projectCard}
                    style={themeSettings && themeSettings.cardStyle === 'neon' ? {
                      boxShadow: `0 0 15px ${themeSettings.accentColor}0e`,
                      borderColor: `${themeSettings.accentColor}25`
                    } : undefined}
                  >
                    <div className={`h-44 bg-zinc-950 overflow-hidden relative border-b ${theme.borderLine}`}>
                      <img
                        src={proj.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600'}
                        alt={proj.title}
                        className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-350"
                      />
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="space-y-2">
                        <h4 className={`text-base font-extrabold ${theme.titleColor}`}>{proj.title}</h4>
                        <p className={`text-xs sm:text-sm leading-relaxed ${theme.textColor} line-clamp-3`}>
                          {proj.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {proj.techStack.map((tech) => (
                          <span 
                            key={tech} 
                            className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[9px] font-bold text-zinc-400 rounded"
                            style={themeSettings ? {
                              borderColor: `${themeSettings.accentColor}12`,
                              color: `${themeSettings.accentColor}e0`
                            } : undefined}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {(proj.githubUrl || proj.liveUrl) && (
                        <div className={`flex items-center gap-4 text-xs font-bold border-t pt-4 ${theme.borderLine}`}>
                          {proj.githubUrl && (
                            <a 
                              href={proj.githubUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              onClick={() => handleTrackInteraction('click')}
                              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                            >
                              Source Code
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a 
                              href={proj.liveUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              onClick={() => handleTrackInteraction('click')}
                              className="transition-colors ml-auto flex items-center gap-1 cursor-pointer"
                              style={themeSettings ? { color: themeSettings.accentColor } : undefined}
                            >
                              Live App <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-xs text-zinc-500 border border-dashed rounded-2xl" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  No active projects showcased in this selection.
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'experience':
        return (
          <motion.div
            key="experience"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className={`border-b pb-3 ${theme.borderLine}`}>
              <h3 className="text-sm font-extrabold uppercase tracking-widest flex items-center gap-2 text-zinc-455">
                <Briefcase className="w-4.5 h-4.5" />
                Work Milestones Timeline
              </h3>
            </div>

            <div className="space-y-6 max-w-4xl">
              {data.experience && data.experience.length > 0 ? (
                data.experience.map((exp: any, idx) => (
                  <div 
                    key={idx} 
                    className={theme.projectCard}
                    style={themeSettings && themeSettings.cardStyle === 'neon' ? {
                      boxShadow: `0 0 15px ${themeSettings.accentColor}0a`,
                      borderColor: `${themeSettings.accentColor}20`
                    } : undefined}
                  >
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className={`text-sm font-extrabold ${theme.titleColor}`}>{exp.role}</h4>
                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                          <span style={themeSettings ? { color: themeSettings.accentColor } : undefined}>{exp.company}</span>
                          <span>•</span>
                          <span>{exp.location || 'Remote'}</span>
                        </div>
                        {exp.description && (
                          <p className={`text-xs leading-relaxed ${theme.textColor} mt-2.5 max-w-2xl`}>
                            {exp.description}
                          </p>
                        )}
                      </div>

                      <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-950 border border-zinc-850 px-3.5 py-1.5 rounded-full shrink-0 h-fit w-fit">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-zinc-500 border border-dashed rounded-2xl" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  Work timeline experiences are currently processing.
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={theme.wrapper}>
      <div className={theme.accentGlow} />

      <div className="max-w-5xl mx-auto px-6 py-12 sm:py-20 space-y-16">
        
        {/* Navigation back to landing */}
        <div className="flex items-center justify-between border-b pb-4 select-none" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Developer Spotlight</span>
          <span className="text-xs font-semibold tracking-wider" style={themeSettings ? { color: themeSettings.accentColor } : undefined}>
            @{data.username}
          </span>
        </div>

        {/* 1. Hero Spotlight Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={theme.heroCard}
          style={themeSettings && themeSettings.cardStyle === 'neon' ? {
            boxShadow: `0 0 20px ${themeSettings.accentColor}12`,
            borderColor: `${themeSettings.accentColor}33`
          } : undefined}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left relative z-10">
            {/* Avatar thumbnail */}
            <div className="shrink-0 relative group">
              <div 
                className="absolute -inset-1 rounded-full blur opacity-25 group-hover:opacity-45 transition-opacity" 
                style={{
                  background: `linear-gradient(to right, ${themeSettings?.accentColor || '#6366f1'}, #a855f7)`
                }}
              />
              <img
                src={data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200'}
                alt={data.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-zinc-800 relative z-10"
              />
            </div>

            {/* Main profile strings */}
            <div className="space-y-4 flex-1 min-w-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{data.fullName}</h1>
                <p 
                  className="text-sm sm:text-base font-bold mt-1.5"
                  style={themeSettings ? { color: themeSettings.accentColor } : undefined}
                >
                  {data.title}
                </p>
              </div>

              <p className={`text-sm sm:text-base leading-relaxed ${theme.textColor} max-w-3xl`}>
                {data.bio}
              </p>

              {/* Dynamic Social list */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                {data.socials.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleTrackInteraction('click')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    {getSocialIcon(social.platform)}
                    <span>{social.platform}</span>
                  </a>
                ))}
                
                {data.email && (
                  <a
                    href={`mailto:${data.email}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact</span>
                  </a>
                )}

                {/* Resume Download Integration */}
                {data.resumeUrl && (
                  <a
                    href={data.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleTrackInteraction('download')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold transition-all cursor-pointer rounded-xl"
                    style={{
                      backgroundColor: `${themeSettings?.accentColor || '#6366f1'}15`,
                      border: `1px solid ${themeSettings?.accentColor || '#6366f1'}33`,
                      color: themeSettings?.accentColor || '#6366f1'
                    }}
                  >
                    <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span>Download CV</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic section rendering sorted sequences */}
        {(data.sectionOrder || ['skills', 'projects', 'experience']).map((sectionId) => (
          <React.Fragment key={sectionId}>
            {renderSection(sectionId)}
          </React.Fragment>
        ))}

        {/* Footer branding */}
        <div className="text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest pt-12 border-t select-none" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          Powered by <span style={themeSettings ? { color: themeSettings.accentColor } : undefined}>DevPorto Builder Engine</span>
        </div>

      </div>
    </div>
  );
}
