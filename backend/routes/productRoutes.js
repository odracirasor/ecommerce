import express from 'express';
import {
  createProduct,
  listProducts,
  getProductById,
  deleteProduct,
  getPopularProducts,
  createReview, // 👈 nova função para adicionar avaliação
} from '../controllers/productController.js';

const router = express.Router();

// Rota para produtos populares (deve vir antes de '/:id')
router.get('/popular', getPopularProducts);

// Listar todos os produtos
router.get('/', listProducts);

// Criar novo produto
router.post('/', createProduct);

// Adicionar uma avaliação a um produto
router.post('/:id/reviews', createReview); // 👈 nova rota

// Buscar produto por ID
router.get('/:id', getProductById);

// Deletar produto
router.delete('/:id', deleteProduct);

export default router;
