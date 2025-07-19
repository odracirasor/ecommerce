import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Retorna os dados do usuário autenticado
 * @access  Privado
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(user);
  } catch (err) {
    console.error('[ERRO] GET /me:', err.message);
    res.status(500).json({ error: 'Erro interno ao buscar usuário.' });
  }
});

/**
 * @route   PUT /api/users/me
 * @desc    Atualiza dados do perfil do usuário autenticado
 * @access  Privado
 */
router.put('/me', authMiddleware, async (req, res) => {
  const { profileImage, address } = req.body;

  // Validação leve
  if (!profileImage && !address) {
    return res.status(400).json({ error: 'Nenhum dado enviado para atualização.' });
  }

  try {
    const updates = {};
    if (profileImage) updates.profileImage = profileImage;
    if (address) updates.address = address;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('[ERRO] PUT /me:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  }
});

export default router;
