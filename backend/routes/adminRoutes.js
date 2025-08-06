import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// 🔁 Simula um admin logado (remova isso em produção!)
router.use((req, res, next) => {
  req.user = { _id: '68776571bec5f5970d09eb2f', isAdmin: true };
  next();
});

/**
 * 🔍 Buscar usuários com filtro e ordenação
 * GET /api/admin/users?search=termo&sort=name
 */
router.get('/users', async (req, res) => {
  try {
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i');
    const sort = req.query.sort === 'name' ? { username: 1 } : {};

    const users = await User.find({
      $or: [{ username: regex }, { email: regex }]
    })
      .select('-password -verifyToken -resetPasswordToken -resetPasswordExpires')
      .sort(sort);

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
router.put('/users/:id/promote', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    if (user.isAdmin) return res.json({ message: 'Usuário já é admin.' });

    user.isAdmin = true;
    await user.save();

    res.json({ message: `Usuário ${user.username} promovido a admin.` });
  } catch (error) {
    console.error('[ERRO] PROMOTE:', error.message);
    res.status(500).json({ error: 'Erro ao promover usuário.' });
  }
});

/**
 * 🚫 Suspender usuário
 * PUT /api/admin/users/:id/suspend
 */
router.put('/users/:id/suspend', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    if (user.suspended) return res.json({ message: 'Usuário já está suspenso.' });

    user.suspended = true;
    await user.save();

    res.json({ message: `Usuário ${user.username} suspenso com sucesso.` });
  } catch (error) {
    console.error('[ERRO] SUSPEND:', error.message);
    res.status(500).json({ error: 'Erro ao suspender usuário.' });
  }
});

/**
 * ✅ Reativar usuário suspenso
 * PUT /api/admin/users/:id/reactivate
 */
router.put('/users/:id/reactivate', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    if (!user.suspended) return res.json({ message: 'Usuário já está ativo.' });

    user.suspended = false;
    await user.save();

    res.json({ message: `Usuário ${user.username} reativado com sucesso.` });
  } catch (error) {
    console.error('[ERRO] REACTIVATE:', error.message);
    res.status(500).json({ error: 'Erro ao reativar usuário.' });
  }
});

export default router;
