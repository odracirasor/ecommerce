import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import http from 'http'; // ✅ importação correta
import { Server } from "socket.io";

// Rotas
import authRoutes from './routes/authRoutes.js';
import messageRoutes from "./routes/messageRoutes.js"
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import verifyRoute from './routes/verify1.js';
import categoryRoutes from './routes/categoryRoutes.js';


// Diretório
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env
dotenv.config();
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL não definida no .env");
  process.exit(1);
}

// Express
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://ecommerce-frontend.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ✅ Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ✅ JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// ✅ MongoDB
mongoose.set('debug', true);
mongoose.connect(process.env.DATABASE_URL, { dbName: 'ecommerce' })
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  });

// ✅ Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', verifyRoute);
app.use('/api/categories', categoryRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Teste
app.get('/', (req, res) => {
  res.json({
    status: '🟢 online',
    message: 'Servidor rodando com sucesso!',
    time: new Date()
  });
});

// ✅ Middleware de erro
app.use((err, req, res, next) => {
  console.error('❌ ERRO:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🚫' : err.stack
  });
});

// ✅ Criar servidor HTTP com socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://ecommerce-frontend.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
});

// ✅ Socket.IO conexão
io.on("connection", (socket) => {
  console.log("🟢 Novo cliente conectado:", socket.id);

  socket.on("send_message", (data) => {
    console.log("📨 Mensagem recebida:", data);
    io.emit("receive_message", data); // broadcast para todos
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

// ✅ Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando: http://localhost:${PORT}`);
});
