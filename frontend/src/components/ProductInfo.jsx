import React from "react";
import { Link } from "react-router-dom";
import {
  FaCartPlus,
  FaBox,
  FaComments,
  FaFire,
  FaRegCheckCircle,
  FaStore,
} from "react-icons/fa";
import { motion } from "framer-motion";

const ProductInfo = ({ product, formatDate }) => {
  const seller = product?.seller;
  const sellerName = seller?.name || "Vendedor desconhecido";
  const createdAt = product?.createdAt ? formatDate(product.createdAt) : "Data desconhecida";
  const sold = product?.sold ?? 0;

  const handleMessageClick = () => {
    alert(`Iniciar conversa com ${sellerName}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-4"
    >
      {/* Nome do produto */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">
          {product?.name || "Produto sem nome"}
        </h2>

        {/* Selos de destaque */}
        <div className="flex gap-2">
          {sold > 10 && (
            <motion.span
              whileHover={{ scale: 1.1 }}
              title="Este produto está entre os mais vendidos!"
              className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full"
            >
              <FaFire className="text-red-500" />
              Mais vendido
            </motion.span>
          )}
          {product?.isNew && (
            <motion.span
              whileHover={{ scale: 1.1 }}
              title="Produto recém-adicionado à loja"
              className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full"
            >
              Novo
            </motion.span>
          )}
        </div>
      </div>

      {/* Preço */}
      <p className="text-2xl font-bold text-green-600">
        Kz {product?.price?.toLocaleString() || "0"}
      </p>

      {/* Informações adicionais */}
      <div className="text-sm font-bold text-gray-700 space-y-1">
        <p>Publicado em: <span>{createdAt}</span></p>

        <p>
          Vendido por:{" "}
          {seller?._id ? (
            <Link
              to={`/user/${seller._id}`}
              className="text-blue-600 hover:underline font-bold"
              title="Ver perfil do vendedor"
            >
              {sellerName}
            </Link>
          ) : (
            <span>{sellerName}</span>
          )}
        </p>

        {product?.location && (
          <p title="Localização do produto">
            Localização:{" "}
            <span className="text-gray-900 font-bold">{product.location}</span>
          </p>
        )}

        <p>
          {product?.stock > 0 ? (
            <>Em estoque: <span>{product.stock}</span> unidades</>
          ) : (
            <span className="text-red-600">Esgotado</span>
          )}
        </p>

        <p className="flex items-center gap-2">
          <FaBox className="text-gray-500" />
          <span>Unidades vendidas: <span>{sold}</span></span>
        </p>
      </div>

      {/* Descrição */}
      <div className="text-sm font-bold text-gray-700 leading-relaxed border-t pt-3">
        {product?.description || "Sem descrição disponível para este produto."}
      </div>

      {/* Botões */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={product?.stock === 0}
          title="Clique para adicionar ao carrinho"
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold transition duration-200 ${
            product?.stock === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <FaCartPlus className="text-lg" />
          Adicionar ao carrinho
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleMessageClick}
          disabled={!seller?.name}
          title="Iniciar conversa com o vendedor"
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold transition duration-200 ${
            seller?.name
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <FaComments className="text-lg" />
          Enviar mensagem
        </motion.button>
      </div>

      {/* Informações adicionais ao final */}
      <div className="flex flex-col items-center pt-2 space-y-2">
        {/* Política de reembolso */}
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 text-sm font-bold text-blue-600"
          title="Política de Reembolso Garantida"
        >
          <div className="w-3 h-3 bg-blue-600 rounded-full" />
          Política de reembolso
        </motion.span>

        {/* Produto BUE */}
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 text-sm font-bold text-gray-500"
          title="Produto oficial da plataforma BUE"
        >
          <FaStore className="text-gray-500" />
          Produto BUE
        </motion.span>
      </div>
    </motion.div>
  );
};

export default ProductInfo;
