import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -verifyToken');
    res.json(users);
  } catch (error) {
    console.error('[ERRO] GET /admin/users:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};
