import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Conta já verificada' });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Conta verificada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Token inválido ou expirado' });
  }
};
