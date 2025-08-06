// controllers/updateMeController.js

import User from '../models/User.js';
import sanitizeUser from '../utils/sanitizeUser.js';

const updateMe = async (req, res) => {
  try {
    // 🔐 Certifique-se de que o usuário está autenticado via sessão
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Não autenticado.' });
    }

    const { password, isAdmin, isVerified, balance, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password -verifyToken');

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(sanitizeUser(user));
  } catch (error) {
    console.error('[ERRO] PUT /me:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil.', details: error.message });
  }
};

export default updateMe;
