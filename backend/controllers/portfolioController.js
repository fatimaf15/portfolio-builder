import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import SocialLink from '../models/SocialLink.js';
import { uploadResumeFile } from '../utils/upload.js';
import fs from 'fs';
import path from 'path';

// @desc    Get all portfolios
// @route   GET /api/portfolios
// @access  Public
export const getPortfolios = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: portfolios.length,
      data: portfolios
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single portfolio by ID
// @route   GET /api/portfolios/:id
// @access  Public
export const getPortfolioById = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    
    if (!portfolio) {
      res.status(404);
      throw new Error(`Portfolio not found with id of ${req.params.id}`);
    }

    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new portfolio
// @route   POST /api/portfolios
// @access  Public
export const createPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Portfolio created successfully',
      data: portfolio
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a portfolio
// @route   PUT /api/portfolios/:id
// @access  Public
export const updatePortfolio = async (req, res, next) => {
  try {
    let portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      res.status(404);
      throw new Error(`Portfolio not found with id of ${req.params.id}`);
    }

    portfolio = await Portfolio.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Portfolio updated successfully',
      data: portfolio
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a portfolio
// @route   DELETE /api/portfolios/:id
// @access  Public
export const deletePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      res.status(404);
      throw new Error(`Portfolio not found with id of ${req.params.id}`);
    }

    await portfolio.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Portfolio deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed standard portfolios
// @route   POST /api/portfolios/seed
// @access  Public
export const seedPortfolios = async (req, res, next) => {
  try {
    // Clear existing portfolios first to prevent duplicates
    await Portfolio.deleteMany({});

    const samplePortfolios = [
      {
        fullName: "Alex Rivera",
        title: "Senior Full Stack Engineer & Cloud Architect",
        bio: "Creative developer passionate about building performant, responsive web apps and cloud architectures. Over 6 years of experience across React, Next.js, Node, and AWS, helping startups scale from zero to millions.",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250&h=250",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "AWS (S3/EC2/Lambda)", "Docker"],
        contact: {
          email: "alex.rivera@dev.io",
          github: "https://github.com/example",
          linkedin: "https://linkedin.com/in/example",
          twitter: "https://twitter.com/example"
        },
        template: "dark",
        experience: [
          {
            company: "TechVanguard Solutions",
            role: "Lead Full Stack Engineer",
            duration: "Jun 2023 - Present",
            description: "Pioneered architectural shifts to Next.js App Router, resulting in a 45% boost in SEO rankings and Lighthouse performance scores. Guided 4 junior developers and oversaw CI/CD pipelines on AWS."
          },
          {
            company: "Codewise Studio",
            role: "Software Developer",
            duration: "Jan 2021 - May 2023",
            description: "Developed and maintained robust customer portals using React and Express.js. Designed efficient schemas in MongoDB reducing query latency by 30%."
          }
        ],
        projects: [
          {
            title: "SaaS Analytics Dashboard",
            description: "A comprehensive real-time dashboard tracking system metrics, active users, and subscription conversion funnels with advanced charting capabilities.",
            techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts", "Express", "MongoDB"],
            githubUrl: "https://github.com/example/analytics-dashboard",
            liveUrl: "https://analytics-demo.io",
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
          },
          {
            title: "TaskFlow Collaborative Kanban",
            description: "A highly interactive project board featuring drag-and-drop workspace lanes, real-time sync with WebSockets, and secure role-based collaboration features.",
            techStack: ["React", "Node.js", "Socket.io", "Tailwind CSS", "Express", "MongoDB"],
            githubUrl: "https://github.com/example/taskflow",
            liveUrl: "https://taskflow-demo.io",
            imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=600"
          }
        ]
      },
      {
        fullName: "Marcus Chen",
        title: "Frontend Architect & Interaction Designer",
        bio: "Specializing in ultra-smooth animations, motion design, and high-fidelity 3D-integrated user interfaces. Dedicated to turning visual concepts into immersive, high-conversion user experiences.",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250&h=250",
        skills: ["React", "Next.js", "Framer Motion", "Three.js", "Tailwind CSS", "WebGL", "TypeScript", "Figma", "Node.js"],
        contact: {
          email: "marcus.design@dev.io",
          github: "https://github.com/example",
          linkedin: "https://linkedin.com/in/example",
          twitter: "https://twitter.com/example"
        },
        template: "futuristic",
        experience: [
          {
            company: "Studio Bloom Interactive",
            role: "Creative Director & Frontend Lead",
            duration: "Mar 2024 - Present",
            description: "Spearheaded complex promotional web designs incorporating Framer Motion and Three.js. Won 3 CSS Design Awards for best UI/UX and Innovation."
          }
        ],
        projects: [
          {
            title: "Astral 3D Metaverse Portal",
            description: "An experiential landing page containing full interactive 3D solar system rendering, customizable planet models, and rich physics-driven canvas simulations.",
            techStack: ["Next.js", "Three.js", "React Three Fiber", "Framer Motion", "Tailwind CSS"],
            githubUrl: "https://github.com/example/astral-3d",
            liveUrl: "https://astral-3d-demo.io",
            imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600"
          }
        ]
      }
    ];

    const seeded = await Portfolio.insertMany(samplePortfolios);
    res.status(201).json({
      success: true,
      message: 'Database seeded successfully',
      count: seeded.length,
      data: seeded
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complete public portfolio details by username
// @route   GET /api/portfolios/public/:username
// @access  Public
export const getPublicPortfolio = async (req, res, next) => {
  try {
    const { username } = req.params;

    // 1. Fetch user profile
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404);
      throw new Error(`User with username "${username}" not found.`);
    }

    // 2. Fetch skills
    const skills = await Skill.find({ user: user._id }).sort({ name: 1 });

    // 3. Fetch projects
    const projects = await Project.find({ user: user._id }).sort({ createdAt: -1 });

    // 4. Fetch socials
    const socials = await SocialLink.find({ user: user._id }).sort({ platform: 1 });

    // 5. Fetch general portfolio details
    let portfolio = await Portfolio.findOne({ fullName: user.username });
    if (!portfolio) {
      portfolio = await Portfolio.findOne(); // absolute fallback
    }

    // Return unified aggregated response
    res.status(200).json({
      success: true,
      data: {
        username: user.username,
        email: user.email,
        fullName: portfolio?.fullName || user.username,
        title: portfolio?.title || 'Full Stack Software Engineer',
        bio: portfolio?.bio || 'Passionate developer and builder.',
        avatarUrl: portfolio?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200',
        resumeUrl: portfolio?.resumeUrl || '',
        template: portfolio?.template || 'dark',
        themeSettings: portfolio?.themeSettings || {
          mode: 'dark',
          accentColor: '#6366f1',
          font: 'sans',
          cardStyle: 'glass'
        },
        sectionOrder: portfolio?.sectionOrder || ['skills', 'projects', 'experience'],
        projects: projects.length > 0 ? projects : (portfolio?.projects || []),
        skills: skills.length > 0 ? skills.map(s => s.name) : (portfolio?.skills || []),
        socials: socials.length > 0 ? socials : [
          { platform: 'GitHub', url: portfolio?.contact?.github || 'https://github.com' },
          { platform: 'LinkedIn', url: portfolio?.contact?.linkedin || 'https://linkedin.com' }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload PDF resume and save URL
// @route   POST /api/portfolios/resume
// @access  Private
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a PDF file');
    }

    // 1. Locate user's active portfolio profile
    let portfolio = await Portfolio.findOne({ fullName: req.user.username });
    if (!portfolio) {
      portfolio = await Portfolio.findOne(); // fallback to first record
      if (!portfolio) {
        res.status(404);
        throw new Error('Portfolio profile not found. Please create one first before uploading a resume.');
      }
    }

    // 2. Perform file upload to Cloudinary or fallback local directory
    const secureUrl = await uploadResumeFile(req.file.path);

    // 3. Cleanup: Delete previous local PDF file if replacing a local upload
    if (portfolio.resumeUrl && portfolio.resumeUrl.includes('/uploads/')) {
      try {
        const oldFilename = portfolio.resumeUrl.split('/uploads/')[1];
        const oldFilePath = path.join('./public/uploads', oldFilename);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log(`🗑️ Deleted old local resume file: ${oldFilename}`);
        }
      } catch (err) {
        console.error('Error deleting replaced local resume:', err.message);
      }
    }

    // 4. Save new URL in MongoDB
    portfolio.resumeUrl = secureUrl;
    await portfolio.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded and synchronized successfully!',
      resumeUrl: secureUrl,
    });
  } catch (error) {
    // Cleanup temporary multer file if upload crashes midway
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Fetch GitHub profile statistics and repositories
// @route   GET /api/portfolios/github/:username
// @access  Public
export const getGithubStats = async (req, res, next) => {
  try {
    const { username } = req.params;
    if (!username) {
      res.status(400);
      throw new Error('Please provide a GitHub username');
    }

    // Prepare headers (inject GITHUB_TOKEN if available in .env)
    const headers = {
      'User-Agent': 'Developer-Portfolio-Builder',
      'Accept': 'application/vnd.github.v3+json'
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Fetch GitHub User Profile
    const profileRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    
    if (profileRes.status === 404) {
      res.status(404);
      throw new Error(`GitHub user "${username}" not found on GitHub.`);
    }

    if (!profileRes.ok) {
      res.status(profileRes.status);
      throw new Error(`GitHub API Error: ${profileRes.statusText || 'Unable to fetch profile'}`);
    }

    const profileData = await profileRes.json();

    // 2. Fetch User Repositories (up to 100) to aggregate stats
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    let reposData = [];
    if (reposRes.ok) {
      reposData = await reposRes.json();
    }

    // Calculate total stars, languages, and top repositories
    let totalStars = 0;
    const languagesMap = {};
    const topRepos = [];

    reposData.forEach(repo => {
      // Increment star count
      totalStars += repo.stargazers_count || 0;

      // Map languages
      if (repo.language) {
        languagesMap[repo.language] = (languagesMap[repo.language] || 0) + 1;
      }

      // Add to potential spotlight list
      topRepos.push({
        name: repo.name,
        description: repo.description || 'No description provided.',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language: repo.language || 'Plain Text',
        url: repo.html_url,
        updatedAt: repo.updated_at
      });
    });

    // Sort languages to find top 4
    const topLanguages = Object.entries(languagesMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // Sort repositories by stargazers count to get top 3 spotlight repos
    const spotlightRepos = topRepos
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 3);

    res.status(200).json({
      success: true,
      data: {
        username: profileData.login,
        name: profileData.name || profileData.login,
        avatarUrl: profileData.avatar_url,
        bio: profileData.bio || 'This developer has no GitHub biography.',
        publicRepos: profileData.public_repos,
        followers: profileData.followers,
        totalStars,
        topLanguages,
        spotlightRepos
      }
    });

  } catch (error) {
    next(error);
  }
};
