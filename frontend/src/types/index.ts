export interface Project {
  _id?: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

export interface Experience {
  _id?: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Contact {
  email: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export interface ThemeSettings {
  mode: 'dark' | 'light';
  accentColor: string;
  font: 'sans' | 'serif' | 'mono' | 'display';
  cardStyle: 'glass' | 'flat' | 'bordered' | 'neon';
}

export interface Portfolio {
  _id?: string;
  fullName: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  resumeUrl?: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  contact: Contact;
  githubUsername?: string;
  isPublic?: boolean;
  template: 'dark' | 'light' | 'minimal' | 'futuristic';
  themeSettings?: ThemeSettings;
  sectionOrder?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  error?: string;
}
