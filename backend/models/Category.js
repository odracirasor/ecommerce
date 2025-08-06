// models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String }, // optional
  createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
