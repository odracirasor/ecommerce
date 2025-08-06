import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import RefreshToken from '../models/RefreshToken.js';

import User from '../models/userModel.js'; // ajuste o caminho se necessário

dotenv.config();

const router = express.Router();

// 📌 Rota para verificar a conta com token
router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;
  console.log("🔍 Iniciando verificação com token:", token);

  try {
    // 🧠 Decodifica o token usando a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decodificado com sucesso:", decoded);

    // 🔎 Busca o usuário com e-mail e token correspondentes
    const user = await User.findOne({
      email: decoded.email,
      verifyToken: token
    });

    if (!user) {
      console.warn("⚠️ Usuário não encontrado ou token não corresponde.");
      return res.status(400).json({ error: "Token inválido ou já utilizado." });
    }

    // ✅ Atualiza o status de verificação
    user.isVerified = true;
    user.verifyToken = null;

    await user.save();
    console.log(`✅ Conta verificada com sucesso para o e-mail: ${user.email}`);

    res.status(200).json({ message: "Conta verificada com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao verificar token:", error.message);
    res.status(400).json({ error: "Token expirado ou inválido" });
  }
});
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    // Cria token com expiração de 1 hora
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Atualiza campos de reset
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    // Configura o Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Redefinição de Senha",
      html: `
        <p>Você solicitou a redefinição de senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este link é válido por 1 hora.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Email de recuperação enviado!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
});
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token ausente' });

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) return res.status(403).json({ error: 'Refresh token inválido' });

    const newAccessToken = generateAccessToken({ _id: payload.id });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: 'Token expirado ou inválido' });
  }
});

export default router;
