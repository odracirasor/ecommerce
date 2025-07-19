import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, image, author } = req.body;
    if (!name || !price || !category || !description || !image || !author) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const newProduct = new Product({ name, price, category, description, image, author });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar produto' });
  }
};

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ postedAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};
