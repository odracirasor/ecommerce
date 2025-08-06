import Message from '../models/Message.js';
import User from '../models/User.js';

const sendMessage = async (req, res) => {
  try {
    const { recipientId, text } = req.body;

    if (!recipientId || !text) {
      return res.status(400).json({ error: 'Destinatário e texto são obrigatórios.' });
    }

    // Verifica se o destinatário existe
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Usuário destinatário não encontrado.' });
    }

    // Cria a mensagem
    const message = new Message({
      sender: req.user._id,
      recipient: recipientId,
      text,
    });

    await message.save();

    res.status(201).json({ message: 'Mensagem enviada com sucesso.', data: message });
  } catch (error) {
    console.error('[ERRO] POST /send-message:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem.' });
  }
};

export default sendMessage;
