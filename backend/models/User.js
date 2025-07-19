import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  verifyToken: { type: String }, // ✅ Faltava vírgula aqui
  address: { type: String, default: '' },           // ✅ Novo campo
  profileImage: { type: String, default: '' }       // ✅ Novo campo
});

const User = mongoose.model('User', userSchema);
export default User;
