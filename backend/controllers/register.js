import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import { sendVerificationEmail } from '../../utils/emailService.js';
import { createToken } from '../../utils/token.js';

const register = async (req, res) => {
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

export default register;
