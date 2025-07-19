// src/components/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product, onAdd }) => (
  <div className="border rounded p-4 shadow hover:shadow-lg transition">
    <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
    <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
    <p className="text-gray-500">{product.description}</p>
    <p className="font-bold text-blue-600 text-lg">${product.price.toFixed(2)}</p>
    <button
      className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
      onClick={() => onAdd(product)}
    >
      Add to Cart
    </button>
  </div>
);

export default ProductCard;
