// controllers/productController.js
import Product from "../models/Product.js";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

import {
  createNewProduct,
  getAllProducts,
  getProductByIdService,
  updateProductById,
  deleteProductById,
  getPopularProductsService,
  getSuggestionsService,
  addReviewToProduct,
  validateObjectId,
} from '../services/productService.js';

// ✅ Criar produto
export const createProduct = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const product = await createNewProduct(req.body, req.user._id);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar produto', details: err.message });
  }
};

// ✅ Listar todos os produtos
export const listProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar produtos', details: err.message });
  }
};

// ✅ Obter produto por ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const product = await getProductByIdService(id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produto', details: err.message });
  }
};

// ✅ Atualizar produto
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ error: 'ID de produto inválido.' });
  }

  try {
    const updated = await updateProductById(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar produto.', details: err.message });
  }
};

// ✅ Deletar produto
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const deleted = await deleteProductById(id);
    if (!deleted) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar produto', details: err.message });
  }
};

// ✅ Produtos populares
export const getPopularProducts = async (req, res) => {
  try {
    const popular = await getPopularProductsService();
    res.json(popular);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos populares', details: err.message });
  }
};

// ✅ Sugestões
export const getSuggestions = async (req, res) => {
  try {
    const suggestions = await getSuggestionsService();
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar sugestões', details: err.message });
  }
};

// ✅ Criar avaliação
export const createReview = async (req, res) => {
  const { id } = req.params;
  const { username, rating, comment } = req.body;

  if (!username || !rating || !comment) {
    return res.status(400).json({ error: 'Todos os campos da avaliação são obrigatórios.' });
  }

  try {
    const review = { username, rating, comment };
    const product = await addReviewToProduct(id, review);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.status(201).json({ message: 'Avaliação adicionada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar avaliação', details: err.message });
  }
};

// ✅ Upload de vídeo do produto
export const uploadProductVideo = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });

    const videoPath = path.resolve(req.file.path);

    ffmpeg.ffprobe(videoPath, async (err, metadata) => {
      if (err) {
        console.error("Erro no ffprobe:", err);
        return res.status(500).json({ error: "Erro ao analisar o vídeo" });
      }

      const duration = metadata.format.duration;
      if (duration > 10) {
        return res.status(400).json({ error: "O vídeo deve ter no máximo 10 segundos" });
      }

      product.video = `/uploads/videos/${req.file.filename}`;
      await product.save();

      res.status(200).json({ message: "Vídeo carregado com sucesso", video: product.video });
    });
  } catch (err) {
    console.error("Erro no upload do vídeo:", err);
    res.status(500).json({ error: "Erro interno ao fazer upload do vídeo" });
  }
};
