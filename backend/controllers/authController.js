import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendVerificationEmail, sendResetEmail } from '../utils/emailService.js';
import sanitizeUser from '../utils/sanitizeUser.js';

const resetTokens = new Map(); // Em produção, use um banco de dados com expiração

// ✅ Registro de usuário
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomUUID();

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verifyToken,
    });

    await sendVerificationEmail(email, verifyToken);

    res.status(201).json({ message: 'Conta criada. Verifique seu email.' });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

// ✅ Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Senha incorreta.' });

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Verifique seu email antes de entrar.' });
    }

    req.session.user = sanitizeUser(user);

    res.status(200).json({ message: 'Login bem-sucedido', user: sanitizeUser(user) });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

// ✅ Verificar email
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verifyToken: token });
    if (!user) return res.status(400).json({ error: 'Token inválido ou expirado.' });

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verificado com sucesso.' });
  } catch (err) {
    console.error('Erro ao verificar email:', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
};

// ✅ Esqueci a senha
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email é obrigatório.' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const token = crypto.randomUUID();
    resetTokens.set(token, {
      userId: user._id,
      expires: Date.now() + 3600000, // 1 hora
    });

    const link = `http://localhost:5173/reset-password/${token}`;
    await sendResetEmail(email, link);

    res.status(200).json({ message: 'Email de redefinição enviado.' });
  } catch (err) {
    console.error('Erro em forgotPassword:', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
};

// ✅ Redefinir senha
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
  }

  try {
    const data = resetTokens.get(token);

    if (!data || data.expires < Date.now()) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    const user = await User.findById(data.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    resetTokens.delete(token);

    res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
};
