import Product from '../models/Product.js';

// 👉 Criar novo produto
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, image, author } = req.body;

    if (!name || !price || !description || !category || !image || !author) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      image,
      author,
      publishedAt: new Date()
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ error: 'Erro interno ao criar produto.' });
  }
};

// 👉 Listar todos os produtos
export const listProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ publishedAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).json({ error: 'Erro ao listar produtos.' });
  }
};

// 👉 Buscar produto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });
    res.json(product);
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    res.status(500).json({ error: 'Erro ao buscar produto.' });
  }
};

// 👉 Deletar produto
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Produto não encontrado para deletar.' });
    res.json({ message: 'Produto deletado com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    res.status(500).json({ error: 'Erro ao deletar produto.' });
  }
};
