'use client';

import React, { useState, useEffect } from 'react';
import { projectsApi } from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Code, 
  X,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface ProjectType {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form input variables
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Toast Notification System
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' }[]>([]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Fetch projects on load
  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await projectsApi.getAll();
      if (res.success) {
        setProjects(res.data);
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please fill out the Title and Description fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // Process comma separated tags
      const techStack = techStackInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const payload = {
        title,
        description,
        techStack,
        githubUrl,
        liveUrl,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600'
      };

      const res = await projectsApi.create(payload);
      if (res.success) {
        showToast('Project created and stored in MongoDB!', 'success');
        
        // Dynamic UI Update
        setProjects((prev) => [res.data, ...prev]);
        
        // Reset Inputs
        setTitle('');
        setDescription('');
        setTechStackInput('');
        setGithubUrl('');
        setLiveUrl('');
        setImageUrl('');
        setShowAddModal(false);
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    const confirm = window.confirm(`Are you sure you want to delete "${name}" from MongoDB?`);
    if (!confirm) return;

    setDeletingId(id);
    try {
      const res = await projectsApi.delete(id);
      if (res.success) {
        showToast('Document successfully deleted from MongoDB!', 'success');
        // Dynamic UI Update
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto relative min-h-[85vh]">
      
      {/* Toast notifications container */}
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

      {/* Page Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-400" />
            Project Showcase Portfolio
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Highlight your best coding projects here. Additions or deletions are written directly to MongoDB using secure REST interfaces.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={loadProjects}
            className="p-3 bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 text-zinc-450 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Refresh database feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Spotlight Project
          </button>
        </div>
      </div>

      {/* Main Grid display area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-zinc-500 text-xs font-semibold">Synchronizing with MongoDB...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((proj) => (
              <div 
                key={proj._id}
                className="bg-zinc-900/40 border border-zinc-900 rounded-2xl overflow-hidden flex flex-col group h-full relative"
              >
                {/* Cover Image mockup */}
                <div className="h-40 bg-zinc-950 relative overflow-hidden shrink-0">
                  <img
                    src={proj.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600'}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350 opacity-70"
                  />
                  
                  {/* Trash Overlay */}
                  <button
                    onClick={() => handleDeleteProject(proj._id, proj.title)}
                    disabled={deletingId === proj._id}
                    className="absolute top-3 right-3 p-2 bg-zinc-950/80 hover:bg-rose-950/80 border border-zinc-800 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 rounded-lg transition-all cursor-pointer z-10"
                    title="Remove project"
                  >
                    {deletingId === proj._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white tracking-tight leading-snug group-hover:text-indigo-400 transition-colors">{proj.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 font-sans">{proj.description}</p>
                  </div>

                  <div className="space-y-4">
                    {/* Tech stack Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techStack?.map((tech, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="px-2 py-0.5 bg-zinc-950 border border-zinc-850 text-[10px] font-semibold text-zinc-400 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Project Links */}
                    <div className="flex items-center gap-3 text-xs font-bold border-t border-zinc-850/60 pt-3">
                      {proj.githubUrl && (
                        <a 
                          href={proj.githubUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-zinc-450 hover:text-white transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                          GitHub
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a 
                          href={proj.liveUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors ml-auto"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-zinc-900/10 border border-zinc-900 border-dashed rounded-2xl">
              <FolderKanban className="w-10 h-10 text-zinc-650 mx-auto mb-4" />
              <h4 className="text-sm font-bold text-zinc-400">No Showcase Projects</h4>
              <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
                Add your best engineering solutions, repositories, or website spotlights. Click "Add Spotlight Project" to begin!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Project Dialog/Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative z-50 flex flex-col"
            >
              {/* Modal header */}
              <div className="px-6 py-4 border-b border-zinc-850/80 bg-zinc-950/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">Add Spotlight Project</h4>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 hover:bg-zinc-850 text-zinc-450 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleAddProject} className="p-6 space-y-4">
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Chatbot AI Engine"
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-indigo-500 rounded-xl text-sm outline-none transition-all text-white placeholder:text-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Project Description *</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Summarize what this project does and the main challenges solved..."
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-indigo-500 rounded-xl text-sm outline-none transition-all text-white placeholder:text-zinc-700 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="e.g. React, Node.js, WebSockets, Redis"
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-indigo-500 rounded-xl text-sm outline-none transition-all text-white placeholder:text-zinc-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">GitHub URL</label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-indigo-500 rounded-xl text-sm outline-none transition-all text-white placeholder:text-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Live URL</label>
                    <input
                      type="url"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      placeholder="https://my-app.com"
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-indigo-500 rounded-xl text-sm outline-none transition-all text-white placeholder:text-zinc-700"
                    />
                  </div>
                </div>

                <div className="space-y-2 pb-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Mockup Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-indigo-500 rounded-xl text-sm outline-none transition-all text-white placeholder:text-zinc-700"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-850/60">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-850 border border-zinc-850 hover:border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.2)] rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    Insert Project
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
