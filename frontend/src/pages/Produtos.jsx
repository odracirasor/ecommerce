import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const Produtos = () => {
  const { currentUser } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await axios.get(`/api/products/seller/${currentUser._id}`);
        setProdutos(res.data);
      } catch (err) {
        console.error("Erro ao buscar produtos do vendedor:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchProdutos();
    }
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja mesmo apagar este produto?")) return;

    try {
      await axios.delete(`/api/products/${id}`);
      setProdutos((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Erro ao apagar produto:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meus Produtos à Venda</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : produtos.length === 0 ? (
        <p>Você não tem produtos ativos no momento.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {produtos.map((produto) => (
            <li key={produto._id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-bold">{produto.title}</h2>
              <p className="text-gray-700">Preço: {(produto.price / 100).toFixed(2)} Kz</p>
              <p className="text-sm text-gray-500">ID: {produto._id}</p>

              <div className="mt-2 flex gap-2">
                <Link
                  to={`/edit-product/${produto._id}`}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(produto._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Apagar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Produtos;
