export default (err, req, res, next) => {
  console.error('Erro global:', err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
};
