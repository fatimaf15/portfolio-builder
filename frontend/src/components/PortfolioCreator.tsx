'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Briefcase, 
  Terminal, 
  Mail, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles,
  Layers,
  Layout,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Loader2
} from 'lucide-react';
import { Portfolio, Experience, Project } from '../types';
import { useToast } from '../context/ToastContext';
import { portfolioApi } from '../utils/api';

interface PortfolioCreatorProps {
  onClose: () => void;
  onSubmit: (portfolio: Omit<Portfolio, '_id'>) => Promise<boolean>;
}

export default function PortfolioCreator({ onClose, onSubmit }: PortfolioCreatorProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  // Main Form State
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [template, setTemplate] = useState<'dark' | 'light' | 'minimal' | 'futuristic'>('dark');
  const [skillsInput, setSkillsInput] = useState('');
  
  // Contact
  const [email, setEmail] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');

  // Experience Sub-Form
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [expCompany, setExpCompany] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expDuration, setExpDuration] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Projects Sub-Form
  const [projects, setProjects] = useState<Project[]>([]);
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projGit, setProjGit] = useState('');
  const [projLive, setProjLive] = useState('');
  const [projImg, setProjImg] = useState('');

  // Add sub-list handlers
  const handleAddExperience = () => {
    if (!expCompany || !expRole || !expDuration || !expDesc) {
      showToast('Please fill out all job fields', 'error');
      return;
    }
    setExperiences([...experiences, {
      company: expCompany,
      role: expRole,
      duration: expDuration,
      description: expDesc
    }]);
    // Clear input
    setExpCompany('');
    setExpRole('');
    setExpDuration('');
    setExpDesc('');
  };

  const handleRemoveExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleAddProject = () => {
    if (!projTitle || !projDesc) {
      showToast('Title and Description are required', 'error');
      return;
    }
    setProjects([...projects, {
      title: projTitle,
      description: projDesc,
      techStack: projTech.split(',').map(s => s.trim()).filter(Boolean),
      githubUrl: projGit,
      liveUrl: projLive,
      imageUrl: projImg
    }]);
    // Clear input
    setProjTitle('');
    setProjDesc('');
    setProjTech('');
    setProjGit('');
    setProjLive('');
    setProjImg('');
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!fullName || !title || !bio) {
      showToast('Step 1: Required fields missing', 'error');
      setStep(1);
      return;
    }
    if (!email) {
      showToast('Step 3: Contact Email is required', 'error');
      setStep(3);
      return;
    }

    setLoading(true);
    const parsedSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    const newPortfolio: Omit<Portfolio, '_id'> = {
      fullName,
      title,
      bio,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200',
      skills: parsedSkills.length > 0 ? parsedSkills : ['React', 'Next.js', 'Node.js'],
      experience: experiences,
      projects: projects,
      contact: {
        email,
        github,
        linkedin,
        twitter
      },
      template
    };

    try {
      const success = await onSubmit(newPortfolio);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit portfolio.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Create Your Portfolio Card</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps indicator */}
        <div className="bg-zinc-950/20 px-6 py-3 border-b border-zinc-800/40 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col gap-1.5">
              <div className={`h-1 rounded-full transition-all duration-300 ${
                step >= s ? 'bg-indigo-500' : 'bg-zinc-800'
              }`} />
              <span className={`text-[10px] font-bold tracking-wider uppercase text-center ${
                step === s ? 'text-indigo-400' : 'text-zinc-500'
              }`}>
                {s === 1 ? 'Primary Profile' : s === 2 ? 'Experience & Works' : 'Contact & Theme'}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable form body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 text-sm font-semibold text-white px-4 py-3 rounded-xl outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Professional Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Lead Frontend Engineer"
                    className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 text-sm font-semibold text-white px-4 py-3 rounded-xl outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Bio *</label>
                <textarea
                  required
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself, your career focus, and your tech philosophy..."
                  className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 text-sm font-medium text-white px-4 py-3 rounded-xl outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Avatar / Profile Image</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative group shrink-0">
                    <img
                      src={portfolioApi.getImageUrl(avatarUrl)}
                      alt="Avatar Preview"
                      className="w-12 h-12 rounded-full border border-zinc-800 object-cover"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="Enter image URL..."
                      className="flex-1 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 text-xs font-mono text-white px-4 py-2.5 rounded-xl outline-none transition-all"
                    />
                    <label className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-white rounded-xl transition-all cursor-pointer group">
                      <UploadCloud className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          setUploading(true);
                          const formData = new FormData();
                          formData.append('image', file);
                          
                          try {
                            const res = await portfolioApi.uploadImage(formData);
                            if (res.success) {
                              setAvatarUrl(res.url);
                              showToast('Avatar uploaded successfully!', 'success');
                            }
                          } catch (err: any) {
                            showToast(err.message || 'Upload failed', 'error');
                          } finally {
                            setUploading(false);
                          }
                        }} 
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Technical Skills (comma-separated) *</label>
                <input
                  type="text"
                  required
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. React, Next.js, Node.js, Mongoose, AWS"
                  className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 text-sm font-semibold text-white px-4 py-3 rounded-xl outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Experience & Projects */}
          {step === 2 && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Experience Form */}
              <div className="bg-zinc-950/40 border border-zinc-800/60 p-5 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  Experience History
                </h4>
                
                {/* List of currently added experiences */}
                {experiences.length > 0 && (
                  <div className="space-y-2.5 pb-4 border-b border-zinc-800/60">
                    {experiences.map((exp, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-zinc-950 border border-zinc-850 p-3 rounded-lg text-xs">
                        <div>
                          <div className="font-bold text-white">{exp.role} at {exp.company}</div>
                          <div className="text-zinc-500 font-semibold mt-0.5">{exp.duration}</div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveExperience(idx)}
                          className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Company"
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white px-3 py-2.5 rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={expRole}
                    onChange={(e) => setExpRole(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white px-3 py-2.5 rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 2022 - Present)"
                    value={expDuration}
                    onChange={(e) => setExpDuration(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white px-3 py-2.5 rounded-lg outline-none"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Describe your accomplishments in this role..."
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white p-3 rounded-lg outline-none resize-none"
                />
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600/15 hover:bg-indigo-600/30 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 text-xs font-bold rounded-lg cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add to Experience
                </button>
              </div>

              {/* Projects Form */}
              <div className="bg-zinc-950/40 border border-zinc-800/60 p-5 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  Featured Work / Projects
                </h4>

                {/* List of currently added projects */}
                {projects.length > 0 && (
                  <div className="space-y-2.5 pb-4 border-b border-zinc-800/60">
                    {projects.map((proj, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-zinc-950 border border-zinc-850 p-3 rounded-lg text-xs">
                        <div>
                          <div className="font-bold text-white">{proj.title}</div>
                          <div className="text-zinc-500 font-semibold mt-0.5">{proj.techStack.join(', ')}</div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveProject(idx)}
                          className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white px-3 py-2.5 rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Tech Stack (e.g. Next.js, Redis, Tailwind)"
                    value={projTech}
                    onChange={(e) => setProjTech(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white px-3 py-2.5 rounded-lg outline-none"
                  />
                  <input
                    type="url"
                    placeholder="GitHub Repo URL (Optional)"
                    value={projGit}
                    onChange={(e) => setProjGit(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-xs font-mono text-white px-3 py-2.5 rounded-lg outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Live Preview URL (Optional)"
                    value={projLive}
                    onChange={(e) => setProjLive(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-xs font-mono text-white px-3 py-2.5 rounded-lg outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="url"
                    placeholder="Demo Screen Capture Image URL (Optional)"
                    value={projImg}
                    onChange={(e) => setProjImg(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-xs font-mono text-white px-3 py-2.5 rounded-lg outline-none"
                  />
                  <textarea
                    rows={2}
                    placeholder="Summarize key features, mechanics, and your contributions..."
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white p-3 rounded-lg outline-none resize-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600/15 hover:bg-indigo-600/30 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 text-xs font-bold rounded-lg cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add to Projects List
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Contacts & Theme Template */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Theme Template Choice */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                  <Layout className="w-4 h-4 text-indigo-400" />
                  Choose Visual Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'dark', label: 'Classic Dark', desc: 'Sleek carbon dark' },
                    { id: 'futuristic', label: 'Futuristic', desc: 'Purple cyberpunk glow' },
                    { id: 'minimal', label: 'Minimalist', desc: 'Subtle light borders' },
                    { id: 'light', label: 'Elegance Light', desc: 'Premium light tone' }
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => setTemplate(thm.id as any)}
                      className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        template === thm.id 
                          ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] text-indigo-300' 
                          : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-xs font-bold">{thm.label}</span>
                      <span className="text-[10px] text-zinc-500 mt-1">{thm.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Contacts */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  Contact Credentials
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Primary Email *</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. you@example.com"
                      className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 text-sm font-semibold text-white px-4 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">GitHub Profile URL</span>
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="e.g. https://github.com/profile"
                      className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 text-sm font-mono text-white px-4 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">LinkedIn Profile URL</span>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="e.g. https://linkedin.com/in/profile"
                      className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 text-sm font-mono text-white px-4 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Twitter / X URL</span>
                    <input
                      type="url"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="e.g. https://twitter.com/handle"
                      className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 text-sm font-mono text-white px-4 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-5 border-t border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1 || loading}
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-zinc-800 hover:border-zinc-700 rounded-xl text-sm font-bold text-zinc-400 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-sm font-bold text-white rounded-xl transition-all cursor-pointer"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleFinalSubmit}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)] disabled:opacity-50"
            >
              {loading ? 'Inserting Document...' : 'Submit Portfolio Card'}
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>

      </motion.div>
    </div>
  );
}
