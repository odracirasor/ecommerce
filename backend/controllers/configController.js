// controllers/configController.js
import User from '../models/User.js';

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json(user);
  } catch (error) {
    console.error('[ERRO] GET /api/config/me:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
  }
};
