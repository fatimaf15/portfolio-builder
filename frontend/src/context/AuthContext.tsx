'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../utils/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load user from token in localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
          setToken(savedToken);
          try {
            const res = await authApi.getMe();
            if (res.success) {
              setUser(res.user);
            } else {
              // Token is invalid, clear it
              logoutState();
            }
          } catch (err: any) {
            console.error('Failed to load user with token:', err.message);
            logoutState();
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(credentials);
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        router.push('/dashboard');
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register(userData);
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        router.push('/dashboard');
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Internal helper to clear state without routing side effects during loading
  const logoutState = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const logout = () => {
    logoutState();
    router.push('/');
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
