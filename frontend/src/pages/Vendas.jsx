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

  const formatPrice = (price) => {
    const value = Math.max(price, 0);
    return value.toLocaleString("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 2,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📦 Minhas Vendas</h1>

      <div className="mb-6 flex flex-wrap justify-center gap-3">
        {["todas", "pending", "completed", "failed"].map((status) => {
          const label = {
            todas: "Todas",
            pending: "Pendentes",
            completed: "Completadas",
            failed: "Falhadas",
          }[status];

          const color = {
            todas: "bg-blue-500",
            pending: "bg-yellow-500",
            completed: "bg-green-600",
            failed: "bg-red-500",
          }[status];

          return (
            <button
              key={status}
              className={`px-5 py-2 rounded-full font-medium shadow ${
                filtro === status
                  ? `${color} text-white`
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setFiltro(status)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-center">🔄 Carregando...</p>
      ) : vendasFiltradas.length === 0 ? (
        <p className="text-center text-gray-600">Nenhuma venda encontrada.</p>
      ) : (
        <ul className="space-y-6">
          {vendasFiltradas.map((venda) => (
            <li key={venda._id} className="p-5 border rounded-xl shadow-md bg-white">
              <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{venda.product.title}</h2>
                  <p className="text-gray-700">💰 Preço: {formatPrice(venda.product.price / 100)}</p>
                  <p>👤 Comprador: {venda.buyer?.name || "Anônimo"}</p>
                  <p>Status: <span className="capitalize font-medium">{venda.status}</span></p>
                  <p className="text-sm text-gray-500">📅 {new Date(venda.createdAt).toLocaleString()}</p>
                </div>

                <div className="text-right">
                  {venda.status === "failed" && (
                    <p className="text-red-600 font-bold">Reembolsado</p>
                  )}
                  {venda.status === "pending" && (
                    <p className="text-yellow-600 font-semibold">Aguardando confirmação</p>
                  )}
                  {venda.status === "completed" && (
                    <p className="text-green-600 font-semibold">Venda confirmada!</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Vendas;
