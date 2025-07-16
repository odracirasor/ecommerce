import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error("Produto não encontrado.");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-4">🔄 Carregando...</div>;
  if (error) return <div className="p-4 text-red-600">❌ {error}</div>;
  if (!product) return null;

  const itemInCart = cart.find(p => p._id === product._id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;
  const isOutOfStock =
    product.stock !== undefined && quantityInCart >= product.stock;

  const handleMessageSeller = () => {
    navigate(`/messages/${encodeURIComponent(product.author)}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-cover rounded"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-2">{product.category}</p>
          <p className="text-red-600 font-semibold text-xl mb-2">
            {product.price.toLocaleString("pt-AO", {
              style: "currency",
              currency: "AOA",
              minimumFractionDigits: 0
            })}
          </p>

          {product.stock !== undefined && (
            <p className="text-sm text-gray-700 mb-2">
              <strong>Estoque disponível:</strong> {product.stock}
            </p>
          )}

          {isOutOfStock && (
            <p className="text-red-600 text-sm font-semibold mb-2">
              ❌ Você já adicionou o máximo disponível deste produto ao carrinho!
            </p>
          )}

          <p className="text-sm text-gray-600 mb-1">
            <strong>Publicado por:</strong> {product.author}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Data:</strong>{" "}
            {new Date(product.postedAt).toLocaleDateString("pt-AO")}
          </p>

          <p className="mb-6">{product.description}</p>

          <div className="flex gap-4">
            <button
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
              className={`px-6 py-2 rounded text-white ${
                isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isOutOfStock ? "Estoque Esgotado" : "Adicionar ao Carrinho"}
            </button>

            <button
              onClick={handleMessageSeller}
              className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
            >
              Enviar Mensagem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
