// routes/reviewRoutes.js
import express from 'express';
import { getReviewsForSeller } from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();
router.get('/seller', verifyToken, getReviewsForSeller);
export default router;
