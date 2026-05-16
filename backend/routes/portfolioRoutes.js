import express from 'express';
import {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  seedPortfolios,
  getMyPortfolio,
  getPublicPortfolio,
  uploadResume,
  getGithubStats
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../utils/upload.js';
import { recordEvent } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/github/:username', getGithubStats);

router.post('/resume', protect, upload.single('resume'), uploadResume);

router.post('/public/:username/analytics', recordEvent);

router.get('/me', protect, getMyPortfolio);
router.get('/public/:username', getPublicPortfolio);

router.route('/')
  .get(getPortfolios)
  .post(protect, createPortfolio);

router.post('/seed', protect, seedPortfolios);

router.route('/:id')
  .get(getPortfolioById)
  .put(protect, updatePortfolio)
  .delete(protect, deletePortfolio);

export default router;
