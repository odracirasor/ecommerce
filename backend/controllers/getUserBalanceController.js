const getUserBalance = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const mongoose = await import('mongoose');
    const User = (await import('../models/User.js')).default;

    const user = await User.findById(userId).select('balance');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ balance: user.balance });
  } catch (error) {
    console.error('[ERRO] GET /users/balance:', error);
    res.status(500).json({ error: 'Erro ao buscar saldo.' });
  }
};

export default getUserBalance;
