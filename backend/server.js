import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Configure Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001', // for flexibility in local testing
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware (allows parsing JSON in request body)
app.use(express.json());

// Serve static assets (such as local resume uploads)
app.use('/uploads', express.static('public/uploads'));

// API Root Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Developer Portfolio Builder Backend API is running.',
    timestamp: new Date()
  });
});

// Register Auth & Portfolio Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/socials', socialRoutes);
app.use('/api/analytics', analyticsRoutes);

// Base route fallback
app.get('/', (req, res) => {
  res.send('Welcome to the Portfolio Builder API. Navigate to /api/health or /api/portfolios to interact.');
});

// Global Error Handling Middleware (must be registered after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 \x1b[36mSERVER RUNNING IN ${process.env.NODE_ENV || 'development'} MODE\x1b[0m`);
  console.log(`🌐 \x1b[35mLocal Link:\x1b[0m \x1b[4mhttp://localhost:${PORT}\x1b[0m`);
  console.log(`📡 \x1b[35mHealth Check:\x1b[0m \x1b[4mhttp://localhost:${PORT}/api/health\x1b[0m`);
  console.log(`======================================================\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`\x1b[31mUncaught Rejection Error: ${err.message}\x1b[0m`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
