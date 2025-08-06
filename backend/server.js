import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import Message from './models/Message.js';
import User from './models/User.js'; // IMPORTANTE: modelo User para buscar remetente

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Uploads estáticos
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Criar servidor HTTP e Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

// Socket.IO — comunicação em tempo real
io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);

  // Entrar na sala do usuário
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} entrou na sala do usuário ${userId}`);
  });

  // Receber mensagem enviada, salvar e emitir para destinatário e remetente
  socket.on('sendMessage', async (messageData) => {
    try {
      const message = new Message(messageData);
      await message.save();

      // Buscar dados do remetente para enviar junto
      const sender = await User.findById(message.senderId).select('name photo email');

      const payload = {
        ...message.toObject(),
        sender,
      };

      // Emitir nova mensagem para o destinatário
      io.to(message.receiverId).emit('newMessage', payload);
      // Emitir também para o remetente (atualizar inbox dele)
      io.to(message.senderId).emit('newMessage', payload);

      console.log(`Mensagem enviada de ${message.senderId} para ${message.receiverId}`);
    } catch (error) {
      console.error('Erro ao salvar mensagem ou emitir evento:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Conectar ao MongoDB e iniciar servidor
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
  });
