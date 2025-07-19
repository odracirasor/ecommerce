import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Vendas = () => {
  const { currentUser } = useAuth();
  const [vendas, setVendas] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendas = async () => {
      try {
        const res = await axios.get(`/api/orders/seller/${currentUser._id}`);
        setVendas(res.data);
      } catch (err) {
        console.error("Erro ao buscar vendas:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchVendas();
    }
  }, [currentUser]);

  const vendasFiltradas = vendas.filter((venda) => {
    if (filtro === "todas") return true;
    return venda.status === filtro;
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minhas Vendas</h1>

      <div className="mb-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded ${filtro === "todas" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </button>
        <button
          className={`px-4 py-2 rounded ${filtro === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFiltro("pending")}
        >
          Pendentes
        </button>
        <button
          className={`px-4 py-2 rounded ${filtro === "completed" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFiltro("completed")}
        >
          Completadas
        </button>
        <button
          className={`px-4 py-2 rounded ${filtro === "failed" ? "bg-red-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFiltro("failed")}
        >
          Falhadas
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : vendasFiltradas.length === 0 ? (
        <p>Nenhuma venda encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {vendasFiltradas.map((venda) => (
            <li key={venda._id} className="p-4 border rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{venda.product.title}</p>
                  <p>Preço: {(venda.product.price / 100).toFixed(2)} Kz</p>
                  <p>Comprador: {venda.buyer?.name || "Anônimo"}</p>
                  <p>Status: <span className="font-semibold capitalize">{venda.status}</span></p>
                  <p className="text-sm text-gray-500">Data: {new Date(venda.createdAt).toLocaleString()}</p>
                </div>

                {venda.status === "failed" && (
                  <p className="text-red-600 font-bold">Reembolsado</p>
                )}

                {venda.status === "pending" && (
                  <p className="text-yellow-700 font-semibold">Aguardando confirmação do comprador</p>
                )}

                {venda.status === "completed" && (
                  <p className="text-green-700 font-semibold">Venda confirmada!</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Vendas;
