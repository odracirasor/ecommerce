import express from 'express';
import multer from 'multer';
import {
  getMe,
  updateMe,
  getUserById,
  getUserBalance,
  sendMessageToUser,
  updateAvatar,
} from '../controllers/userController.js';
import { getInbox } from '../controllers/messageController.js';

const router = express.Router();

// 🧪 Middleware para mock de usuário (substitui autenticação)
router.use((req, res, next) => {
  req.user = {
    _id: '68776571bec5f5970d09eb2f', // ID mockado (coloque um válido do seu MongoDB, se desejar)
    name: 'Ricardo Rosa',
    email: 'rosaricardo290@gmail.com',
    isAdmin: true,
  };
  next();
});

// Configuração do multer (armazenamento em disco)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage });

// Rotas simuladas com mock de autenticação
router.get('/me', getMe);
router.put('/me', updateMe);
router.get('/balance', getUserBalance);
router.get('/inbox', getInbox);

// 📸 Atualizar foto de perfil (sem autenticação real, com req.user simulado)
router.put('/:userId/avatar', upload.single('avatar'), updateAvatar);

// Enviar mensagem para outro usuário (req.user simulado)
router.post('/:recipientId/message', sendMessageToUser);

// Rota genérica deve ficar por último
router.get('/:userId', getUserById);

export default router;
