// services/productService.js
import Product from '../models/Product.js';
import mongoose from 'mongoose';

export const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createNewProduct = async (data, userId) => {
  const product = new Product({ ...data, user: userId });
  return await product.save();
};

export const getAllProducts = async () => {
  return await Product.find().populate('user', 'name');
};

export const getProductByIdService = async (id) => {
  return await Product.findById(id);
};

export const updateProductById = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteProductById = async (id) => {
  return await Product.findByIdAndDelete(id);
};

export const getPopularProductsService = async () => {
  return await Product.find().sort({ sold: -1 }).limit(6);
};

export const getSuggestionsService = async () => {
  return await Product.find().limit(6);
};

export const addReviewToProduct = async (id, review) => {
  const product = await Product.findById(id);
  if (!product) return null;
  product.reviews.unshift(review);
  await product.save();
  return product;
};
