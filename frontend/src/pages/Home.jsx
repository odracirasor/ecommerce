import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaTrash, FaEdit } from "react-icons/fa";

const realCategories = [
  "All", "Electrónica", "Roupas", "Calçados", "Alimentos", "Móveis",
  "Telemóveis", "Acessórios", "Beleza", "Casa & Cozinha", "Desporto", "Brinquedos"
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isSeller = localStorage.getItem("isSeller") === "true";
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!API_URL) {
      setError("❌ API_URL não definida. Verifique o arquivo .env");
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
        const data = await res.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Erro ao carregar produtos. Verifique a API.");
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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao deletar produto");

      setProducts(products.filter((p) => p._id !== id));
      setNotification("🗑️ Produto removido com sucesso");
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir o produto");
    }
  };

  // Improved draggable mini-cart functions
  const handleMouseDown = (e) => {
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Notifications */}
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

      {/* Filters */}
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

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-8">
          <p>Carregando produtos...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div key={product._id} className="relative border p-4 rounded shadow hover:shadow-lg transition-shadow bg-white">
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
                <p className="text-sm line-clamp-2">{product.description}</p>
                <p className="text-blue-600 font-semibold">
                  {Number(product.price).toLocaleString("pt-AO")} Kz
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                >
                  Adicionar ao Carrinho
                </button>

                {(isAdmin || isSeller) && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Link
                      to={`/edit-product/${product._id}`}
                      className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                      title="Editar produto"
                    >
                      <FaEdit size={14} />
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      title="Remover produto"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && !loading && (
            <p className="mt-4">Nenhum produto encontrado.</p>
          )}
        </>
      )}

      {/* Mini Cart Button */}
      <button
        onClick={toggleMiniCart}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50 transition-transform hover:scale-110"
      >
        <FaShoppingCart size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {cart.length}
          </span>
        )}
      </button>

      {/* Draggable Mini Cart Panel */}
      {showMiniCart && (
        <div
          className="fixed bg-white border shadow-lg p-4 rounded-lg w-72 max-h-96 overflow-y-auto z-50"
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
            cursor: 'move'
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="flex justify-between items-center mb-3 pb-2 border-b">
            <h3 className="text-lg font-semibold">🛒 Carrinho ({cart.length})</h3>
            <button 
              onClick={toggleMiniCart}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          {cart.length === 0 ? (
            <p className="text-gray-500">Seu carrinho está vazio.</p>
          ) : (
            <ul className="space-y-3">
              {cart.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded">
                  <span className="truncate max-w-[180px]">{item.name}</span>
                  <span className="text-gray-600 whitespace-nowrap">
                    {Number(item.price).toLocaleString("pt-AO")} Kz
                  </span>
                </li>
              ))}
            </ul>
          )}
          
          {cart.length > 0 && (
            <div className="mt-4 pt-3 border-t">
              <p className="font-semibold text-right mb-3">
                Total: {Number(cart.reduce((sum, item) => sum + item.price, 0)).toLocaleString("pt-AO")} Kz
              </p>
              <Link
                to="/cart"
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Finalizar Compra
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;