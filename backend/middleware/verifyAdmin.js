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

export default verifyAdmin;
