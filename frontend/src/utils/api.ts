import axios from 'axios';
import { Portfolio, ApiResponse, User, AuthResponse } from '../types';

// Create a configured Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to automatically attach authorization header
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for unified error formatting
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Look at our custom backend error schema: error.response?.data?.error
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// Define API operations
export const portfolioApi = {
  /**
   * Check backend server health status
   */
  checkHealth: async () => {
    const response = await apiClient.get<{ status: string; message: string }>('/health');
    return response.data;
  },

  /**
   * Get all portfolios
   */
  getPortfolios: async () => {
    const response = await apiClient.get<ApiResponse<Portfolio[]>>('/portfolios');
    return response.data;
  },

  /**
   * Get a single portfolio by ID
   */
  getPortfolioById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Portfolio>>(`/portfolios/${id}`);
    return response.data;
  },

  /**
   * Create a new portfolio
   */
  createPortfolio: async (portfolioData: Omit<Portfolio, '_id'>) => {
    const response = await apiClient.post<ApiResponse<Portfolio>>('/portfolios', portfolioData);
    return response.data;
  },

  /**
   * Update an existing portfolio
   */
  updatePortfolio: async (id: string, portfolioData: Partial<Portfolio>) => {
    const response = await apiClient.put<ApiResponse<Portfolio>>(`/portfolios/${id}`, portfolioData);
    return response.data;
  },

  /**
   * Delete a portfolio
   */
  deletePortfolio: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/portfolios/${id}`);
    return response.data;
  },

  /**
   * Seed the database with sample profiles
   */
  seedData: async () => {
    const response = await apiClient.post<ApiResponse<Portfolio[]>>('/portfolios/seed');
    return response.data;
  },

  /**
   * Fetch complete public user profile details by username
   */
  getPublicByUsername: async (username: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/portfolios/public/${username}`);
    return response.data;
  },

  /**
   * Upload binary PDF resume file using multipart/form-data
   */
  uploadResume: async (formData: FormData) => {
    const response = await apiClient.post<{ success: boolean; message: string; resumeUrl: string }>(
      '/portfolios/resume',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    return response.data;
  },

  /**
   * Fetch complete statistics and repositories for a GitHub profile
   */
  getGithubStats: async (username: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/portfolios/github/${username}`);
    return response.data;
  },

  /**
   * Record a public interaction event (view, click, or download)
   */
  recordEvent: async (username: string, event: 'view' | 'click' | 'download') => {
    const response = await apiClient.post<ApiResponse<any>>(`/portfolios/public/${username}/analytics`, { event });
    return response.data;
  },

  /**
   * Fetch authenticated user interaction metrics & temporal lists
   */
  getMyAnalytics: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/me');
    return response.data;
  }
};

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * Register a new developer account
   */
  register: async (userData: any) => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  /**
   * Authenticate a developer
   */
  login: async (credentials: any) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Get current authenticated user details
   */
  getMe: async () => {
    const response = await apiClient.get<{ success: boolean; user: User }>('/auth/me');
    return response.data;
  }
};

/**
 * Projects API endpoints
 */
export const projectsApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/projects');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/projects/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/projects', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.put<ApiResponse<any>>(`/projects/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/projects/${id}`);
    return response.data;
  }
};

/**
 * Skills API endpoints
 */
export const skillsApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/skills');
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/skills', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.put<ApiResponse<any>>(`/skills/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/skills/${id}`);
    return response.data;
  }
};

export default apiClient;
