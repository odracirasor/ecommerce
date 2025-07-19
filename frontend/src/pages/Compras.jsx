import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Compras = () => {
  const { currentUser } = useAuth();
  const [compras, setCompras] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const res = await axios.get(`/api/orders/user/${currentUser._id}`);
        setCompras(res.data);
      } catch (err) {
        console.error("Erro ao buscar compras:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchCompras();
    }
  }, [currentUser]);

  const confirmarRecebimento = async (orderId) => {
    try {
      await axios.put(`/api/orders/confirm/${orderId}`);
      setCompras((prev) =>
        prev.map((c) =>
          c._id === orderId ? { ...c, status: "completed" } : c
        )
      );
    } catch (err) {
      console.error("Erro ao confirmar recebimento:", err);
    }
  };

  const comprasFiltradas = compras.filter((compra) => {
    if (filtro === "todas") return true;
    return compra.status === filtro;
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minhas Compras</h1>

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
      ) : comprasFiltradas.length === 0 ? (
        <p>Nenhuma compra encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {comprasFiltradas.map((compra) => (
            <li key={compra._id} className="p-4 border rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{compra.product.title}</p>
                  <p>Preço: {(compra.product.price / 100).toFixed(2)} Kz</p>
                  <p>Status: <span className="font-semibold capitalize">{compra.status}</span></p>
                  <p className="text-sm text-gray-500">Data: {new Date(compra.createdAt).toLocaleString()}</p>
                </div>

                {compra.status === "pending" && (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => confirmarRecebimento(compra._id)}
                  >
                    Confirmar Recebimento
                  </button>
                )}

                {compra.status === "failed" && (
                  <p className="text-red-600 font-bold">Reembolsado</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Compras;
