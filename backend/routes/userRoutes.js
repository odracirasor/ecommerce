import express from 'express';
import {
  getMe,
  updateMe,
  getUserById,
  getUserBalance,
  sendMessageToUser,
} from '../controllers/userController.js';
import { getInbox } from '../controllers/messageController.js';
import { verifyToken1 } from '../middleware/verifyToken1.js';

const router = express.Router();

// Rotas protegidas
router.get('/me', verifyToken1, getMe);
router.put('/me', verifyToken1, updateMe);
router.get('/balance', verifyToken1, getUserBalance);

// ✅ Coloque rotas específicas ANTES da rota genérica
router.get('/inbox', verifyToken1, getInbox);

// Enviar mensagem para outro usuário
router.post('/:recipientId/message', verifyToken1, sendMessageToUser);

// Rota genérica deve ficar por último
router.get('/:userId', getUserById);

export default router;
