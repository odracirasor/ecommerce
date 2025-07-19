import Order from '../models/orderModel.js';

export const createOrder = async (req, res) => {
  try {
    const newOrder = new Order({
      user: req.userId, // extraído do token
      items: req.body.items,
      total: req.body.total,
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar pedido', error: err });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar pedidos', error: err });
  }
};
