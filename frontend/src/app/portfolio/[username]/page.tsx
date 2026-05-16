'use client';

import React, { useState, useEffect, use } from 'react';
import { portfolioApi } from '../../../utils/api';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  ExternalLink, 
  Sparkles, 
  Code, 
  Mail, 
  ArrowRight, 
  ChevronDown, 
  Globe, 
  Briefcase, 
  Layers, 
  Cpu 
} from 'lucide-react';
import Link from 'next/link';

interface PublicPortfolioType {
  username: string;
  email: string;
  fullName: string;
  title: string;
  bio: string;
  avatarUrl: string;
  socials: Array<{
    platform: string;
    url: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    techStack: string[];
    githubUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
  }>;
  skills: string[];
  themeSettings?: {
    mode: 'dark' | 'light';
    accentColor: string;
  };
}

const BrandIcon = ({ platform, className }: { platform: string, className?: string }) => {
  const p = platform.toLowerCase();
  
  if (p.includes('github')) return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
  if (p.includes('linkedin')) return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
  return <ExternalLink className={className} />;
};

export default function PublicPortfolioPage({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}) {
  const resolvedParams = use(params);
  const { username } = resolvedParams;

  const [data, setData] = useState<PublicPortfolioType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
        setError(err.message || 'Profile not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Loading portfolio...</div>;
  if (error || !data) return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">{error || 'Portfolio not found.'}</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30">
      {/* SCROLL PROGRESS BAR */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-[1000]"
        style={{ scaleX }}
      />

      <main className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 space-y-48 pb-32 pt-20">
        
        {/* HERO SECTION */}
        <section id="home" className="relative min-h-[80vh] flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8 space-y-10">
               <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="flex items-center gap-3"
               >
                  <span className="h-[1px] w-12 bg-indigo-500" />
                  <span className="text-xs font-black uppercase tracking-[0.5em] text-indigo-500">{data.title}</span>
               </motion.div>

               <motion.h1 
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
                 className="text-7xl sm:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.9]"
               >
                  {data.fullName}
               </motion.h1>

               <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="text-xl sm:text-2xl text-zinc-400 max-w-xl font-medium leading-relaxed"
               >
                  {data.bio}
               </motion.p>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.4 }}
                 className="flex flex-wrap items-center gap-8 pt-4"
               >
                  <a href="#work" className="group px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-[11px] rounded-full hover:bg-indigo-600 hover:text-white transition-all">
                    View Projects
                    <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <div className="flex items-center gap-6">
                    {data.socials.map((social, i) => (
                      <a key={i} href={social.url} target="_blank" className="text-zinc-500 hover:text-white transition-colors">
                        <BrandIcon platform={social.platform} className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
               </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="lg:col-span-4 relative group"
            >
              <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900">
                 <img src={portfolioApi.getImageUrl(data.avatarUrl)} alt={data.fullName} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="stack" className="space-y-16">
           <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[1em] text-zinc-600">Stack</h2>
              <h3 className="text-5xl sm:text-6xl font-black tracking-tighter">Core Competencies</h3>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {data.skills.map((skill, i) => (
                <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl text-center group hover:bg-indigo-600 transition-all">
                   <span className="text-sm font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">{skill}</span>
                </div>
              ))}
           </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="work" className="space-y-32">
           <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[1em] text-zinc-600">Showcase</h2>
              <h3 className="text-5xl sm:text-7xl font-black tracking-tighter">Selected Works</h3>
           </div>

           <div className="grid grid-cols-1 gap-24">
              {data.projects.map((project, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col lg:flex-row gap-16 items-center"
                >
                   <div className="flex-1 w-full aspect-video rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-xl">
                      <img src={portfolioApi.getImageUrl(project.imageUrl)} alt={project.title} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 space-y-8">
                      <div className="space-y-4">
                         <h4 className="text-4xl sm:text-5xl font-black tracking-tighter">{project.title}</h4>
                         <p className="text-zinc-500 text-lg leading-relaxed">{project.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech, j) => (
                          <span key={j} className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">{tech}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-6 pt-4">
                        <a href={project.liveUrl} target="_blank" className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-indigo-600 hover:text-white transition-all">Live Demo</a>
                        <a href={project.githubUrl} target="_blank" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">GitHub</a>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-20 text-center space-y-12">
           <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[1em] text-zinc-600">Contact</h2>
              <h3 className="text-5xl sm:text-8xl font-black tracking-tighter leading-tight">Let's build something <br/> <span className="text-indigo-500">incredible.</span></h3>
           </div>
           <div className="flex flex-col items-center gap-8">
              <a href={`mailto:${data.email}`} className="text-3xl sm:text-5xl font-black tracking-tighter border-b-4 border-white/10 hover:border-indigo-500 transition-all pb-2">{data.email}</a>
              <div className="flex items-center gap-6">
                 {data.socials.map((social, i) => (
                   <a key={i} href={social.url} target="_blank" className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-indigo-600 transition-all">
                      <BrandIcon platform={social.platform} className="w-6 h-6" />
                   </a>
                 ))}
              </div>
           </div>
        </section>

        {/* FOOTER */}
        <footer className="py-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg" />
              <span className="text-[10px] font-black uppercase tracking-widest">Portfolio Engine</span>
           </div>
           <div className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">© 2026 Developer Portfolio</div>
           <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-indigo-600 transition-all">
              <ArrowRight className="w-5 h-5 -rotate-90" />
           </button>
        </footer>
      </main>
    </div>
  );
}
