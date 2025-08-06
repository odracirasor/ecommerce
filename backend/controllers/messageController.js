import Message from "../models/Message.js";

// 🧪 Middleware de mock (pode mover para um middleware separado)
const mockUser = {
  _id: "68776571bec5f5970d09eb2f",
  username: "Ricardo Rosa",
};

// ✅ Enviar mensagem
export const sendMessage = async (req, res) => {
  try {
    req.user = mockUser;

    const { recipientId, content, room } = req.body;

    if (!recipientId || !content || !room) {
      return res.status(400).json({ error: "recipientId, content e room são obrigatórios." });
    }

    const newMessage = new Message({
      sender: req.user._id,
      receiver: recipientId,
      content,
      room,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error);
    res.status(500).json({ error: "Erro ao enviar mensagem." });
  }
};

// ✅ Obter inbox (mensagens recebidas)
export const getInbox = async (req, res) => {
  try {
    req.user = mockUser;

    const messages = await Message.find({ receiver: req.user._id })
      .populate("sender", "username email _id")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    console.error("❌ Erro ao buscar inbox:", error);
    res.status(500).json({ error: "Erro ao buscar inbox." });
  }
};

// ✅ Obter mensagem por ID
export const getMessageById = async (req, res) => {
  try {
    req.user = mockUser;

    const message = await Message.findById(req.params.id)
      .populate("sender", "username email _id")
      .populate("receiver", "username email _id");

    if (!message) {
      return res.status(404).json({ error: "Mensagem não encontrada." });
    }

    if (message.receiver._id.toString() === req.user._id.toString()) {
      message.read = true;
      await message.save();
    }

    res.json(message);
  } catch (error) {
    console.error("❌ Erro ao buscar mensagem:", error);
    res.status(500).json({ error: "Erro ao buscar mensagem." });
  }
};

// ✅ Obter conversa entre dois usuários
export const getConversationBetweenUsers = async (req, res) => {
  try {
    req.user = mockUser;

    const userId1 = req.user._id;
    const userId2 = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username _id")
      .populate("receiver", "username _id");

    res.json(messages);
  } catch (error) {
    console.error("❌ Erro ao buscar conversa:", error);
    res.status(500).json({ error: "Erro ao buscar conversa entre os usuários." });
  }
};

// ✅ Obter histórico de uma sala de chat
export const getRoomHistory = async (req, res) => {
  try {
    req.user = mockUser;

    const { roomId } = req.params;

    const messages = await Message.find({ room: roomId })
      .sort({ createdAt: 1 })
      .populate("sender", "username _id")
      .populate("receiver", "username _id");

    res.json(messages);
  } catch (error) {
    console.error("❌ Erro ao carregar histórico da sala:", error);
    res.status(500).json({ error: "Erro ao carregar histórico da sala." });
  }
};
