import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendVerificationEmail, sendResetEmail } from '../utils/emailService.js';
import { createToken } from '../utils/token.js';

// ✅ REGISTRO DE USUÁRIO
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ error: "Email ou nome de usuário já em uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = createToken({ email }, "1d");

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verifyToken: token,
      isVerified: false,
    });

    await newUser.save();
    await sendVerificationEmail(email, token);

    res.status(201).json({ message: "Conta criada! Verifique seu e-mail para ativá-la." });
  } catch (error) {
    console.error("❌ Erro ao registrar:", error);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: "Email ainda não verificado" });
    }

    const payload = {
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin || false,
      role: user.role || 'user',
    };

    const token = createToken(payload, "30d");

    res.json({ token, user: payload });
  } catch (error) {
    console.error("❌ Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};

// ✅ VERIFICAÇÃO DE E-MAIL
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Conta já verificada" });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.status(200).json({ message: "Conta verificada com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao verificar e-mail:", error);
    res.status(400).json({ error: "Token inválido ou expirado" });
  }
};

// ✅ ESQUECEU A SENHA (corrigido)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const token = createToken({ _id: user._id }, "1h"); // ✅ CORRIGIDO
    const link = `http://localhost:5173/reset-password/${token}`;

    await sendResetEmail(user.email, link);

    res.status(200).json({ message: "E-mail de redefinição enviado" });
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

// ✅ REDEFINIR SENHA
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "Nova senha é obrigatória" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id); // ✅ compatível com o token

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
