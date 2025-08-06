// routes/withdrawRoutes.js
import express from 'express';
import { handleWithdraw } from '../controllers/withdrawController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();
router.post('/', verifyToken, handleWithdraw);
export default router;
