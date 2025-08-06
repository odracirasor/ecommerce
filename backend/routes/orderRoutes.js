import express from 'express';
import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  confirmOrder,
  markPaymentAsUnconfirmed,
  getOrdersBySellerId,
  markOrderAsCompleted,
} from '../controllers/orderController.js';

import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📦 Criar novo pedido
router.post('/', requireAuth, createOrder);

// 📄 Obter pedidos de um usuário específico
router.get('/user/:userId', requireAuth, getOrdersByUserId);

// 📄 Obter pedidos de um vendedor específico
router.get('/seller/:sellerId', requireAuth, getOrdersBySellerId);

// 🔍 Obter pedido por ID
router.get('/:orderId', requireAuth, getOrderById);

// ✅ Confirmar pagamento
router.put('/confirm/:orderId', requireAuth, confirmOrder);

// ❌ Marcar pagamento como não confirmado
router.put('/unconfirmed/:orderId', requireAuth, markPaymentAsUnconfirmed);

// ✅ Marcar pedido como concluído
router.put('/completed/:orderId', requireAuth, markOrderAsCompleted);

export default router;
