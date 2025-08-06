import React from "react";
import { motion } from "framer-motion";

const RelatedProducts = ({ products }) => {
  return (
    <motion.div
      className="mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        🆕 Vê o que há de novo
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((item, index) => (
          <motion.div
            key={item.id}
            className="bg-white p-3 rounded shadow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h4 className="text-sm font-semibold">{item.name}</h4>
            <p className="text-green-600 font-bold">
              Kz {item.price.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedProducts;
