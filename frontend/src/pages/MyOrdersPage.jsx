import { useEffect, useState } from "react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Erro ao buscar pedidos (${res.status})`);
        }

        const data = await res.json();
        setOrders(data.orders || []); // <-- evita undefined
      } catch (err) {
        setError(err.message || "Erro ao carregar pedidos");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p>Carregando compras...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Minhas compras</h1>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} className="p-4 border rounded shadow mb-4">
            <p><strong>Pedido #{order._id}</strong></p>
            <p>Total: {order.totalAmount} Kz</p>
          </div>
        ))
      ) : (
        <p>Você não tem compras ainda.</p>
      )}
    </div>
  );
}
