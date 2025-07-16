import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.DATABASE_URL, {
  dbName: 'ecommerce',
})
.then(async () => {
  const hashedPassword = await bcrypt.hash('odracir.1', 10); // aqui a senha em texto é convertida

  const adminUser = new User({
    name: 'Ricardo Rosa',
    email: 'rosaricardo290@gmail.com',
    password: hashedPassword,
    isAdmin: true
  });

  await adminUser.save();
  console.log('✅ Admin criado com sucesso');
  process.exit();
})
.catch(err => {
  console.error('❌ Erro ao conectar no MongoDB:', err);
});
