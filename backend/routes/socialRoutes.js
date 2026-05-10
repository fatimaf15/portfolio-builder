import express from 'express';
import {
  getSocials,
  createOrUpdateSocial,
  updateSocialById,
  deleteSocial,
} from '../controllers/socialController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth protection middleware to all social mapping endpoints
router.use(protect);

router.route('/')
  .get(getSocials)
  .post(createOrUpdateSocial);

router.route('/:id')
  .put(updateSocialById)
  .delete(deleteSocial);

export default router;
