import path from "path";
import ffmpeg from "fluent-ffmpeg";
import Product from "../models/Product.js";
import {
  getProductByIdService,
  updateProductById,
  deleteProductById,
  getPopularProductsService,
  getSuggestionsService,
  addReviewToProduct,
  validateObjectId,
} from "../services/productService.js";

// 🔍 Verificação de duração do vídeo
const isVideoTooLong = (filePath, maxSeconds = 10) =>
  new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata?.format?.duration || 0;
      resolve(duration > maxSeconds);
    });
  });

// ✅ Criar produto com validações
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      brand,
      category,
      color,
      weight,
      location,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: '"name", "price" e "category" são obrigatórios.' });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ success: false, message: '"price" deve ser um número positivo.' });
    }

    const images = req.files?.image?.map(file => file.path) || [];
    if (images.length < 1) {
      return res.status(400).json({ success: false, message: "Envie ao menos 1 imagem do produto." });
    }

    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const allowedVideoTypes = ["video/mp4", "video/webm"];

    if (req.files?.image?.some(file => !allowedImageTypes.includes(file.mimetype))) {
      return res.status(400).json({ success: false, message: "Formato de imagem inválido." });
    }

    let video = "";
    const videoFile = req.files?.video?.[0];

    if (videoFile) {
      if (!allowedVideoTypes.includes(videoFile.mimetype)) {
        return res.status(400).json({ success: false, message: "Formato de vídeo inválido." });
      }
      const videoPath = path.resolve(videoFile.path);
      const tooLong = await isVideoTooLong(videoPath);
      if (tooLong) {
        return res.status(400).json({ success: false, message: "O vídeo deve ter no máximo 10 segundos." });
      }
      video = videoFile.path;
    }

    const newProduct = new Product({
      name,
      price,
      description,
      brand,
      category,
      color,
      weight,
      stock: 0,
      countInStock: 0,
      views: 0,
      location,
      images,
      video,
      seller: req.user?._id || null,
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: "Produto criado com sucesso", data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar produto", error: error.message });
  }
};

// ✅ Paginação + filtros
export const listProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;

    const filter = {};

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("seller", "name avatar email")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products,
      page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro ao listar produtos", error: err.message });
  }
};

// ✅ Obter por ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID inválido" });
  }

  try {
    const product = await Product.findById(id).populate("seller", "name email avatar");

    if (!product) {
      return res.status(404).json({ success: false, message: "Produto não encontrado" });
    }

    product.views = (product.views || 0) + 1;
    await product.save();

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro ao buscar produto", error: err.message });
  }
};

// ✅ Atualizar produto
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID inválido" });
  }

  const forbiddenFields = ["views", "countInStock"];
  forbiddenFields.forEach(field => delete req.body[field]);

  try {
    const updated = await updateProductById(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Produto não encontrado" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro ao atualizar produto", error: err.message });
  }
};

// ✅ Deletar produto
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID inválido" });
  }

  try {
    const deleted = await deleteProductById(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Produto não encontrado" });
    }
    res.json({ success: true, message: "Produto removido com sucesso" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro ao deletar produto", error: err.message });
  }
};

// ✅ Produtos populares
export const getPopularProducts = async (req, res) => {
  try {
    const popular = await getPopularProductsService();
    res.json({ success: true, data: popular });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro ao buscar produtos populares", error: err.message });
  }
};

// ✅ Sugestões
export const getSuggestions = async (req, res) => {
  try {
    const suggestions = await getSuggestionsService();
    res.json({ success: true, data: suggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro ao buscar sugestões", error: err.message });
  }
};

// ✅ Criar avaliação (com verificação de duplicidade)
export const createReview = async (req, res) => {
  const { id } = req.params;
  const { username, rating, comment } = req.body;

  if (!username || !rating || !comment) {
    return res.status(400).json({ success: false, message: "Todos os campos da avaliação são obrigatórios." });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Produto não encontrado" });
    }

    const alreadyReviewed = product.reviews?.some(r => r.username === username);
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: "Você já avaliou este produto." });
    }

    const review = { username, rating, comment };
    const updatedProduct = await addReviewToProduct(id, review);

    res.status(201).json({ success: true, message: "Avaliação adicionada com sucesso", data: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro ao adicionar avaliação", error: err.message });
  }
};
