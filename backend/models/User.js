import mongoose from 'mongoose';

console.log("📦 Carregando modelo User...");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true,
    minlength: 3,
    maxlength: 30,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  profileImage: { type: String },
  address: { type: String },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  messages: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      date: { type: Date, default: Date.now },
    }
  ], // 👈 AQUI FECHA CORRETAMENTE O CAMPO MESSAGES
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  balance: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Middlewares e hooks
userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    // Lógica para hash de senha pode ser adicionada aqui
  }
  next();
});

userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Email ou username já existe'));
  } else {
    next(error);
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

console.log("✅ Modelo User carregado com sucesso");

export default User;
