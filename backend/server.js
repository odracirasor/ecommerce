// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ✅ Importação de rotas e middlewares
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js'; // ✅ Adicionado
import errorHandler from './middleware/errorHandler.js';

// Configurar __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar dotenv
dotenv.config();

// Verificar se DATABASE_URL está definida
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL não definida no arquivo .env");
  process.exit(1);
}

// Criar app Express
const app = express();
const PORT = process.env.PORT || 5000;

// Configuração CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Verificar/criar pasta de uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Servir arquivos estáticos da pasta de uploads
app.use('/uploads', express.static(uploadDir));

// Conexão com o MongoDB
mongoose.connect(process.env.DATABASE_URL, { dbName: 'ecommerce' })
  .then(() => console.log('✅ MongoDB conectado com sucesso'))
  .catch((err) => {
    console.error('❌ Erro ao conectar MongoDB:', err);
    process.exit(1);
  });

// ✅ Rotas principais
app.use('/api/auth', authRoutes);         // Registro e login
app.use('/api/products', productRoutes);  // Produtos
app.use('/api/upload', uploadRoutes);     // Upload de imagem
app.use('/api/orders', orderRoutes);      // Pedidos

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: '🚀 API rodando com sucesso',
    timestamp: new Date()
  });
});

// Middleware global de erro (deve ficar por último)
app.use(errorHandler);

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
