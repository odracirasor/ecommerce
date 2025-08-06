import jwt from 'jsonwebtoken';

// ✅ Verifica se o token JWT é válido
export const verifyToken1 = (req, res, next) => {
  console.log('🛡️ Iniciando verificação de token...');

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    console.warn('⚠️ Token JWT não fornecido ou mal formatado no cabeçalho Authorization.');
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔐 Token recebido:', token);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.error('⏰ Token expirado!');
        return res.status(403).json({ error: 'Token expirado. Faça login novamente.' });
      } else if (err.name === "JsonWebTokenError") {
        console.error('❌ Token inválido:', err.message);
        return res.status(403).json({ error: 'Token inválido.' });
      } else {
        console.error('❌ Erro na verificação do token:', err.message);
        return res.status(403).json({ error: 'Erro ao verificar token.' });
      }
    }

    console.log('✅ Token decodificado com sucesso:', decoded);

    // Atenção: use `userId`, não `_id` se foi assim que você criou o token
    req.user = {
      _id: decoded.userId || decoded._id, // compatível com qualquer nome usado no token
      isAdmin: decoded.isAdmin || false
    };
    next();
  });
};

// ✅ Verifica se o usuário é admin
export const verifyAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    console.warn('🚫 Acesso negado: usuário não é admin');
    return res.status(403).json({ error: 'Acesso restrito a administradores.' });
  }
  console.log('🛂 Acesso de administrador concedido.');
  next();
};
