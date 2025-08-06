// backend/routes/adminRoutes.js
import express from 'express';
import User from '../models/User.js';
import { verifyToken1, verifyAdmin } from '../middleware/verifyToken1.js';

const router = express.Router();

/**
 * 🔍 Buscar usuários com filtro de username
 * Ex: /api/admin/users?search=ricardo
 */
router.get('/users', verifyToken1, verifyAdmin, async (req, res) => {
  try {
    const search = req.query.search || '';
    const users = await User.find({
      username: { $regex: search, $options: 'i' }
    }).select('-password'); // nunca envie a senha

    res.json(users);
  } catch (error) {
    console.error('[ERRO] GET /admin/users:', error.message);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

/**
 * 🧑‍🏫 Promover usuário a admin
 * PUT /api/admin/users/:id/promote
 */
router.put('/users/:id/promote', verifyToken1, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    user.isAdmin = true;
    await user.save();

    res.json({ message: 'Usuário promovido a admin' });
  } catch (error) {
    console.error('[ERRO] PUT /admin/users/:id/promote:', error.message);
    res.status(500).json({ error: 'Erro ao promover usuário.' });
  }
});

/**
 * 🚫 Suspender usuário
 * PUT /api/admin/users/:id/suspend
 */
router.put('/users/:id/suspend', verifyToken1, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    user.suspended = true;
    await user.save();

    res.json({ message: 'Usuário suspenso com sucesso' });
  } catch (error) {
    console.error('[ERRO] PUT /admin/users/:id/suspend:', error.message);
    res.status(500).json({ error: 'Erro ao suspender usuário.' });
  }
});

/**
 * 🔎 Listar usuários com busca opcional por username ou email
 * GET /api/admin/users?search=
 */
export const listUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i'); // busca insensível a maiúsculas/minúsculas

    const users = await User.find({
      $or: [
        { username: regex },
        { email: regex }
      ]
    }).select('-password');

    res.json(users);
  } catch (error) {
    console.error('[ERRO] GET /admin/users:', error.message);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

export default router;
