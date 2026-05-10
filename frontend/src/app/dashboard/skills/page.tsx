'use client';

import React, { useState, useEffect } from 'react';
import { skillsApi } from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Plus, 
  X, 
  Sparkles, 
  Grid,
  CheckCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface SkillType {
  _id: string;
  name: string;
  level: string;
  category: string;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Frontend');
  const [selectedLevel, setSelectedLevel] = useState('Intermediate');

  // Pre-compiled popular suggested tags for quick creation
  const suggestions = [
    { name: 'TypeScript', category: 'Languages' },
    { name: 'Python', category: 'Languages' },
    { name: 'Golang', category: 'Languages' },
    { name: 'Rust', category: 'Languages' },
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'Vue.js', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'NestJS', category: 'Backend' },
    { name: 'GraphQL', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Redis', category: 'Database' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Kubernetes', category: 'DevOps' },
    { name: 'AWS (Amazon S3/EC2)', category: 'Cloud' },
    { name: 'Figma', category: 'Design' }
  ];

  // Toast Notification states
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' }[]>([]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Hydrate skill list on mount
  const loadSkills = async () => {
    setLoading(true);
    try {
      const res = await skillsApi.getAll();
      if (res.success) {
        setSkills(res.data);
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAddSkill = async (skillName: string, category = selectedCategory, level = selectedLevel) => {
    const cleanedName = skillName.trim();
    if (!cleanedName) {
      showToast('Please type a skill name', 'error');
      return;
    }

    // Verify local duplicates to prevent unnecessary server load
    if (skills.some((sk) => sk.name.toLowerCase() === cleanedName.toLowerCase())) {
      showToast(`"${cleanedName}" is already listed in your active stack`, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await skillsApi.create({
        name: cleanedName,
        category,
        level
      });

      if (res.success) {
        showToast(`"${cleanedName}" added to MongoDB!`, 'success');
        setSkills((prev) => [...prev, res.data]);
        setNewSkill('');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(newSkill);
    }
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    const confirm = window.confirm(`Remove "${name}" from your MongoDB database?`);
    if (!confirm) return;

    setDeletingId(id);
    try {
      const res = await skillsApi.delete(id);
      if (res.success) {
        showToast('Skill deleted from database', 'success');
        setSkills((prev) => prev.filter((sk) => sk._id !== id));
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto relative min-h-[85vh]">
      
      {/* Absolute Toast alert portal */}
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

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            Skills & Core Technologies
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Manage the tech stacks and frameworks you specialize in. All tags are securely bound to separate collections in MongoDB.
          </p>
        </div>
        <button 
          onClick={loadSkills}
          className="p-3 bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 text-zinc-455 hover:text-white rounded-xl transition-all cursor-pointer self-start"
          title="Refresh skills catalog"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Loading & Grid elements */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-zinc-500 text-xs font-semibold">Synchronizing with MongoDB...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input fields & active tags */}
          <div className="lg:col-span-7 bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 space-y-6">
            
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-widest">Add Custom Skill Tag</h4>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type skill name (e.g. Docker, WebGL)"
                  className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-850 focus:border-indigo-500 rounded-xl text-sm outline-none transition-all text-white placeholder:text-zinc-700"
                />
                <button
                  onClick={() => handleAddSkill(newSkill)}
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Add Skill
                </button>
              </div>

              {/* Advanced Metadata tuning rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Select Category</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-350 outline-none focus:border-indigo-500 transition-all"
                  >
                    <option value="Frontend">Frontend Dev</option>
                    <option value="Backend">Backend Dev</option>
                    <option value="Languages">Languages</option>
                    <option value="Database">Database Systems</option>
                    <option value="DevOps">DevOps Systems</option>
                    <option value="Cloud">Cloud Infra</option>
                    <option value="Design">UI/UX Design</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Proficiency Level</span>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-350 outline-none focus:border-indigo-500 transition-all"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert / Master</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Tags */}
            <div className="space-y-4 border-t border-zinc-850/60 pt-5">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Skill Stack ({skills.length})</h4>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <AnimatePresence>
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <motion.div
                        key={skill._id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full transition-all group"
                      >
                        <span>{skill.name}</span>
                        <span className="text-[9px] font-semibold text-zinc-500 px-1 bg-zinc-950/40 rounded uppercase font-mono">{skill.level}</span>
                        <button
                          onClick={() => handleDeleteSkill(skill._id, skill.name)}
                          disabled={deletingId === skill._id}
                          className="p-0.5 rounded-full hover:bg-indigo-500/30 text-indigo-400 hover:text-white transition-all cursor-pointer"
                          title={`Delete ${skill.name}`}
                        >
                          {deletingId === skill._id ? (
                            <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-zinc-650 w-full border border-dashed border-zinc-900 rounded-xl">
                      No active skills loaded in stack yet. Write some above or tap suggestions on the right!
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* Right: Suggested click tiles */}
          <div className="lg:col-span-5 bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 space-y-5 backdrop-blur-md">
            
            <div className="flex items-center gap-2 border-b border-zinc-850/60 pb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Suggested Technologies</h4>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
              Tap on any pre-compiled technology badge below to instantly incorporate it as an Advanced credential inside MongoDB.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {suggestions.map((sug) => {
                const isAdded = skills.some((sk) => sk.name.toLowerCase() === sug.name.toLowerCase());
                
                return (
                  <button
                    key={sug.name}
                    onClick={() => !isAdded && handleAddSkill(sug.name, sug.category, 'Advanced')}
                    disabled={isAdded || submitting}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${
                      isAdded 
                        ? 'bg-zinc-950 border-zinc-900 text-zinc-600 cursor-not-allowed flex items-center gap-1.5' 
                        : 'bg-zinc-900/50 border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {isAdded && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                    {sug.name}
                  </button>
                );
              })}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
