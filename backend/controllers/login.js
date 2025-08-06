import User from '../../models/User.js';

const login = async (req, res) => {
  console.log('➡️ Requisição recebida para login');
  console.log('📥 Body recebido:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.warn('⚠️ Email ou senha não fornecidos');
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const user = await User.findOne({ email });
    console.log('🔍 Usuário encontrado no banco:', user);

    if (!user) {
      console.warn('⚠️ Usuário não encontrado');
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    // Verificação de senha manual (sem bcrypt)
    const passwordMatch = password === user.password;
    console.log('🔐 Senha válida?', passwordMatch);

    if (!passwordMatch) {
      console.warn('⚠️ Senha incorreta');
      return res.status(401).json({ error: "Senha incorreta" });
    }

    if (!user.isVerified) {
      console.warn('⚠️ Usuário ainda não verificou o email');
      return res.status(403).json({ error: "Email ainda não verificado" });
    }

    // Retorna os dados do usuário (sem senha)
    const sanitizedUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin || false,
      role: user.role || 'user',
    };

    console.log('✅ Login bem-sucedido');
    res.json({ user: sanitizedUser });
  } catch (error) {
    console.error("❌ Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro interno ao fazer login", details: error.message });
  }
};

export default login;
