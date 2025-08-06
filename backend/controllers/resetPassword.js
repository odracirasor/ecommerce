import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "Nova senha é obrigatória" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Senha atualizada com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao redefinir senha:", error);
    res.status(400).json({ message: "Token inválido ou expirado" });
  }
};

export default resetPassword;
