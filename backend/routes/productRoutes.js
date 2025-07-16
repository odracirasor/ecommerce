import express from 'express';
import { createProduct, listProducts, getProductById, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.delete('/:id', deleteProduct);

export default router;
