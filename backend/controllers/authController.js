import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

// REGISTRO
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });

  try {
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing)
      return res.status(409).json({ error: "Email ou nome de usuário já em uso" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verifyToken: token,
      verified: false
    });

    await newUser.save();

    await sendVerificationEmail(email, token);

    res.status(201).json({ message: "Conta criada! Verifique seu e-mail para ativá-la." });
  } catch (error) {
    console.error("Erro ao registrar:", error);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email e senha são obrigatórios" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: 'Usuário não encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: 'Senha incorreta' });

    if (!user.verified)
      return res.status(403).json({ error: 'Email ainda não verificado. Verifique sua caixa de entrada.' });

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, isAdmin: user.isAdmin, username: user.username });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};

// VERIFICAÇÃO DO EMAIL
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado" });

    if (user.verified)
      return res.status(400).json({ error: "Conta já verificada" });

    user.verified = true;
    user.verifyToken = undefined;
    await user.save();

    res.status(200).json({ message: "Conta verificada com sucesso" });
  } catch (error) {
    console.error("Erro ao verificar conta:", error);
    res.status(400).json({ error: "Token inválido ou expirado" });
  }
};
