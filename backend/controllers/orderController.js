import Order from '../models/orderModel.js';
import Product from '../models/Product.js';

// 📦 Criar um pedido
export const createOrder = async (req, res) => {
  console.log('📦 [createOrder] Requisição recebida');
  console.log('👤 Usuário da requisição:', req.user);

  try {
    const { items, shipping, paymentMethod, totalPrice, bilhete } = req.body;
    console.log('📝 Dados recebidos:', { items, shipping, paymentMethod, totalPrice, bilhete });

    if (!items || items.length === 0) {
      console.warn('⚠️ Nenhum item no pedido');
      return res.status(400).json({ message: 'Nenhum item no pedido' });
    }

    const newOrder = new Order({
      user: req.user._id,
      orderItems: items,  // mapear 'items' para 'orderItems' no banco
      shipping,
      paymentMethod,
      totalPrice,
      bilhete,
      status: 'pending',
    });

    const saved = await newOrder.save();
    console.log('✅ Pedido salvo com sucesso:', saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Erro ao criar pedido:', err);
    res.status(500).json({ message: 'Erro ao criar pedido', error: err });
  }
};

// 🔍 Buscar pedidos de um usuário
export const getUserOrders = async (req, res) => {
  const userId = req.params.userId;
  console.log('🔍 [getUserOrders] Buscando pedidos do usuário:', userId);

  try {
    const orders = await Order.find({ user: userId })
      .populate('orderItems.product', 'title price images');

    console.log(`📦 ${orders.length} pedido(s) encontrado(s)`);
    res.status(200).json(orders);
  } catch (err) {
    console.error('❌ Erro ao buscar pedidos:', err);
    res.status(500).json({ message: 'Erro ao buscar pedidos', error: err });
  }
};

// ✅ Confirmar o recebimento de um pedido
export const confirmOrder = async (req, res) => {
  const orderId = req.params.orderId;
  console.log('✅ [confirmOrder] Confirmando pedido:', orderId);

  try {
    const updated = await Order.findByIdAndUpdate(
      orderId,
      { status: 'completed' },
      { new: true }
    ).populate('orderItems.product', 'title price images');

    if (!updated) {
      console.warn('⚠️ Pedido não encontrado:', orderId);
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    console.log('🎉 Pedido confirmado:', updated);
    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Erro ao confirmar pedido:', err);
    res.status(500).json({ message: 'Erro ao confirmar pedido', error: err });
  }
};

// 🧾 Buscar pedidos por vendedor
export const getOrdersBySeller = async (req, res) => {
  const { sellerId } = req.params;
  console.log('🧾 [getOrdersBySeller] Buscando vendas do vendedor:', sellerId);

  try {
    const orders = await Order.find({ 'orderItems.seller': sellerId })
      .populate('orderItems.product', 'title price')
      .populate('buyer', 'name');

    console.log(`📦 ${orders.length} venda(s) encontrada(s)`);
    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Erro ao buscar vendas:", err);
    res.status(500).json({ message: "Erro ao buscar vendas", error: err });
  }
};
