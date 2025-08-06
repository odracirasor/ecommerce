import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Erro ao buscar pedidos");
        const data = await res.json();

        // ✅ Garante compatibilidade caso backend envie um array direto
        const ordersArray = Array.isArray(data) ? data : data.orders || [];
        setOrders(ordersArray);
      } catch (error) {
        console.error(error);
        setOrders([]); // fallback
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p>Carregando pedidos...</p>;
  if (!orders.length) return <p>Nenhum pedido encontrado</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Todos os Pedidos</h1>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#007bff", color: "#fff" }}>
          <tr>
            <th>ID</th>
            <th>Usuário</th>
            <th>Total</th>
            <th>Status</th>
            <th>Entrega</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.userId?.username || "Desconhecido"}</td>
              <td>{order.totalAmount} KZ</td>
              <td>{order.status}</td>
              <td>{order.deliveryStatus}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
