import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [popularProducts, setPopularProducts] = useState([]);
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout");
  };

  useEffect(() => {
    if (cart.length === 0) {
      axios
        .get("/api/products/popular")
        .then((res) => setPopularProducts(res.data))
        .catch((err) =>
          console.error("Erro ao buscar produtos populares:", err)
        );
    }
  }, [cart]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Seu Carrinho</h2>

      {cart.length === 0 ? (
        <div>
          <p className="text-gray-500 mb-4">Seu carrinho está vazio.</p>
          <h3 className="text-xl font-semibold mb-2">🔥 Produtos populares:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {popularProducts.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="border p-4 rounded hover:shadow"
              >
                <img
                  src={product.image || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h4 className="text-lg font-semibold">{product.name}</h4>
                <p className="text-gray-600">
                  Kz {product.price?.toLocaleString() || "N/A"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b py-4"
            >
              <Link to={`/product/${item._id}`}>
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded mr-4"
                />
              </Link>

              <div className="flex-1">
                <Link
                  to={`/product/${item._id}`}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  <h3 className="text-lg">{item.name}</h3>
                </Link>
                <p className="text-sm text-gray-600">
                  Categoria: {item.category}
                </p>
                <p className="text-sm text-gray-600">
                  Preço Unitário:{" "}
                  <strong>Kz {item.price.toLocaleString()}</strong>
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item._id, Math.max(item.quantity - 1, 1))
                    }
                    className="px-2 py-1 bg-gray-300 text-gray-800 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-300 text-gray-800 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="font-semibold">
                  Total: Kz {(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-6 text-lg font-bold">
            Total Geral: Kz {total.toLocaleString()}
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={handleCheckout}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
            >
              ✅ Proceder ao Pagamento
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
