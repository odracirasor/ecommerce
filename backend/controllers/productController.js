import Product from '../models/Product.js';
import mongoose from 'mongoose';

// ✅ Criar produto
export const createProduct = async (req, res) => {
  try {
    // Verifica se o usuário autenticado está presente
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const product = new Product({
      ...req.body,
      user: req.user._id // ✅ Define o user automaticamente
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('❌ Erro ao criar produto:', err);
    res.status(500).json({ error: 'Erro ao criar produto', details: err.message });
  }
};

// ✅ Listar todos os produtos
export const listProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('user', 'name'); // Certifica que 'user' está no schema
    res.json(products);
  } catch (err) {
    console.error('❌ Erro ao listar produtos:', err);
    res.status(500).json({ error: 'Erro ao listar produtos', details: err.message });
  }
};

// ✅ Obter um produto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (err) {
    console.error('❌ Erro ao buscar produto por ID:', err);
    res.status(500).json({ error: 'Erro ao buscar produto', details: err.message });
  }
};

// ✅ Atualizar um produto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de produto inválido.' });
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Produto não encontrado para atualizar.' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro ao atualizar produto.', details: err.message });
  }
};

// ✅ Deletar um produto
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    console.error('❌ Erro ao deletar produto:', err);
    res.status(500).json({ error: 'Erro ao deletar produto', details: err.message });
  }
};

