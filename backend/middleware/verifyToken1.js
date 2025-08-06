// ✅ Middleware placeholder para autenticação
export const verifyToken1 = (req, res, next) => {
  // Autenticação desativada temporariamente
  // Exemplo: pode-se validar token JWT aqui no futuro

  // req.user = { _id: 'exemploId', isAdmin: true }; // se necessário, pode simular um usuário
  next();
};

// ✅ Middleware placeholder para verificação de admin
export const verifyAdmin = (req, res, next) => {
  // Autorização desativada temporariamente
  // Exemplo: verificar req.user.isAdmin no futuro

  next();
};
