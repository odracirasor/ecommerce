import express from 'express';
import Order from '../models/orderModel.js';
import { verifyToken1 } from '../middleware/verifyToken1.js';

const router = express.Router();

// Criar um novo pedido (checkout)
router.post('/', verifyToken1, async (req, res) => {
  try {
    const {
      user,
      items,
      shipping,
      paymentMethod,
      total,
      bilhete,
    } = req.body;

    const newOrder = new Order({
      user,
      items,
      shipping,
      paymentMethod,
      total,
      bilhete,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Erro ao salvar pedido:', err);
    res.status(500).json({ message: 'Erro ao salvar pedido' });
  }
});

export default router;
