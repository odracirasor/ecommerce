import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { validateProductFields } from '../middlewares/validateProduct.js';
import { uploadToCloudStorage } from '../utils/upload.js'; // supondo que você tenha esse util

const router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 4
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'images' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed'));
    }
    if (file.fieldname === 'video' && !file.mimetype.startsWith('video/')) {
      return cb(new Error('Only videos are allowed'));
    }
    cb(null, true);
  }
});

// Rate limiter para evitar DoS
const postLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: 'Too many product submissions from this IP, try again later.'
});

// GET product by ID
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.id)
      .populate('seller', 'name _id avatar email')
      .lean();

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const isNew = product.createdAt 
      ? new Date() - new Date(product.createdAt) < 7 * 24 * 60 * 60 * 1000
      : false;

    const reviewsCount = product.reviews?.length || 0;
    const averageRating = reviewsCount
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount
      : 0;

    const response = {
      ...product,
      isNew,
      sold: product.sold || 0,
      stock: product.stock || 0,
      price: product.price || 0,
      location: product.location || "Location not specified",
      description: product.description || "No description available",
      reviewsCount,
      averageRating: Math.round(averageRating * 10) / 10
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// POST create product
router.post(
  '/post-product',
  postLimiter,
  upload.fields([{ name: 'images', maxCount: 3 }, { name: 'video', maxCount: 1 }]),
  validateProductFields,
  async (req, res) => {
    try {
      const {
        name,
        price,
        description,
        category,
        brand,
        color,
        weight,
        stock,
        countInStock,
        location,
        seller,
        user
      } = req.body;

      if (seller && !mongoose.Types.ObjectId.isValid(seller)) {
        return res.status(400).json({ error: 'Invalid seller ID' });
      }
      if (user && !mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const sellerExists = await User.findById(seller);
      if (!sellerExists) {
        return res.status(400).json({ error: 'Seller not found' });
      }

      let imageUrls = [];
      let videoUrl = null;
      let imageThumb = null;

      try {
        if (req.files['images']) {
          imageUrls = await Promise.all(
            req.files['images'].map(file => uploadToCloudStorage(file, 'products/images'))
          );
          imageThumb = imageUrls[0]; // usar primeira imagem como thumbnail
        }

        if (req.files['video']) {
          videoUrl = await uploadToCloudStorage(req.files['video'][0], 'products/videos');
        }
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        return res.status(500).json({ error: 'File upload failed', details: uploadError.message });
      }

      const newProduct = new Product({
        name,
        price: Number(price),
        description,
        category,
        brand,
        color,
        weight: weight ? Number(weight) : undefined,
        stock: stock ? Number(stock) : 0,
        countInStock: countInStock ? Number(countInStock) : 0,
        location,
        seller,
        user,
        image: imageThumb,
        images: imageUrls,
        video: videoUrl
      });

      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }
);

// GET product seller
router.get('/:id/seller', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('seller');
    if (!product || !product.seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    const seller = await User.findById(product.seller)
      .select('name _id avatar rating')
      .lean();
      
    res.json(seller);
  } catch (err) {
    console.error('Error fetching seller:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all products (paginated)
router.get('/', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find({})
      .select('name price image sold createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments();

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
