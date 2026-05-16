'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { portfolioApi } from '../utils/api';
import { Portfolio } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface DashboardContextType {
  portfolio: Portfolio | null;
  loading: boolean;
  saving: boolean;
  unsavedChanges: boolean;
  fetchPortfolio: () => Promise<void>;
  updatePortfolioState: (updatedFields: Partial<Portfolio>) => void;
  saveChanges: (overrides?: Partial<Portfolio>) => Promise<boolean>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await portfolioApi.getMyPortfolio();
      if (res.success && res.data.length > 0) {
        // Hydrate with the user's portfolio (for this demo, we bind to the first database record)
        setPortfolio(res.data[0]);
      } else {
        // If database is blank, generate a default portfolio framework matching our schemas
        const defaultPortfolio: Omit<Portfolio, '_id'> = {
          fullName: user?.username || 'Your Name',
          title: 'Full Stack Engineer',
          bio: 'Tell the world about your technical journey here...',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200',
          skills: ['JavaScript', 'React', 'Next.js', 'Tailwind CSS'],
          experience: [
            {
              company: 'Innovative Dev Corp',
              role: 'Software Engineer',
              duration: 'Jan 2024 - Present',
              description: 'Building performant and accessible features using React and Node.js.'
            }
          ],
          projects: [
            {
              title: 'Personal Sandbox Tracker',
              description: 'A developer sandbox allowing real-time persistence and beautiful styling.',
              techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
              githubUrl: 'https://github.com',
              liveUrl: 'https://example.com',
              imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600'
            }
          ],
          contact: {
            email: user?.email || 'dev@example.com',
            github: 'https://github.com',
            linkedin: ''
          },
          template: 'dark'
        };

        // Persist default structure immediately to MongoDB
        const createdRes = await portfolioApi.createPortfolio(defaultPortfolio);
        if (createdRes.success) {
          setPortfolio(createdRes.data);
        }
      }
      setUnsavedChanges(false);
    } catch (err) {
      console.error('Error fetching dashboard portfolio context:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPortfolio();
    }
  }, [user]);

  const updatePortfolioState = (updatedFields: Partial<Portfolio>) => {
    setPortfolio((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...updatedFields,
      };
    });
    setUnsavedChanges(true);
  };

  const saveChanges = async (overrides?: Partial<Portfolio>) => {
    if (!portfolio || !portfolio._id) return false;
    setSaving(true);
    try {
      const dataToSave = overrides ? { ...portfolio, ...overrides } : portfolio;
      const res = await portfolioApi.updatePortfolio(portfolio._id, dataToSave);
      if (res.success) {
        setUnsavedChanges(false);
        setPortfolio(res.data);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Failed to save dashboard modifications:', err.message);
      showToast(`Save failed: ${err.message}`, 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        portfolio,
        loading,
        saving,
        unsavedChanges,
        fetchPortfolio,
        updatePortfolioState,
        saveChanges,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
