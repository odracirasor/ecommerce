import jwt from 'jsonwebtoken';

// ✅ Middleware principal para verificar o token JWT
const verifyToken = (req, res, next) => {
  console.log('🛡️ Iniciando verificação de token...');

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('⚠️ Token JWT não fornecido no cabeçalho Authorization');
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔐 Token recebido:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decodificado com sucesso:', decoded);

    req.user = {
      _id: decoded._id,
      isAdmin: decoded.isAdmin || false
    };

    console.log('👤 Usuário autenticado padronizado:', req.user);
    next();
  } catch (err) {
    console.error('❌ Erro na verificação do token:', err.message);
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};

// ✅ Verifica se o usuário é administrador
const verifyAdmin = (req, res, next) => {
  console.log('👮 Verificando se o usuário é administrador...');
  if (req.user && req.user.isAdmin) {
    console.log('✅ Usuário tem permissão de administrador');
    next();
  } else {
    console.warn('⛔ Acesso negado: usuário não é administrador');
    res.status(403).json({ error: 'Apenas administradores têm acesso.' });
  }
};

// ✅ Verifica se o usuário está autenticado
const verifyAuthenticated = (req, res, next) => {
  console.log('🔒 Verificando autenticação do usuário...');
  if (req.user) {
    console.log('✅ Usuário autenticado:', req.user);
    next();
  } else {
    console.warn('⛔ Usuário não autenticado.');
    res.status(403).json({ error: 'Usuário não autenticado.' });
  }
};

// ✅ Exportações nomeadas (sem default)
export { verifyToken, verifyAdmin, verifyAuthenticated };
