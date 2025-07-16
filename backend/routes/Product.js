// routes/products.js
const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// Criar novo produto
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

// Obter todos os produtos
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

module.exports = router;
