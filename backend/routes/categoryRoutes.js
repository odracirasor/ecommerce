// routes/categoryRoutes.js
import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// Add new category
router.post('/', async (req, res) => {
  try {
    const { name, image } = req.body;
    const category = new Category({ name, image });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
