import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

// Configurar __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criar a pasta "uploads" se não existir
const uploadDir = path.join(__dirname, '../uploads');
console.log("📂 Verificando diretório de upload:", uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Diretório criado:", uploadDir);
} else {
  console.log("✅ Diretório já existe");
}

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📥 Salvando arquivo em:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    console.log("📝 Nome do arquivo gerado:", uniqueName);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    console.log("🔍 Validando arquivo:", file.originalname);
    const allowed = /jpeg|jpg|png|gif/;
    const mimetype = allowed.test(file.mimetype);
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      console.log("✅ Tipo de arquivo permitido:", file.mimetype);
      return cb(null, true);
    }

    console.warn("⚠️ Tipo de arquivo não permitido:", file.mimetype);
    cb(new Error('Apenas arquivos de imagem são permitidos (jpeg, jpg, png, gif).'));
  }
}).single('image');

// POST /api/upload
router.post('/', (req, res) => {
  console.log("📤 Rota /api/upload chamada");

  upload(req, res, (err) => {
    if (err) {
      console.error("❌ Erro no upload:", err.message);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      console.warn("⚠️ Nenhum arquivo recebido.");
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log("✅ Upload concluído. URL da imagem:", imageUrl);

    res.status(200).json({ imageUrl });
  });
});

export default router;
