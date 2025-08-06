import User from '../../models/User.js';
import { createResetToken } from '../../utils/token.js';
import { sendResetEmail } from '../../utils/emailService.js';

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const token = createResetToken({ _id: user._id }, "1h");
    const link = `http://localhost:5173/reset-password/${token}`;

    await sendResetEmail(user.email, link);

    res.status(200).json({ message: "E-mail de redefinição enviado" });
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

export default forgotPassword;
