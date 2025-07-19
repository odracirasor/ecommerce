import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaImage } from "react-icons/fa";

const Produtos = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // Make sure this is saved at login

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar os produtos");

        const data = await res.json();

        const myUnsold = data.filter(
          (p) => p.sellerId === userId && p.status !== "sold"
        );

        setProducts(myUnsold);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar seus produtos.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, [API_URL, token, userId]);

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao excluir o produto");

      setProducts((prev) => prev.filter((p) => p._id !== id));
      setNotification("🗑️ Produto excluído com sucesso");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Erro ao deletar produto");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📦 Meus Produtos à Venda</h1>

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

      {loading ? (
        <p>Carregando...</p>
      ) : products.length === 0 ? (
        <p>Você ainda não tem produtos ativos à venda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded shadow hover:shadow-lg transition bg-white relative"
            >
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-2"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-gray-500 text-sm">{product.category}</p>
              <p className="text-sm truncate">{product.description}</p>
              <p className="text-blue-600 font-bold">
                {Number(product.price).toLocaleString("pt-AO")} Kz
              </p>

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/edit-product/${product._id}`}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-2"
                >
                  <FaEdit /> Editar
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-2"
                >
                  <FaTrash /> Excluir
                </button>
              </div>

              <Link
                to={`/add-images/${product._id}`}
                className="mt-3 block text-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-2"
              >
                <FaImage /> Adicionar Imagens
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Produtos;
