import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(data.wishlist || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      setMessage("Produto removido da wishlist!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Carregando wishlist...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Minha Wishlist
      </motion.h1>

      {message && <p className="text-green-600 text-center mb-4">{message}</p>}

      {wishlist.length === 0 ? (
        <p className="text-gray-600 text-lg text-center">Sua wishlist está vazia.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {wishlist.map((product) => (
              <motion.div
                key={product._id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">Kz {product.price}</p>
                <div className="mt-auto flex justify-between">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Ver Produto
                  </button>
                  <button
                    onClick={() => removeItem(product._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remover
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
