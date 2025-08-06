export const requireAuth = (req, res, next) => {
  // 🔓 Sessão desativada — nenhuma verificação está sendo feita agora

  // Exemplo: para uso futuro com JWT, token customizado ou mock
  // if (!req.user) {
  //   return res.status(401).json({ error: 'Usuário não autenticado.' });
  // }

  next();
};
