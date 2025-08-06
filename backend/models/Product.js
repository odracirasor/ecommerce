import mongoose from 'mongoose';

// ✅ Subschema de avaliação (review)
const reviewSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Schema do Produto
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },

    image: { type: String },
    images: [String],

    video: { type: String }, // 🎥 novo campo de vídeo

    brand: { type: String },
    category: { type: String },
    color: { type: String },
    weight: { type: Number },

    stock: { type: Number, default: 0 },
    countInStock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },

    location: {
      type: String,
      default: "Localização não informada",
    },

    seller: {
      name: String,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reviews: [reviewSchema],
  },
  { timestamps: true }
);

// ✅ Criando o model corretamente
const Product = mongoose.model("Product", productSchema);
export default Product;
