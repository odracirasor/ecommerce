const getUserById = async (req, res) => {
  const { userId } = req.params;

  const mongoose = await import('mongoose');
  const User = (await import('../models/User.js')).default;
  const sanitizeUser = (await import('../utils/sanitizeUser.js')).default;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'ID de usuário inválido.' });
  }

  try {
    const user = await User.findById(userId)
      .select('-password -verifyToken -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(sanitizeUser(user));
  } catch (error) {
    console.error('[ERRO] GET /users/:userId:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil público.', details: error.message });
  }
};

export default getUserById;
