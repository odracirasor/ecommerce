import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(409).json({ error: "Email já está registrado" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });

  await newUser.save();
  res.status(201).json({ message: "Usuário registrado com sucesso" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Senha incorreta' });

  const token = jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token, isAdmin: user.isAdmin, name: user.name });
};
