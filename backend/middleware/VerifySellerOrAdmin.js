const verifySellerOrAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.isSeller || req.user.isAdmin)) {
      next();
    } else {
      res.status(403).json({ error: 'Acesso negado: apenas vendedores ou administradores' });
    }
  });
};
export { verifyAdmin, verifySellerOrAdmin };
