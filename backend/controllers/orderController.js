import Order from "../models/Order1.js";

// ✅ Apenas para desenvolvimento sem autenticação real
const mockUser = {
  _id: "68776571bec5f5970d09eb2f",
  username: "Ricardo Rosa",
};

// 📦 Criar um novo pedido
export const createOrder = async (req, res) => {
  try {
    const user = req.user || mockUser;
    const {
      orderItems,
      totalPrice,
      paymentMethod,
      bilhete,
      shipping,
    } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ error: "orderItems é obrigatório e deve conter pelo menos um item." });
    }

    if (!totalPrice || isNaN(totalPrice)) {
      return res.status(400).json({ error: "totalPrice inválido ou ausente." });
    }

    if (!shipping?.nome || !shipping?.endereco || !shipping?.provincia) {
      return res.status(400).json({ error: "Dados de envio incompletos." });
    }

    const orderItemsWithImages = orderItems.map(item => ({
      product: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      seller: item.seller,
      image: item.image,
    }));

    const order = new Order({
      user: user._id,
      orderItems: orderItemsWithImages,
      totalPrice,
      paymentMethod,
      bilhete,
      shipping,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Erro ao criar pedido:", error);
    res.status(500).json({ error: "Erro interno ao criar pedido." });
  }
};

// 📥 Obter pedidos de um usuário
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Erro ao buscar pedidos:", error);
    res.status(500).json({ error: "Erro ao buscar pedidos." });
  }
};


// ✅ Confirmar recebimento do pedido e atualizar status dos itens e produtos
export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Buscar o pedido pelo ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    // Atualizar status de cada item do pedido
    order.orderItems = order.orderItems.map(item => ({
      ...item.toObject(),
      status: "completed",
    }));

    // Atualizar status geral do pedido
    order.status = "completed";

    // Salvar pedido atualizado
    const updatedOrder = await order.save();

    // (Opcional) Atualizar os produtos como vendidos no banco de dados
    for (const item of updatedOrder.orderItems) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          isSold: true
        });
      }
    }

    // Retornar sucesso
    res.status(200).json({
      message: "Pedido confirmado com sucesso. Todos os itens foram marcados como vendidos.",
      order: updatedOrder
    });

  } catch (error) {
    console.error("❌ Erro ao confirmar pedido:", error);
    res.status(500).json({ error: "Erro interno ao confirmar pedido." });
  }
};


// ❌ Marcar pagamento como não confirmado
export const markPaymentAsUnconfirmed = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    order.status = "payment_unconfirmed";
    await order.save();
    res.status(200).json({ message: "Pagamento marcado como não confirmado." });
  } catch (error) {
    console.error("❌ Erro ao atualizar status do pedido:", error);
    res.status(500).json({ error: "Erro ao atualizar status do pedido." });
  }
};

// 🔍 Buscar pedido por ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Erro ao buscar pedido por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// 🧾 Buscar todas as vendas de um seller (modo simplificado)
export const getOrdersBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const orders = await Order.find({ 'orderItems.seller': sellerId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    const vendas = [];

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.seller?.toString() === sellerId) {
          vendas.push({
            _id: order._id,
            status: order.status,
            createdAt: order.createdAt,
            buyer: order.user,
            paymentMethod: order.paymentMethod,
            shipping: order.shipping,
            totalPrice: order.totalPrice,
            product: {
              title: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
              seller: item.seller,
            },
          });
        }
      });
    });

    res.json(vendas);
  } catch (err) {
    console.error("Erro ao buscar vendas:", err);
    res.status(500).json({ message: "Erro ao buscar vendas" });
  }
};


export const getOrdersBySellerId = async (req, res) => {
  const { sellerId } = req.params;

  try {
    const orders = await Order.find({ seller: sellerId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos do vendedor', error });
  }
};
// ✅ Marcar pedido como concluído
export const markOrderAsCompleted = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    order.status = "completed";
    await order.save();

    res.status(200).json({ message: "Pedido marcado como concluído com sucesso.", order });
  } catch (error) {
    console.error("❌ Erro ao concluir pedido:", error);
    res.status(500).json({ error: "Erro ao concluir pedido." });
  }
};
