import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(1500); // taxa fixa de exemplo

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(data || { items: [] });
      if ((data?.items?.length || 0) > 3) setDiscount(0.1); // 10% desconto se +3 itens
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.patch(
        "/api/cart/update",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(data);
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete("/api/cart/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId },
      });
      setCart(data);
    } catch (error) {
      console.error(error);
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart({ items: [] });
      setMessage("Carrinho esvaziado com sucesso!");
    } catch (error) {
      console.error(error);
    }
  };

  const formatPrice = (price) =>
    price.toLocaleString("pt-AO", { minimumFractionDigits: 2 });

  const subtotal = cart.items?.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount + (cart.items?.length > 0 ? shipping : 0);

  if (loading) return <p className="text-center mt-10 text-lg">Carregando carrinho...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Meu Carrinho
      </motion.h1>

      {message && <p className="text-green-600 mb-4 text-center">{message}</p>}

      {cart.items.length === 0 ? (
        <p className="text-gray-600 text-lg text-center">Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className="space-y-4">
            <AnimatePresence>
              {cart.items.map((item) => (
                <motion.div
                  key={item.productId._id}
                  className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <Link to={`/products/${item.productId._id}`}>
                      <img
                        src={item.productId.images?.[0]?.url || "/placeholder.jpg"}
                        alt={item.productId.name}
                        className="w-24 h-24 object-cover rounded-lg shadow hover:opacity-90"
                      />
                    </Link>
                    <div>
                      <Link
                        to={`/products/${item.productId._id}`}
                        className="text-lg font-semibold hover:underline"
                      >
                        {item.productId.name}
                      </Link>
                      <p className="text-gray-600">
                        {item.quantity} × Kz {formatPrice(item.productId.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId._id, item.quantity - 1)
                      }
                      className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId._id, item.quantity + 1)
                      }
                      className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.productId._id)}
                      className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remover
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <motion.div
            className="mt-8 bg-gray-50 p-6 rounded-lg shadow"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-xl font-semibold mb-4">Resumo</h3>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>Kz {formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Frete:</span>
              <span>Kz {formatPrice(shipping)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 mb-2">
                <span>Desconto:</span>
                <span>-Kz {formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>Kz {formatPrice(total)}</span>
            </div>
          </motion.div>

          <div className="mt-6 flex flex-col md:flex-row justify-between gap-4">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full md:w-auto"
            >
              Esvaziar Carrinho
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full md:w-auto">
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}
