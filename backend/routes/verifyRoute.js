// routes/verifyRoute.js
import express from 'express';
import { verifyToken1 } from '../middleware/verifyToken1.js';

const router = express.Router();

// ✅ Rota protegida para verificar autenticação
router.get('/', verifyToken1, (req, res) => {
  res.json({
    message: 'Token válido. Usuário autenticado.',
    user: req.user,
  });
});

export default router;
