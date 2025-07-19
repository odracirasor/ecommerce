import jwt from 'jsonwebtoken';

// ✅ Middleware para verificar o token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;           // { id, isAdmin }
    req.userId = decoded.userId;  // Compatibilidade
    next();
  } catch (err) {
    console.error('Erro na verificação do token:', err.message);
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};

// ✅ Verifica se o usuário é admin
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: 'Apenas administradores têm acesso.' });
    }
  });
};

// ✅ Verifica se o usuário está autenticado (sem checar isSeller)
const verifyAuthenticated = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user) {
      next();
    } else {
      res.status(403).json({ error: 'Usuário não autenticado.' });
    }
  });
};

export default verifyToken;
export { verifyAdmin, verifyAuthenticated };
