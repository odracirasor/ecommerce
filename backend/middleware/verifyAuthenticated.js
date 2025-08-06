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

export default verifyAuthenticated;
