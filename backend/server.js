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

/* =========================
   CORS CONFIGURATION
========================= */
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS blocked this origin'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

/* =========================
   HEALTH CHECK ROUTES
========================= */

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Developer Portfolio Builder Backend API is running.',
    timestamp: new Date()
  });
});

// Keep-alive ping route (Render cold start fix)
app.get('/api/ping', (req, res) => {
  res.send('alive');
});

/* =========================
   API ROUTES
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/socials', socialRoutes);
app.use('/api/analytics', analyticsRoutes);

/* =========================
   ROOT ROUTE
========================= */
app.get('/', (req, res) => {
  res.send('Welcome to the Portfolio Builder API. Use /api/health or /api/portfolios');
});

/* =========================
   ERROR HANDLER
========================= */
app.use(errorHandler);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 SERVER RUNNING IN ${process.env.NODE_ENV || 'development'} MODE`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  console.log(`📡 Ping: http://localhost:${PORT}/api/ping`);
  console.log(`======================================================\n`);
});

/* =========================
   ERROR HANDLING (CRASH SAFETY)
========================= */
process.on('unhandledRejection', (err) => {
  console.error(`Uncaught Rejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});