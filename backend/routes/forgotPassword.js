import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../../models/userModel.js';

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    // 🔑 Gera um token aleatório seguro (hex)
    const token = crypto.randomBytes(32).toString('hex');

    // Salva o token e a expiração no banco de dados
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // Link de redefinição
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    // ✉️ Configura o transporte de email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 📨 Conteúdo do email
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Redefinição de Senha',
      html: `
        <p>Você solicitou a redefinição de senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este link é válido por 1 hora.</p>
      `,
    };

    // Envia o email
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Email de recuperação enviado!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor.' });
  }
};
