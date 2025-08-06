// routes/configRoutes.js
import express from 'express';
import UserConfig from '../models/UserConfig.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // middleware para proteger rota

const router = express.Router();

// Obter configurações do usuário logado
router.get('/me', verifyToken, async (req, res) => {
  try {
    const config = await UserConfig.findOne({ userId: req.user._id });
    res.json(config || {});
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar configurações' });
  }
});

// Salvar ou atualizar configurações
router.post('/me', verifyToken, async (req, res) => {
  try {
    const { username, biType, biNumber, biImageUrl, background } = req.body;
    let config = await UserConfig.findOne({ userId: req.user._id });

    if (!config) {
      config = new UserConfig({ userId: req.user._id, username, biType, biNumber, biImageUrl, background });
    } else {
      config.username = username;
      config.biType = biType;
      config.biNumber = biNumber;
      config.biImageUrl = biImageUrl;
      config.background = background;
    }

    await config.save();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar configurações' });
  }
});

export default router;
