import React from "react";
import { motion } from "framer-motion";
import { FaTag, FaLayerGroup, FaWeightHanging, FaPalette } from "react-icons/fa";

const ProductSpecifications = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4">Especificações</h3>
      <ul className="space-y-3 text-gray-700 text-sm font-medium">
        <motion.li
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3"
        >
          <FaTag className="text-blue-500" />
          <span>
            Marca: <strong>{product.brand || "—"}</strong>
          </span>
        </motion.li>

        <motion.li
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3"
        >
          <FaLayerGroup className="text-purple-500" />
          <span>
            Categoria: <strong>{product.category || "—"}</strong>
          </span>
        </motion.li>

        <motion.li
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3"
        >
          <FaWeightHanging className="text-green-500" />
          <span>
            Peso: <strong>{product.weight ? `${product.weight} kg` : "—"}</strong>
          </span>
        </motion.li>

        <motion.li
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3"
        >
          <FaPalette className="text-pink-500" />
          <span>
            Cor: <strong>{product.color || "—"}</strong>
          </span>
        </motion.li>
      </ul>
    </motion.div>
  );
};

export default ProductSpecifications;
