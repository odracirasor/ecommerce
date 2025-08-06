import mongoose from 'mongoose';
import User from '../models/User.js';

// 🧹 Remove campos sensíveis
const sanitizeUser = (user) => {
  const { password, verifyToken, resetPasswordToken, resetPasswordExpires, ...data } = user.toObject();
  return data;
};

// ✅ Pega perfil próprio
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -verifyToken');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(sanitizeUser(user));
  } catch (error) {
    console.error('[ERRO] GET /me:', error);
    res.status(500).json({ error: 'Erro interno ao buscar usuário.' });
  }
};

// ✅ Atualizar perfil (bio, foto, etc)
const updateMe = async (req, res) => {
  try {
    const { password, isAdmin, isVerified, balance, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -verifyToken');

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(sanitizeUser(user));
  } catch (error) {
    console.error('[ERRO] PUT /me:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil.', details: error.message });
  }
};

// ✅ Buscar perfil público (de outro usuário)
const getUserById = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'ID de usuário inválido.' });
  }

  try {
    const user = await User.findById(userId)
      .select('-password -verifyToken -resetPasswordToken -resetPasswordExpires');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(sanitizeUser(user));
  } catch (error) {
    console.error('[ERRO] GET /users/:userId:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil público.', details: error.message });
  }
};

// ✅ Enviar mensagem para usuário
const sendMessageToUser = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const { text } = req.body;

    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ error: 'Destinatário não encontrado.' });

    recipient.messages.push({
      from: req.user._id,
      text,
    });

    await recipient.save();

    res.json({ message: 'Mensagem enviada com sucesso.' });
  } catch (error) {
    console.error('[ERRO] POST /users/:id/message:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem.', details: error.message });
  }
};

// ✅ Pega apenas o saldo do usuário logado
const getUserBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('balance');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    res.json({ balance: user.balance });
  } catch (error) {
    console.error('[ERRO] GET /users/balance:', error);
    res.status(500).json({ error: 'Erro ao buscar saldo.' });
  }
};

// ✅ Exportações finais (sem duplicação)
export {
  getMe,
  updateMe,
  getUserById,
  sendMessageToUser,
  getUserBalance
};

