import User from '../models/User.js';
import sanitizeUser from '../utils/sanitizeUser.js';

const getMe = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const user = await User.findById(userId).select('-password -verifyToken');

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(sanitizeUser(user));
  } catch (error) {
    console.error('[ERRO] GET /me:', error);
    res.status(500).json({ error: 'Erro interno ao buscar usuário.' });
  }
};

export default getMe;
