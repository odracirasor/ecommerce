import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function UpdateOrderStatusPage() {
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/orders/${id}/status`,
        { status, deliveryStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Status atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao atualizar status");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Atualizar Status do Pedido</h2>
      {message && <p className="mb-2 text-green-600">{message}</p>}
      <form onSubmit={handleUpdate} className="space-y-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Status Pagamento</option>
          <option value="pending">Pendente</option>
          <option value="paid">Pago</option>
          <option value="cancelled">Cancelado</option>
        </select>

        <select
          value={deliveryStatus}
          onChange={(e) => setDeliveryStatus(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Status Entrega</option>
          <option value="pendente">Pendente</option>
          <option value="processando">Processando</option>
          <option value="enviado">Enviado</option>
          <option value="entregue">Entregue</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Atualizar
        </button>
      </form>
    </div>
  );
}
