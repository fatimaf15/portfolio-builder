'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Check, 
  Sparkles, 
  Layout, 
  Sun, 
  Moon, 
  Type, 
  Layers, 
  HelpCircle,
  Menu,
  RotateCcw
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

// Import dnd-kit cores for tactile reordering
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Individual Sortable Item wrapper
function SortableSectionItem({ id, name, label }: { id: string; name: string; label: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 bg-zinc-950/60 border rounded-xl flex items-center justify-between cursor-grab active:cursor-grabbing transition-all select-none ${
        isDragging 
          ? 'border-indigo-500 bg-zinc-900 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/30' 
          : 'border-zinc-850 hover:border-zinc-800 hover:bg-zinc-950'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
          <Menu className="w-4 h-4" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-white capitalize">{name}</h5>
          <p className="text-[10px] text-zinc-500 font-sans mt-0.5">{label}</p>
        </div>
      </div>

      <span className="text-[9px] font-mono font-bold text-zinc-650 uppercase tracking-wider">Reorder</span>
    </div>
  );
}

export default function SettingsPage() {
  const { portfolio, updatePortfolioState, loading, saveChanges } = useDashboard();

  // Theme Customizer States
  const [template, setTemplate] = useState<'dark' | 'light' | 'minimal' | 'futuristic'>('dark');
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [font, setFont] = useState<'sans' | 'serif' | 'mono' | 'display'>('sans');
  const [cardStyle, setCardStyle] = useState<'glass' | 'flat' | 'bordered' | 'neon'>('glass');

  // Section Reordering list states
  const [sections, setSections] = useState<string[]>(['skills', 'projects', 'experience']);

  const { showToast } = useToast();

  // Preset Colors Swatch Catalog
  const swatches = [
    { label: 'Hyper Indigo', hex: '#6366f1', bgClass: 'bg-[#6366f1]' },
    { label: 'Neon Cyan', hex: '#06b6d4', bgClass: 'bg-[#06b6d4]' },
    { label: 'Emerald Jade', hex: '#10b981', bgClass: 'bg-[#10b981]' },
    { label: 'Rose Petal', hex: '#f43f5e', bgClass: 'bg-[#f43f5e]' },
    { label: 'Amber Gold', hex: '#f59e0b', bgClass: 'bg-[#f59e0b]' },
    { label: 'Cyber Purple', hex: '#a855f7', bgClass: 'bg-[#a855f7]' }
  ];

  // Section Description catalog
  const sectionMeta: Record<string, { name: string; label: string }> = {
    skills: { name: 'Skills & Tech Stack', label: 'Engineering and developer specializations grid.' },
    projects: { name: 'Featured Projects', label: 'Selected catalog of live applications and code repositories.' },
    experience: { name: 'Work Milestones', label: 'Timeline showing professional career steps.' }
  };

  // Map settings on profile load
  useEffect(() => {
    if (portfolio) {
      setTemplate(portfolio.template || 'dark');
      if (portfolio.themeSettings) {
        setMode(portfolio.themeSettings.mode || 'dark');
        setAccentColor(portfolio.themeSettings.accentColor || '#6366f1');
        setFont(portfolio.themeSettings.font || 'sans');
        setCardStyle(portfolio.themeSettings.cardStyle || 'glass');
      }
      if (portfolio.sectionOrder && portfolio.sectionOrder.length > 0) {
        setSections(portfolio.sectionOrder);
      }
    }
  }, [portfolio]);

  // Set up dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle Drag End event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((prevItems) => {
        const oldIndex = prevItems.indexOf(active.id as string);
        const newIndex = prevItems.indexOf(over.id as string);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider font-mono">Loading customizer modules...</span>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="p-8 text-center bg-zinc-900/30 border border-zinc-900 rounded-2xl m-8">
        <p className="text-zinc-400 text-sm">No portfolio found. Please refresh or check database status.</p>
      </div>
    );
  }

  const handleSaveSettings = async () => {
    const payload = {
      template,
      themeSettings: {
        mode,
        accentColor,
        font,
        cardStyle
      },
      sectionOrder: sections
    };

    updatePortfolioState(payload);

    const success = await saveChanges(payload);
    if (success) {
      showToast('Theme and layout preferences synced!', 'success');
    }
  };

  const getPreviewFontClass = () => {
    switch (font) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      case 'display': return 'font-sans font-black tracking-tight';
      case 'sans':
      default: return 'font-sans';
    }
  };

  const getPreviewCardClass = () => {
    const isLightMode = mode === 'light';
    switch (cardStyle) {
      case 'flat':
        return isLightMode 
          ? 'bg-slate-100 border border-slate-200 shadow-none rounded-xl' 
          : 'bg-zinc-900 border border-zinc-850 shadow-none rounded-xl';
      case 'bordered':
        return isLightMode 
          ? 'bg-white border-2 border-slate-900 shadow-[4px_4px_0_rgba(15,23,42,1)] rounded-none' 
          : 'bg-zinc-950 border-2 border-white shadow-[4px_4px_0_white] rounded-none';
      case 'neon':
        return isLightMode 
          ? 'bg-white border border-slate-200 rounded-xl' 
          : 'bg-zinc-950 border rounded-xl';
      case 'glass':
      default:
        return isLightMode 
          ? 'bg-white/75 border border-slate-200/50 backdrop-blur-md rounded-2xl shadow-sm' 
          : 'bg-zinc-900/40 border border-zinc-850/60 backdrop-blur-md rounded-2xl';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto min-h-[85vh]">
      
      {/* Page Header */}
      <div className="border-b border-zinc-900 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-400" />
            Theme Design & Layout customizer
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans">
            Customize the dynamic arrangement of sections, typography, colors, and layout presets of your public profile page. Persistence is saved directly in MongoDB.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] rounded-xl cursor-pointer"
        >
          Save Theme & Sections
        </button>
      </div>

      {/* Success banner removed in favor of global toasts */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Customizer Controllers */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* A. Reorder Sections (Dnd Kit Drag-Drop Section!) */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 backdrop-blur-md space-y-4">
            <div className="border-b border-zinc-850 pb-3">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Portfolio Section Reorder
              </h4>
              <p className="text-[10px] text-zinc-500 mt-1 font-sans">
                Drag and drop the cards below to change the vertical section order on your live public portfolio page.
              </p>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 pt-1">
                  {sections.map((id) => {
                    const meta = sectionMeta[id];
                    return (
                      <SortableSectionItem
                        key={id}
                        id={id}
                        name={meta?.name || id}
                        label={meta?.label || ''}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* B. Base Template Preset */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 backdrop-blur-md space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-850 pb-3">
              <Layout className="w-4 h-4 text-indigo-400" />
              Base Template Preset
            </h4>

            <div className="grid grid-cols-2 gap-3.5">
              {['dark', 'light', 'minimal', 'futuristic'].map((t) => {
                const isActive = template === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTemplate(t as any);
                      // Auto-apply granular presets based on template choice
                      if (t === 'light') {
                        setMode('light');
                        setAccentColor('#6366f1');
                        setFont('sans');
                        setCardStyle('glass');
                      } else if (t === 'minimal') {
                        setMode('dark');
                        setAccentColor('#a1a1aa');
                        setFont('mono');
                        setCardStyle('flat');
                      } else if (t === 'futuristic') {
                        setMode('dark');
                        setAccentColor('#22d3ee');
                        setFont('mono');
                        setCardStyle('neon');
                      } else if (t === 'dark') {
                        setMode('dark');
                        setAccentColor('#6366f1');
                        setFont('sans');
                        setCardStyle('glass');
                      }
                    }}
                    className={`px-4 py-3 border text-xs font-bold rounded-xl transition-all capitalize cursor-pointer ${
                      isActive 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                        : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    {t} Template
                  </button>
                );
              })}
            </div>
          </div>

          {/* C. Light / Dark Mode Toggle */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 backdrop-blur-md space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-850 pb-3">
              <Sun className="w-4 h-4 text-indigo-400" />
              Visual Layout Mode
            </h4>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMode('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 border text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'dark' 
                    ? 'bg-zinc-950 border-white text-white' 
                    : 'bg-zinc-950 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Moon className="w-4 h-4" /> Dark Mode
              </button>

              <button
                type="button"
                onClick={() => setMode('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 border text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'light' 
                    ? 'bg-zinc-950 border-indigo-500 text-indigo-400 bg-indigo-500/[0.02]' 
                    : 'bg-zinc-950 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Sun className="w-4 h-4" /> Light Mode
              </button>
            </div>
          </div>

          {/* D. Accent Color Picker */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 backdrop-blur-md space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-850 pb-3">
              <Palette className="w-4 h-4 text-indigo-400" />
              Dynamic Accent Highlights
            </h4>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-1">
              {swatches.map((swatch) => {
                const isActive = accentColor === swatch.hex;
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => setAccentColor(swatch.hex)}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-full relative flex items-center justify-center border transition-transform group-hover:scale-105 ${swatch.bgClass} ${isActive ? 'border-white scale-105 ring-2 ring-indigo-500/25' : 'border-zinc-950'}`}>
                      {isActive && <Check className="w-4 h-4 text-white font-extrabold" />}
                    </div>
                    <span className={`text-[9px] font-bold text-center ${isActive ? 'text-white' : 'text-zinc-500'}`}>{swatch.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* E. Font Selection */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 backdrop-blur-md space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-850 pb-3">
              <Type className="w-4 h-4 text-indigo-400" />
              Typography Selection
            </h4>

            <div className="grid grid-cols-2 gap-3.5">
              {[
                { id: 'sans', name: 'Sans-Serif', desc: 'Modern Clean (Inter / Roboto)' },
                { id: 'serif', name: 'Elegant Serif', desc: 'Classic Editorial (Playfair)' },
                { id: 'mono', name: 'Tech Monospace', desc: 'Terminal Code (Fira Code)' },
                { id: 'display', name: 'Bold Display', desc: 'Expressive Thick Headings' }
              ].map((f) => {
                const isActive = font === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFont(f.id as any)}
                    className={`px-4 py-3 border rounded-xl transition-all text-left flex flex-col justify-between cursor-pointer ${
                      isActive 
                        ? 'bg-zinc-950 border-indigo-500 text-white' 
                        : 'bg-zinc-950 border-zinc-850 text-zinc-450 hover:bg-zinc-900/40'
                    }`}
                  >
                    <span className="text-xs font-bold">{f.name}</span>
                    <span className="text-[9px] text-zinc-500 mt-1 font-sans">{f.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* F. Card Styles */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 backdrop-blur-md space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-850 pb-3">
              <Layers className="w-4 h-4 text-indigo-400" />
              Container Card Style
            </h4>

            <div className="grid grid-cols-2 gap-3.5">
              {[
                { id: 'glass', name: 'Frosted Glass', desc: 'Subtle translucent blurs' },
                { id: 'flat', name: 'Flat Solid Slate', desc: 'Pure flat structural blocks' },
                { id: 'bordered', name: 'Hard Bordered', desc: 'Retro bold black ink frame' },
                { id: 'neon', name: 'Glow Neon', desc: 'Radiating custom neon shadows' }
              ].map((style) => {
                const isActive = cardStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setCardStyle(style.id as any)}
                    className={`px-4 py-3 border rounded-xl transition-all text-left flex flex-col justify-between cursor-pointer ${
                      isActive 
                        ? 'bg-zinc-950 border-indigo-500 text-white' 
                        : 'bg-zinc-950 border-zinc-850 text-zinc-450 hover:bg-zinc-900/40'
                    }`}
                  >
                    <span className="text-xs font-bold">{style.name}</span>
                    <span className="text-[9px] text-zinc-500 mt-1 font-sans">{style.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right: Live Canvas Previews */}
        <div className="lg:col-span-5 bg-zinc-900/20 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden sticky top-8">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3.5 mb-5 select-none">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Live Workspace Preview
            </h4>
            <span className="text-[9px] font-bold text-zinc-500 bg-zinc-900/60 px-2 py-0.5 rounded border border-zinc-850 uppercase tracking-widest">Compiler Active</span>
          </div>

          {/* Mockup Canvas */}
          <div className={`p-6 border min-h-[380px] flex flex-col justify-between transition-all duration-350 relative ${
            mode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-black border-zinc-900'
          } ${template === 'futuristic' ? 'border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.05)]' : 'rounded-2xl'}`}>
            
            <div className={`flex items-center justify-between border-b pb-3 shrink-0 ${
              mode === 'light' ? 'border-slate-200' : template === 'futuristic' ? 'border-cyan-500/10' : 'border-zinc-900'
            }`}>
              <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-zinc-500 select-none">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                <span>DEV_PORTFOLIO</span>
              </div>
              <span className="w-12 h-1.5 bg-zinc-850 rounded select-none" />
            </div>

            {/* Mocked contents layout */}
            <div className={`p-5 space-y-4 transition-all duration-350 ${getPreviewFontClass()} ${getPreviewCardClass()}`} style={{
              boxShadow: cardStyle === 'neon' ? `0 0 15px ${accentColor}1c` : undefined,
              borderColor: cardStyle === 'neon' ? `${accentColor}40` : undefined,
            }}>
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                  IMG
                </div>
                
                <div className="space-y-1.5 min-w-0 flex-1">
                  <h5 className={`text-xs font-black truncate ${mode === 'light' ? 'text-slate-950' : 'text-white'}`}>
                    {portfolio.fullName || 'Alex Rivera'}
                  </h5>
                  <p className="text-[9px] font-bold tracking-wider" style={{ color: accentColor }}>
                    {portfolio.title || 'Full Stack Engineer'}
                  </p>
                </div>
              </div>

              {/* Dynamic Mockup representation of vertical layout! */}
              <div className="border-t pt-3 mt-3 space-y-2 select-none" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Themed Sections Sequence</span>
                <div className="flex flex-col gap-1.5">
                  {sections.map((sec, idx) => (
                    <div key={sec} className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-900 rounded flex items-center justify-between">
                      <span className="text-[9px] font-mono text-zinc-400 capitalize">{idx + 1}. {sec}</span>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`text-center text-[8px] font-bold tracking-widest uppercase select-none ${mode === 'light' ? 'text-slate-400' : 'text-zinc-750'}`}>
              Mode: <span style={{ color: accentColor }}>{mode}</span> | order: <span style={{ color: accentColor }}>{sections.join(' ➔ ')}</span>
            </div>

          </div>

          <div className="mt-4 p-4 bg-zinc-950/60 border border-zinc-850 text-[10px] text-zinc-500 leading-relaxed rounded-xl flex gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>Reorder segments using tactile dragging. The mock canvas directly illustrates section paths dynamically. Save settings to apply.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
