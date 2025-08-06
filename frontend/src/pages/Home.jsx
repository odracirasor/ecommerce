import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import MiniCart from "../components/MiniCart";
import { motion } from "framer-motion";

const Home = ({ user, isAdmin, isSeller }) => {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("Todos");

  const { addToCart, cart, removeFromCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productRes, categoryRes] = await Promise.all([
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/categories"),
        ]);

        const [products, categoriesData] = await Promise.all([
          productRes.json(),
          categoryRes.json(),
        ]);

        setCategories(categoriesData);

        const grouped = {};
        categoriesData.forEach((cat) => {
          grouped[cat.name] = products.filter((product) => product.category === cat.name);
        });

        grouped["Todos"] = products;

        setProductsByCategory(grouped);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPrice = Array.isArray(cart)
    ? cart.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;

  const totalItems = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <div className="w-full relative bg-gray-200 min-h-screen">
      {/* Cabeçalho */}
      <section className="flex justify-between items-center mb-6 mt-4 px-6">
        <h2 className="text-xl font-bold text-gray-800"> Não sabes onde começar? Vem comigo </h2>
        <div className="flex gap-2">
          {(isAdmin || isSeller) && (
            <Link to="/admin" className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow">
              Painel Admin
            </Link>
          )}
          {isSeller && (
            <Link to="/postar" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow">
              + Adicionar Produto
            </Link>
          )}
        </div>
      </section>

      {/* Categorias Modernizadas */}
      <section className="px-6 mb-12 rounded-2xl shadow-xl bg-gradient-to-r from-gray-800 via-gray-900 to-black animate-gradient-x bg-[length:200%_200%]">
        <h3 className="text-2xl font-bold mb-6 text-white pt-6 px-2 sm:px-4">
          ✨ Categorias em Destaque
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-8 px-2 sm:px-4">
          {categories.map((cat) => {
            const isSelected = categoryFilter === cat.name;

            return (
              <motion.div
                key={cat._id}
                onClick={() => setCategoryFilter(cat.name)}
                whileHover={{ scale: 1.05 }}
                className={`relative rounded-xl overflow-hidden cursor-pointer group shadow-lg transition-transform duration-300 transform ${
                  isSelected ? "ring-4 ring-yellow-400" : ""
                }`}
              >
                <img
                  src={cat.image || "/images/placeholder.jpg"}
                  alt={cat.name}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 flex items-center justify-center transition duration-300">
                  <h4 className="text-sm font-semibold text-white drop-shadow-md px-2 text-center">
                    {cat.name}
                  </h4>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Produtos */}
      {loading ? (
        <p className="px-6">Carregando produtos...</p>
      ) : (
        Object.keys(productsByCategory).map((category) => {
          const filteredProducts = productsByCategory[category].filter(
            (product) =>
              categoryFilter === "Todos" || product.category === categoryFilter
          );

          if (filteredProducts.length === 0) return null;

          return (
            <section key={category} className="w-full mb-12 px-2 sm:px-4">
              <h3 className="text-xl font-bold mb-4 text-gray-800">{category}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div key={product._id} whileHover={{ scale: 1.03 }}>
                    <ProductCard
                      product={product}
                      onAddToCart={() => addToCart(product)}
                      isAdmin={isAdmin}
                      isSeller={isSeller}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })
      )}

      {/* Carrinho Flutuante */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCart(!showCart)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center relative"
      >
        <FaShoppingCart size={20} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
            {totalItems}
          </span>
        )}
      </motion.button>

      {showCart && (
        <MiniCart
          cart={cart}
          onRemoveItem={removeFromCart}
          totalPrice={totalPrice}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  );
};

export default Home;
