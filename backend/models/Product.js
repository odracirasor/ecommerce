import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
  category: { type: String },
  countInStock: { type: Number, default: 0 },
  sold: { type: Boolean, default: false },
  
  // 👇 Adiciona este campo
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // este nome deve ser igual ao model de usuário
    required: true,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Product', productSchema);
