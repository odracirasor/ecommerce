import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (price) => {
  return price.toLocaleString("pt-PT", {
    style: "decimal",
    minimumFractionDigits: 0,
  });
};

const ProductCard = ({ product, onAddToCart, isAdmin, isSeller }) => {
  const stars = Math.round(product.rating || 0);
  const navigate = useNavigate();

  return (
    <div className="border rounded-xl p-3 shadow-sm hover:shadow-md transition bg-white text-sm">
      <div
        className="cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded-md mb-2"
        />
      </div>

      <h3 className="font-semibold text-base mb-1 truncate">{product.name}</h3>

      <p className="text-gray-600 text-xs mb-1">
        <span className="font-medium">Autor:</span> {product.author || "Desconhecido"}
      </p>

      <p className="text-gray-600 text-xs mb-1">
        <span className="font-medium">Publicado:</span> {formatDate(product.createdAt)}
      </p>

      <div className="flex items-center text-yellow-500 text-xs mb-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            fill={i < stars ? "currentColor" : "none"}
            strokeWidth={1}
            size={14}
          />
        ))}
        <span className="ml-1 text-gray-600 text-[11px]">
          ({product.numReviews || 0} avaliações)
        </span>
      </div>

      <p className="font-bold text-green-700 mb-2">
        AOA {formatPrice(product.price)}
      </p>

      {!isAdmin && !isSeller && (
        <button
          onClick={onAddToCart}
          className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-700 w-full"
        >
          Adicionar ao carrinho
        </button>
      )}
    </div>
  );
};

export default ProductCard;
