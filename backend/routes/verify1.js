import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.get('/api/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verificado com sucesso' });
  } catch (error) {
    res.status(400).json({ message: 'Token inválido ou expirado' });
  }
});

export default router;
