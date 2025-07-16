import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

const realCategories = [
  "All",
  "Electrónica",
  "Roupas",
  "Calçados",
  "Alimentos",
  "Móveis",
  "Telemóveis",
  "Acessórios",
  "Beleza",
  "Casa & Cozinha",
  "Desporto",
  "Brinquedos"
];

const Home = () => {
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [notification, setNotification] = useState("");
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Erro ao carregar produtos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]);

  const filtered = products.filter((p) => {
    const matchCategory = category === "All" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification(`✅ "${product.name}" adicionado ao carrinho`);
    setTimeout(() => setNotification(""), 3000);
  };

  const toggleMiniCart = () => setShowMiniCart(!showMiniCart);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao deletar produto");

      setProducts(products.filter((p) => p._id !== id));
      setNotification("🗑️ Produto removido com sucesso");
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir o produto");
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Catálogo de Produtos</h1>

      {notification && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded border border-green-300">
          {notification}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded border border-red-300">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          {realCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Pesquisar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Carregando produtos...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div key={product._id} className="relative border p-4 rounded shadow">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover mb-2 rounded"
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                  <h3 className="text-lg font-bold hover:underline">{product.name}</h3>
                </Link>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-sm">{product.description}</p>
                <p className="text-blue-600 font-semibold">
                  {Number(product.price).toLocaleString("pt-AO")} Kz
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Adicionar ao Carrinho
                </button>

                {isAdmin && (
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    title="Remover produto"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && !loading && (
            <p className="mt-4">Nenhum produto encontrado.</p>
          )}
        </>
      )}

      <button
        onClick={toggleMiniCart}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50 relative"
      >
        <FaShoppingCart size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {cart.length}
          </span>
        )}
      </button>

      {showMiniCart && (
        <div className="fixed bottom-24 right-6 bg-white border shadow-lg p-4 rounded w-72 max-h-96 overflow-y-auto z-50">
          <h3 className="text-lg font-semibold mb-2">🛒 Itens no Carrinho</h3>
          {cart.length === 0 ? (
            <p className="text-gray-500">Seu carrinho está vazio.</p>
          ) : (
            <ul className="space-y-2">
              {cart.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center text-sm">
                  <span>{item.name}</span>
                  <span className="text-gray-600">
                    {Number(item.price).toLocaleString("pt-AO")} Kz
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/cart"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full text-center"
          >
            Ver Carrinho
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
