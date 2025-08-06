import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    imageThumb: { type: String },
    images: [String],
    video: { type: String },
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
    status: {
      type: String,
      enum: ['active', 'inactive', 'soldOut'],
      default: 'active'
    },
    tags: [String],

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    reviews: [reviewSchema],
  },
  { timestamps: true }
);

// Virtuals para média de avaliação e número de avaliações
productSchema.virtual('averageRating').get(function () {
  if (!this.reviews || this.reviews.length === 0) return 0;
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / this.reviews.length) * 10) / 10;
});

productSchema.virtual('reviewsCount').get(function () {
  return this.reviews?.length || 0;
});

productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

// Indexes para performance
productSchema.index({ createdAt: -1 });
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
