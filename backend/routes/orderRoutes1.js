import express from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// Criar novo pedido
router.post('/', verifyToken, createOrder);

// Buscar pedidos de um usuário
router.get('/user/:userId', verifyToken, getUserOrders);

export default router;
