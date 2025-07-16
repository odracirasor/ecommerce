import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String, // URL da imagem
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Criador
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
