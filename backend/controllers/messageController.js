import Message from "../models/Message.js";

// ✅ Enviar mensagem
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;

    console.log("\n📨 Enviando nova mensagem...");
    console.log("🔐 Usuário autenticado:", req.user?._id);
    console.log("🔸 Para:", recipientId);
    console.log("🔸 Conteúdo:", content);

    if (!recipientId || !content) {
      console.warn("⚠️ Dados ausentes. recipientId ou content estão faltando.");
      return res.status(400).json({ error: "Destinatário e conteúdo são obrigatórios." });
    }

    const newMessage = new Message({
      sender: req.user._id,
      receiver: recipientId,
      text: content,
    });

    await newMessage.save();
    console.log("✅ Mensagem salva com sucesso. ID:", newMessage._id);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error);
    res.status(500).json({ error: "Erro ao enviar mensagem." });
  }
};

// ✅ Ver inbox (mensagens recebidas)
export const getInbox = async (req, res) => {
  try {
    console.log("\n📥 Acessando inbox...");
    console.log("🔐 Usuário autenticado:", req.user?._id);

    const messages = await Message.find({ receiver: req.user._id })
      .populate("sender", "name email")
      .sort({ createdAt: -1 });

    console.log(`📦 ${messages.length} mensagens encontradas na inbox de ${req.user._id}`);

    res.json(messages);
  } catch (error) {
    console.error("❌ Erro ao buscar inbox:", error);
    res.status(500).json({ error: "Erro ao buscar mensagens da caixa de entrada." });
  }
};

// ✅ Ver mensagem por ID
export const getMessageById = async (req, res) => {
  try {
    console.log("\n🔎 Buscando mensagem por ID...");
    console.log("🔐 Usuário autenticado:", req.user?._id);
    console.log("📨 ID da mensagem:", req.params.id);

    const message = await Message.findById(req.params.id).populate("sender", "name email");

    if (!message) {
      console.warn("⚠️ Mensagem não encontrada:", req.params.id);
      return res.status(404).json({ error: "Mensagem não encontrada." });
    }

    if (message.receiver.toString() === req.user._id.toString()) {
      message.read = true;
      await message.save();
      console.log("📬 Mensagem marcada como lida.");
    } else {
      console.warn("🚫 Tentativa de acessar mensagem que não pertence ao usuário.");
    }

    res.json(message);
  } catch (error) {
    console.error("❌ Erro ao buscar mensagem por ID:", error);
    res.status(500).json({ error: "Erro ao buscar mensagem." });
  }
};

// ✅ Buscar conversa entre dois usuários
export const getConversationBetweenUsers = async (req, res) => {
  try {
    const userId1 = req.user._id;
    const userId2 = req.params.userId;

    console.log("\n💬 Buscando conversa entre usuários...");
    console.log("👤 Usuário atual:", userId1);
    console.log("👤 Outro participante:", userId2);

    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ createdAt: 1 });

    console.log(`📜 ${messages.length} mensagens encontradas na conversa.`);

    res.json(messages);
  } catch (error) {
    console.error("❌ Erro ao buscar conversa:", error);
    res.status(500).json({ error: "Erro ao buscar conversa entre os usuários." });
  }
};
