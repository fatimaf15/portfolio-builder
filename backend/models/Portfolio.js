import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  imageUrl: { type: String, default: '' }
});

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., "Jan 2023 - Present"
  description: { type: String, required: true }
});

const ContactSchema = new mongoose.Schema({
  email: { type: String, required: true },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' }
});

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Professional title is required'],
    trim: true
  },
  bio: {
    type: String,
    required: [true, 'Bio is required']
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: [ExperienceSchema],
  projects: [ProjectSchema],
  contact: ContactSchema,
  resumeUrl: {
    type: String,
    default: ''
  },
  githubUsername: {
    type: String,
    default: ''
  },
  template: {
    type: String,
    default: 'dark',
    enum: ['dark', 'light', 'minimal', 'futuristic']
  },
  themeSettings: {
    mode: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark'
    },
    accentColor: {
      type: String,
      default: '#6366f1' // default Indigo
    },
    font: {
      type: String,
      enum: ['sans', 'serif', 'mono', 'display'],
      default: 'sans'
    },
    cardStyle: {
      type: String,
      enum: ['glass', 'flat', 'bordered', 'neon'],
      default: 'glass'
    }
  },
  sectionOrder: {
    type: [String],
    default: ['skills', 'projects', 'github', 'experience']
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

export default Portfolio;
